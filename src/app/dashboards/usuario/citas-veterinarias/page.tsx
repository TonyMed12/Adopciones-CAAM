"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { CalendarDays, PlusCircle, ClipboardList, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHead from "@/components/layout/PageHead";

function toLocalDateString(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  d.setHours(12);
  return d.toLocaleDateString("sv-SE");
}

export default function CitasVeterinariasPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [citas, setCitas] = useState<any[]>([]);
  const [modo, setModo] = useState<"lista" | "agendar">("lista");
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(
    null
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(
    null
  );
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [filtro, setFiltro] = useState<
    "todas" | "pendiente" | "aprobada" | "cancelada"
  >("todas");

  const horasDisponibles = [
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
  ];

  // 🧩 Usuario
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  // 🐶 Mascotas adoptadas
  useEffect(() => {
    if (!userId) return;
    const fetchMascotas = async () => {
      const { data } = await supabase
        .from("mascotas_adoptadas")
        .select(
          "mascota_id, mascota_nombre, imagen_url, adopcion_id, estado_mascota"
        )
        .eq("adoptante_auth_id", userId)
        .eq("estado_mascota", "adoptada");
      if (data) setMascotas(data);
    };
    fetchMascotas();
  }, [userId]);

  // 📋 Citas
  useEffect(() => {
    if (!mascotas.length) return;
    const fetchCitas = async () => {
      const { data } = await supabase
        .from("citas_veterinarias")
        .select("id, fecha_cita, motivo, estado, adopcion_id")
        .in(
          "adopcion_id",
          mascotas.map((m) => m.adopcion_id)
        )
        .order("fecha_cita", { ascending: true });
      if (data) {
        setCitas(data);
        const tienePendiente = data.some((c) => c.estado === "pendiente");
        setBloqueado(tienePendiente);
      }
    };
    fetchCitas();
  }, [mascotas]);

  //  Guardar cita
  const handleConfirmarCita = async () => {
    if (
      !mascotaSeleccionada ||
      !fechaSeleccionada ||
      !horaSeleccionada ||
      !motivo
    ) {
      setMensaje("Completa todos los campos antes de confirmar la cita.");
      return;
    }

    const fechaCompleta = new Date(
      `${fechaSeleccionada}T${horaSeleccionada}:00`
    );

    // 1. Registrar cita en BD
    const { error } = await supabase.from("citas_veterinarias").insert([
      {
        adopcion_id: mascotaSeleccionada.adopcion_id,
        fecha_cita: fechaCompleta.toISOString(),
        motivo,
        estado: "pendiente",
      },
    ]);

    if (error) {
      console.error(error);
      setMensaje("Ocurrió un error al registrar la cita.");
      return;
    }

    // 2. Obtener datos del usuario para correo
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email || "";
    const nombre = userData?.user?.user_metadata?.full_name || "Usuario";

    // 3. Enviar correo
    try {
      await fetch("/api/email/citaVeterinaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre,
          nombreMascota: mascotaSeleccionada.mascota_nombre,
          fechaTexto: fechaCompleta.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          horaTexto: horaSeleccionada,
          motivo,
        }),
      });
    } catch (e) {
      console.error("Error enviando correo de cita veterinaria:", e);
    }

    // 4. Reset UI
    setModo("lista");
    setMotivo("");
    setFechaSeleccionada(null);
    setHoraSeleccionada(null);
    setMensaje("✅ Cita agendada correctamente. Espera confirmación del CAAM.");

    const { data } = await supabase
      .from("citas_veterinarias")
      .select("id, fecha_cita, motivo, estado, adopcion_id")
      .in(
        "adopcion_id",
        mascotas.map((m) => m.adopcion_id)
      )
      .order("fecha_cita", { ascending: true });

    setCitas(data || []);
  };

  // === Calendario con navegación, padding y reglas de habilitación ===
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());

  // helpers de fechas (sin horas)
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const addDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };

  const hoy = startOfDay(new Date());
  const manana = startOfDay(addDays(new Date(), 1)); // solo permitir desde mañana

  const generarCeldasMes = () => {
    const primerDiaMes = new Date(anioActual, mesActual, 1);
    const ultimoDiaMes = new Date(anioActual, mesActual + 1, 0);
    const primerSemanaIndex = primerDiaMes.getDay(); // 0=Domingo ... 6=Sábado

    const celdas: Array<null | {
      d: number;
      fecha: Date;
      deshabilitado: boolean;
    }> = [];

    // padding antes del día 1 para alinear con cabecera (D, L, M, M, J, V, S)
    for (let i = 0; i < primerSemanaIndex; i++) celdas.push(null);

    // días del mes
    for (let d = 1; d <= ultimoDiaMes.getDate(); d++) {
      const fecha = new Date(anioActual, mesActual, d);
      const dow = fecha.getDay(); // 0 dom, 6 sáb
      const esFinDeSemana = dow === 0 || dow === 6;
      // bloquear fines de semana y todo < mañana (hoy incluido)
      // 🔒 Bloquear fines de semana, días pasados y más de 30 días adelante
      const limiteMaximo = startOfDay(addDays(hoy, 30)); // límite de 30 días
      const deshabilitado =
        esFinDeSemana ||
        startOfDay(fecha) < manana ||
        startOfDay(fecha) > limiteMaximo;
      celdas.push({ d, fecha, deshabilitado });
    }

    return celdas;
  };

  const celdas = generarCeldasMes();

  const cambiarMes = (dir: "prev" | "next") => {
    setMesActual((prev) => {
      if (dir === "next") {
        if (prev === 11) {
          setAnioActual((y) => y + 1);
          return 0;
        }
        return prev + 1;
      } else {
        if (prev === 0) {
          setAnioActual((y) => y - 1);
          return 11;
        }
        return prev - 1;
      }
    });
  };

  const nombreMes = new Date(anioActual, mesActual).toLocaleString("es-MX", {
    month: "long",
    year: "numeric",
  });

  // (si usas filtro/estadoColor/obtenerMascotaPorAdopcion, déjalos como están)

  const estadoColor = {
    pendiente: "text-orange-700 bg-orange-50",
    aprobada: "text-green-700 bg-green-50",
    cancelada: "text-red-700 bg-red-50",
  } as const;

  const obtenerMascotaPorAdopcion = (id: string) =>
    mascotas.find((m) => m.adopcion_id === id)?.mascota_nombre || "Desconocida";

  const citasFiltradas =
    filtro === "todas" ? citas : citas.filter((c) => c.estado === filtro);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl p-5 sm:p-8">
      {/* Header */}
      <PageHead
        title="Citas Veterinarias"
        subtitle="Agenda nuevas citas y revisa el estado de las existentes."
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 text-center sm:text-left">
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <Button
            variant={modo === "lista" ? "primary" : "ghost"}
            onClick={() => setModo("lista")}
          >
            <ClipboardList className="w-4 h-4 mr-2" /> Mis citas
          </Button>
          <Button
            variant={modo === "agendar" ? "primary" : "ghost"}
            onClick={() => {
              if (bloqueado) {
                setMensaje(
                  "Ya tienes una cita pendiente. Espera la confirmación del CAAM antes de agendar otra."
                );
                return;
              }
              setModo("agendar");
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Agendar nueva cita
          </Button>
        </div>
      </div>

      {/* Mensaje global */}
      {mensaje && (
        <div
          className={`mt-4 text-center text-sm p-3 rounded-lg ${
            mensaje.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-yellow-50 text-yellow-800 border border-yellow-200"
          }`}
        >
          {mensaje}
        </div>
      )}

      {/* Contenido dinámico */}
      <AnimatePresence mode="wait">
        {modo === "lista" ? (
          <motion.div
            key="lista"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {citas.length === 0 ? (
              <p className="text-gray-600 text-center py-10">
                Aún no tienes citas veterinarias registradas.
              </p>
            ) : (
              <>
                {/* Filtro */}
                <div className="flex justify-end mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#8B4513]" />
                    <select
                      value={filtro}
                      onChange={(e) =>
                        setFiltro(e.target.value as typeof filtro)
                      }
                      className="border rounded-lg px-3 py-1 text-sm text-[#8B4513] bg-[#FFF8F3] focus:ring-[#8B4513] focus:outline-none"
                    >
                      <option value="todas">Todas</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="aprobada">Aprobadas</option>
                      <option value="cancelada">Canceladas</option>
                    </select>
                  </div>
                </div>

                {/* ------------------- DESKTOP TABLE ------------------- */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#FFF1E6] text-[#8B4513]">
                      <tr>
                        <th className="px-4 py-3 text-left">Mascota</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Hora</th>
                        <th className="px-4 py-3 text-left">Motivo</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {citasFiltradas.map((cita) => {
                        const fecha = new Date(cita.fecha_cita);
                        const fechaStr = fecha.toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                        const horaStr = fecha.toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const mascota = obtenerMascotaPorAdopcion(
                          cita.adopcion_id
                        );

                        return (
                          <tr
                            key={cita.id}
                            className="border-t hover:bg-[#FFF8F3] transition"
                          >
                            <td className="px-4 py-3 font-semibold text-[#8B4513]">
                              {mascota}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {fechaStr}
                            </td>
                            <td className="px-4 py-3 font-medium">{horaStr}</td>
                            <td className="px-4 py-3">{cita.motivo}</td>
                            <td
                              className={`px-4 py-3 rounded-lg ${
                                estadoColor[cita.estado]
                              }`}
                            >
                              {cita.estado.charAt(0).toUpperCase() +
                                cita.estado.slice(1)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ------------------- MOBILE CARDS ------------------- */}
                <div className="grid sm:hidden gap-4 mt-4">
                  {citasFiltradas.map((cita) => {
                    const fecha = new Date(cita.fecha_cita);
                    const fechaStr = fecha.toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    const horaStr = fecha.toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const mascota = obtenerMascotaPorAdopcion(cita.adopcion_id);

                    return (
                      <div
                        key={cita.id}
                        className="bg-white border border-[#E5D1B8] rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-[#8B4513]">
                            {mascota}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              estadoColor[cita.estado]
                            }`}
                          >
                            {cita.estado}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700">
                          <b>Fecha:</b> {fechaStr}
                        </p>
                        <p className="text-sm text-gray-700">
                          <b>Hora:</b> {horaStr}
                        </p>

                        {cita.motivo && (
                          <p className="text-sm text-gray-700 mt-1">
                            <b>Motivo:</b> {cita.motivo}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="agendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-8"
          >
            {/* Mascotas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mascotas.map((m) => (
                <div
                  key={m.mascota_id}
                  className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer transition ${
                    mascotaSeleccionada?.mascota_id === m.mascota_id
                      ? "bg-[#FFF1E6] border-[#8B4513]"
                      : "hover:bg-[#FFF8F3]"
                  }`}
                  onClick={() => setMascotaSeleccionada(m)}
                >
                  <img
                    src={m.imagen_url}
                    alt={m.mascota_nombre}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-[#8B4513]">
                      {m.mascota_nombre}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Estado: {m.estado_mascota}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📍 CAAM - Centro de Atención Animal de Morelia
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendario y formulario */}
            {mascotaSeleccionada && (
              <div className="border-t pt-6 space-y-6">
                <div>
                  <h3 className="font-medium text-[#8B4513] mb-3">
                    Selecciona la fecha de tu cita
                  </h3>

                  {/* Navegación de mes */}
                  <div className="flex items-center justify-between mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cambiarMes("prev")}
                      // opcional: bloquear retroceso a meses donde todo ya está deshabilitado
                      disabled={
                        new Date(anioActual, mesActual, 1) <=
                        new Date(hoy.getFullYear(), hoy.getMonth(), 1)
                      }
                      title="Mes anterior"
                    >
                      ◀️
                    </Button>
                    <span className="text-[#8B4513] font-semibold capitalize">
                      {nombreMes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cambiarMes("next")}
                      title="Mes siguiente"
                    >
                      ▶️
                    </Button>
                  </div>

                  {/* Cabecera de días */}
                  <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {["D", "L", "M", "M", "J", "V", "S"].map((d) => (
                      <span
                        key={d}
                        className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Celdas (padding + días) */}
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {celdas.map((cell, idx) => {
                      if (cell === null) {
                        // padding vacío
                        return <div key={`pad-${idx}`} />;
                      }
                      const { d, fecha, deshabilitado } = cell;
                      const dateStr = toLocalDateString(
                        fecha.getFullYear(),
                        fecha.getMonth(),
                        fecha.getDate()
                      );
                      const seleccionado = fechaSeleccionada === dateStr;
                      return (
                        <button
                          key={d}
                          disabled={deshabilitado}
                          onClick={() =>
                            !deshabilitado && setFechaSeleccionada(dateStr)
                          }
                          className={`py-2 text-sm rounded-lg transition ${
                            deshabilitado
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : seleccionado
                              ? "bg-[#8B4513] text-white font-semibold"
                              : "hover:bg-[#FFF1E6] text-[#8B4513]"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    * No disponible fines de semana. Puedes agendar a partir de
                    mañana.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    * Solo puedes agendar citas dentro de los próximos 30 días.
                  </p>
                </div>

                {fechaSeleccionada && (
                  <div>
                    <h3 className="font-medium text-[#8B4513] mb-2">
                      Selecciona un horario
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {horasDisponibles.map((hora) => (
                        <button
                          key={hora}
                          onClick={() => setHoraSeleccionada(hora)}
                          className={`py-2 rounded-lg border text-sm transition ${
                            horaSeleccionada === hora
                              ? "bg-[#8B4513] text-white border-[#A0522D]"
                              : "hover:bg-[#FFF1E6]"
                          }`}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {horaSeleccionada && (
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-1">
                      Motivo de la cita
                    </label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Describe brevemente el motivo..."
                      className="w-full border rounded-lg p-2 h-24 resize-none focus:ring-2 focus:ring-[#FDE68A] focus:outline-none transition"
                    />
                  </div>
                )}

                {motivo && (
                  <div className="text-center">
                    <Button
                      onClick={handleConfirmarCita}
                      variant="primary"
                      size="lg"
                    >
                      Confirmar cita
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
