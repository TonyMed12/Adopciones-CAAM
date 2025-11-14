"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CalendarCheck, PawPrint, CheckCircle2, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { isWeekend } from "date-fns";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import ConfirmCancelModal from "@/components/adopciones/ConfirmCancelModal";
import ConfirmCancelSolicitudModal from "@/components/adopciones/ConfirmCancelSolicitudModal";

type Mascota = {
  id: string;
  nombre: string;
  imagen_url: string;
  estado: string;
};

type Solicitud = {
  id: string;
  estado: string;
  created_at?: string;
  mascota: Mascota | null;
};

type Cita = {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  estado: string;
  mascota: Mascota | null;
};

export default function MisCitasPage() {
  const supabase = createClient();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [citaAEliminar, setCitaAEliminar] = useState<string | null>(null);
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<string | null>(
    null
  );
  const [perfil, setPerfil] = useState<any>(null);
  const [solicitudActiva, setSolicitudActiva] = useState<Solicitud | null>(
    null
  );
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState<"inicio" | "formulario" | "confirmacion">(
    "inicio"
  );
  const [fecha, setFecha] = useState("");
  const [fechaDate, setFechaDate] = useState<Date | undefined>(undefined);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [nuevaCita, setNuevaCita] = useState<Cita | null>(null);
  const diasRestantes =
    3 -
    Math.ceil(
      (new Date().getTime() -
        new Date(solicitudActiva?.created_at || "").getTime()) /
        (1000 * 60 * 60 * 24)
    );

  function showSoftToast(message: string) {
    const alerta = document.createElement("div");

    alerta.textContent = message;

    alerta.className = `
    fixed bottom-6 left-1/2 -translate-x-1/2
    bg-[#fffaf4] text-[#8b4513]
    border border-[#e8c9b8]
    font-semibold px-6 py-3
    rounded-xl shadow-lg
    z-[99999] animate-fadeIn
  `;

    document.body.appendChild(alerta);

    setTimeout(() => {
      alerta.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => alerta.remove(), 600);
    }, 2500);
  }

  function horaEsPasada(hora: string, fechaSeleccionada?: Date) {
    if (!fechaSeleccionada) return false;

    const hoy = new Date();
    const esHoy =
      fechaSeleccionada.getFullYear() === hoy.getFullYear() &&
      fechaSeleccionada.getMonth() === hoy.getMonth() &&
      fechaSeleccionada.getDate() === hoy.getDate();

    if (!esHoy) return false;

    // Convertir "HH:mm" a fecha real
    const [h, m] = hora.split(":").map(Number);
    const fechaHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      h,
      m,
      0
    );

    return fechaHora < hoy; // true si ya pasó
  }

  // ------------------------------------------------------------
  // 📋 Cargar perfil, solicitud activa y citas
  // ------------------------------------------------------------
  async function fetchData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 🔹 Obtener perfil del usuario
      const { data: perfilData, error: perfilError } = await supabase
        .from("perfiles")
        .select("id, nombres, email")
        .eq("email", user.email)
        .maybeSingle();

      if (perfilError) console.error("❌ Error perfil:", perfilError);
      if (!perfilData) {
        setLoading(false);
        return;
      }

      setPerfil(perfilData);

      // 🔹 Buscar la solicitud más reciente
      const { data: solicitud, error: solicitudError } = await supabase
        .from("solicitudes_adopcion")
        .select(
          `
        id,
        estado,
        created_at,
        mascota:mascotas(id, nombre, imagen_url, estado)
      `
        )
        .eq("usuario_id", perfilData.id)
        .in("estado", ["pendiente", "en_proceso"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (solicitudError) console.error("❌ Error solicitud:", solicitudError);

      if (!solicitud) {
        setSolicitudActiva(null);
        setCitas([]);
        setLoading(false);
        return;
      }

      const solicitudObj = {
        id: solicitud.id,
        estado: solicitud.estado,
        created_at: solicitud.created_at,
        mascota: Array.isArray(solicitud.mascota)
          ? solicitud.mascota[0]
          : solicitud.mascota ?? null,
      };

      setSolicitudActiva(solicitudObj);

      // 🔹 Buscar citas vinculadas a esta solicitud
      const { data: citasData, error: citasError } = await supabase
        .from("citas_adopcion")
        .select(
          `
        id,
        solicitud_id,
        fecha_cita,
        hora_cita,
        estado,
        mascota:mascotas(id, nombre, imagen_url, estado)
      `
        )
        .eq("usuario_id", perfilData.id)
        .eq("solicitud_id", solicitudObj.id)
        .order("fecha_cita", { ascending: false });

      if (citasError) console.error("❌ Error citas:", citasError);

      // 🔍 Mostrar solo cita programada
      const citaProgramada =
        citasData?.find((c) => c.estado === "programada") ?? null;

      // 🔹 Formatear la cita si existe
      const citasFormateadas = citaProgramada
        ? [
            {
              id: citaProgramada.id,
              fecha_cita: citaProgramada.fecha_cita,
              hora_cita: citaProgramada.hora_cita,
              estado: citaProgramada.estado,
              mascota: Array.isArray(citaProgramada.mascota)
                ? citaProgramada.mascota[0]
                : citaProgramada.mascota ?? null,
            },
          ]
        : [];

      setCitas(citasFormateadas);
    } catch (err) {
      console.error("💥 Error general en fetchData:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ------------------------------------------------------------
  // 📅 Confirmar cita (inserta en Supabase)
  // ------------------------------------------------------------
  async function confirmarCita() {
    if (!fecha || !horaSeleccionada || !solicitudActiva || !perfil) {
      alert("Por favor selecciona una fecha y hora válidas.");
      return;
    }

    // Crear cita
    const nueva = {
      usuario_id: perfil.id,
      solicitud_id: solicitudActiva.id,
      mascota_id: solicitudActiva.mascota?.id,
      fecha_cita: fecha,
      hora_cita: horaSeleccionada,
      estado: "programada",
    };

    const { data, error } = await supabase
      .from("citas_adopcion")
      .insert([nueva]).select(`
      id, fecha_cita, hora_cita, estado,
      mascota:mascotas(id, nombre, imagen_url, estado)
    `);

    if (error) {
      alert("No se pudo registrar la cita 😕");
      return;
    }

    // Cambiar solicitud → en_proceso
    const { error: updateError } = await supabase
      .from("solicitudes_adopcion")
      .update({ estado: "en_proceso" })
      .eq("id", solicitudActiva.id);

    if (updateError) {
      console.error(updateError);
    }

    // Toast bonito
    const alerta = document.createElement("div");
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 2500);

    // Actualizar UI local
    const citaCreada = {
      id: data![0].id,
      fecha_cita: data![0].fecha_cita,
      hora_cita: data![0].hora_cita,
      estado: data![0].estado,
      mascota: Array.isArray(data![0].mascota)
        ? data![0].mascota[0]
        : data![0].mascota,
    };

    setNuevaCita(citaCreada);
    setCitas([citaCreada]);

    // Aquí NO ponemos aprobada
    setSolicitudActiva({ ...solicitudActiva, estado: "en_proceso" });

    setPaso("confirmacion");
  }

  async function cancelarSolicitud(id: string) {
    if (!solicitudActiva?.mascota?.id) {
      console.error("❌ No hay mascota vinculada a la solicitud.");
      return;
    }

    try {
      const mascotaId = solicitudActiva.mascota.id;

      // 1️⃣ Cancelar todas las citas de esta solicitud
      await supabase
        .from("citas_adopcion")
        .update({ estado: "cancelada" })
        .eq("solicitud_id", id);

      // 2️⃣ Cambiar estado de la solicitud a "rechazada"
      const { error: solicitudError } = await supabase
        .from("solicitudes_adopcion")
        .update({ estado: "rechazada" })
        .eq("id", id);

      if (solicitudError) {
        console.error("❌ Error actualizando solicitud:", solicitudError);
        showSoftToast("Ocurrió un problema al cancelar la solicitud 😕");
        return;
      }

      // 3️⃣ Liberar mascota
      const { error: mascotaError } = await supabase
        .from("mascotas")
        .update({
          estado: "disponible",
          disponible_adopcion: true,
        })
        .eq("id", mascotaId);

      if (mascotaError) {
        console.error("❌ Error actualizando mascota:", mascotaError);
        showSoftToast("No se pudo liberar la mascota 😕");
        return;
      }

      // 4️⃣ Mostrar toast suave
      showSoftToast("Solicitud cancelada y mascota liberada correctamente 🐾");

      // 5️⃣ Limpiar UI
      setSolicitudActiva(null);
      setCitas([]);

      await fetchData();
    } catch (err) {
      console.error("💥 Error general en cancelarSolicitud:", err);
      showSoftToast("Error al cancelar la solicitud 😕");
    }
  }

  // ------------------------------------------------------------
  // ❌ Cancelar cita
  // ------------------------------------------------------------
  async function cancelarCita(id: string) {
    const { error } = await supabase
      .from("citas_adopcion")
      .update({ estado: "cancelada" })
      .eq("id", id);

    if (error) {
      alert("Hubo un problema al cancelar la cita 😕");
      return;
    }

    // 1️⃣ Regresar solicitud a "pendiente"
    await supabase
      .from("solicitudes_adopcion")
      .update({ estado: "pendiente" })
      .eq("id", solicitudActiva?.id);

    // 2️⃣ Mostrar toast elegante
    showSoftToast("Tu cita fue cancelada correctamente 🐾");

    // 3️⃣ Refrescar data
    await fetchData();
  }

  // ------------------------------------------------------------
  // 🔁 Volver al inicio
  // ------------------------------------------------------------
  async function handleFinalizar() {
    await fetchData();
    setPaso("inicio");
  }

  // ------------------------------------------------------------
  // 🧱 Render principal
  // ------------------------------------------------------------
  if (loading)
    return <p className="text-center py-10 text-[#7a5c49]">Cargando...</p>;

  return (
    <div className="space-y-8">
      <PageHead
        title="Mis citas de adopción"
        subtitle="Consulta o agenda tu cita para conocer a tu futura mascota 🐾"
      />

      {/* PASO 1 */}
      {paso === "inicio" && (
        <>
          {citas.length > 0 ? (
            // 🗓️ Si ya hay una cita programada
            <div className="rounded-2xl border border-[#eadacb] bg-[#fffaf4] p-8 shadow-md text-[#2b1b12]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* 🐶 Imagen de mascota */}
                <img
                  src={citas[0].mascota?.imagen_url || "/placeholder.jpg"}
                  alt={citas[0].mascota?.nombre || "Mascota"}
                  className="h-48 w-48 rounded-xl object-cover border border-[#e8c9b8] shadow-sm"
                />

                {/* 📅 Información de la cita */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-extrabold text-[#8b4513] flex items-center justify-center md:justify-start gap-2">
                    <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                    ¡Tienes una cita programada!
                  </h3>
                  <p className="mt-2 text-sm text-[#7a5c49]">
                    Te esperamos en el{" "}
                    <strong className="text-[#BC5F36]">CAAM</strong> para
                    conocer a{" "}
                    <span className="font-semibold">
                      {citas[0].mascota?.nombre}
                    </span>
                    .
                  </p>

                  {/* Fecha y hora */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <div className="rounded-xl bg-[#fffdfb] border border-[#f0d9c9] px-5 py-3 shadow-sm">
                      <p className="text-sm text-[#5a4b3f]">
                        <strong>📅 Fecha:</strong>{" "}
                        <span className="font-semibold text-[#BC5F36]">
                          {new Date(citas[0].fecha_cita).toLocaleDateString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </p>
                      <p className="text-sm text-[#5a4b3f] mt-1">
                        <strong>🕒 Hora:</strong>{" "}
                        <span className="font-semibold text-[#BC5F36]">
                          {citas[0].hora_cita.slice(0, 5)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Cancelar cita */}
                  <div className="mt-6">
                    <Button
                      className="bg-[#fff5f3] border border-[#e8c9b8] text-[#BC5F36] hover:bg-[#ffe7e2] transition-all duration-200 cursor-pointer rounded-lg"
                      onClick={() => {
                        setCitaAEliminar(citas[0].id);
                        setShowCancelModal(true);
                      }}
                    >
                      Cancelar cita
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : solicitudActiva ? (
            solicitudActiva.estado === "en_proceso" ? (
              // ⭐ YA NO SE PUEDE AGENDAR CITA: TIENE QUE LLENAR FORMULARIO FINAL
              <div className="text-center p-10 border border-[#eadacb] bg-[#fffaf4] rounded-xl shadow-sm">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#BC5F36]" />

                <h3 className="mt-3 font-bold text-[#8b4513]">
                  ¡Estás a un paso de adoptar! 🐾
                </h3>

                <p className="mt-2 text-sm text-[#7a5c49] max-w-md mx-auto">
                  Ya realizaste tu cita y tu solicitud está en proceso. Ahora
                  solo falta que completes el formulario final de adopción.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    className="bg-[#BC5F36] hover:bg-[#a64d2e] text-white cursor-pointer transition-all"
                    onClick={() =>
                      (window.location.href = "/dashboards/usuario/adopcion")
                    }
                  >
                    Completar formulario
                  </Button>
                </div>
              </div>
            ) : (
              // 🐾 SOLICITUD PENDIENTE → SÍ PUEDE AGENDAR CITA
              <div className="text-center p-10 border border-[#eadacb] bg-[#fffaf4] rounded-xl shadow-sm">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#BC5F36]" />
                <h3 className="mt-3 font-bold text-[#8b4513]">
                  Solicitud activa detectada 🐾
                </h3>
                <p className="mt-2 text-sm text-[#7a5c49]">
                  Puedes agendar una cita para conocer a{" "}
                  <strong>{solicitudActiva.mascota?.nombre}</strong>.
                </p>

                {/* 🕒 Días restantes */}
                {(() => {
                  if (!solicitudActiva?.created_at) return null;

                  const fechaCreacion = new Date(solicitudActiva.created_at);
                  const diferenciaMs =
                    new Date().getTime() - fechaCreacion.getTime();
                  const diasTranscurridos = Math.floor(
                    diferenciaMs / (1000 * 60 * 60 * 24)
                  );
                  const diasRestantes = 3 - diasTranscurridos;

                  if (diasRestantes > 0) {
                    return (
                      <p className="mt-3 text-sm text-[#BC5F36] font-semibold">
                        ⏳ Tu solicitud vencerá en {diasRestantes}{" "}
                        {diasRestantes === 1 ? "día" : "días"} si no agendas una
                        cita.
                      </p>
                    );
                  } else {
                    return (
                      <p className="mt-3 text-sm text-[#BC5F36] font-semibold">
                        ⚠️ Tu solicitud ha expirado. Cancélala para liberar a la
                        mascota.
                      </p>
                    );
                  }
                })()}

                {/* Botones */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    className="bg-[#BC5F36] hover:bg-[#a64d2e] text-white cursor-pointer transition-all"
                    onClick={() => setPaso("formulario")}
                  >
                    <CalendarCheck className="h-4 w-4 mr-2" /> Agendar cita
                  </Button>

                  <Button
                    className="bg-transparent text-[#BC5F36] border border-[#e8c9b8] hover:bg-[#fff3ee] cursor-pointer transition-all"
                    onClick={() => {
                      setSolicitudAEliminar(solicitudActiva.id);
                      setShowCancelSolicitudModal(true);
                    }}
                  >
                    Cancelar solicitud
                  </Button>
                </div>
              </div>
            )
          ) : (
            // 💤 Si no hay ni cita ni solicitud
            <p className="text-center text-[#7a5c49] py-10">
              No tienes solicitudes activas ni citas pendientes.
            </p>
          )}
        </>
      )}

      {/* PASO 2: Formulario para agendar cita */}
      {paso === "formulario" && solicitudActiva && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-5 sm:p-8 shadow-sm text-[#2b1b12]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-[#BC5F36]" />
              Cita para {solicitudActiva.mascota?.nombre}
            </h3>
            <Button
              variant="ghost"
              onClick={() => setPaso("inicio")}
              className="
    text-[#BC5F36] 
    hover:text-[#8b4513] 
    hover:bg-[#fff3ee] 
    transition-all 
    duration-200 
    cursor-pointer
  "
            >
              ← Regresar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* 🐶 Información de la mascota */}
            <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-5 sm:p-6 flex flex-col items-center text-center shadow-sm">
              <img
                src={solicitudActiva.mascota?.imagen_url || "/placeholder.jpg"}
                alt={solicitudActiva.mascota?.nombre}
                className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg object-cover border border-[#eadacb] mb-4 shadow-md"
              />
              <h4 className="text-lg font-bold text-[#8b4513] mb-1">
                {solicitudActiva.mascota?.nombre}
              </h4>
              <p className="text-sm text-[#7a5c49] mb-2">
                Estado actual:{" "}
                <span className="font-semibold text-[#BC5F36] capitalize">
                  {solicitudActiva.mascota?.estado === "en_proceso"
                    ? "Esperando por ti"
                    : solicitudActiva.mascota?.estado}
                </span>
              </p>
              <div className="mt-2">
                <p className="text-sm text-[#7a5c49] flex items-center justify-center gap-1">
                  <MapPin className="h-4 w-4 text-[#BC5F36]" />
                  <strong>CAAM - Centro de Atención Animal de Morelia</strong>
                </p>
                <p className="text-xs text-[#a4836b] mt-1">
                  Av. Acueducto 1234, Morelia, Michoacán
                </p>
              </div>
            </div>

            {/* 🗓️ Formulario de selección */}
            <div className="space-y-6">
              {/* FECHA */}
              <div>
                <label className="block text-sm font-extrabold mb-3 text-[#2b1b12]">
                  Selecciona la fecha de tu visita
                </label>
                <div className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-3 sm:p-4 overflow-x-auto flex justify-start sm:justify-center scrollbar-thin scrollbar-thumb-[#d6bba8] scrollbar-track-transparent">
                  <div className="min-w-[320px] sm:min-w-[380px]">
                    <Calendar
                      mode="single"
                      selected={fechaDate}
                      onSelect={(day: Date | undefined) => {
                        setFechaDate(day || undefined);

                        if (!day) {
                          setFecha("");
                          return;
                        }

                        // Formatear manualmente a "YYYY-MM-DD" en hora local
                        const year = day.getFullYear();
                        const month = String(day.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const dayNum = String(day.getDate()).padStart(2, "0");

                        setFecha(`${year}-${month}-${dayNum}`);
                      }}
                      disabled={(date: Date) =>
                        isWeekend(date) ||
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="rounded-md border-0 shadow-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#a4836b] text-center mt-2">
                  (Solo se pueden agendar citas de lunes a viernes)
                </p>
              </div>

              {/* HORAS */}
              <div>
                <label className="block text-sm font-extrabold mb-2 text-[#2b1b12]">
                  Hora disponible
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
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
                  ].map((hora) => {
                    const deshabilitada = horaEsPasada(hora, fechaDate);

                    return (
                      <div key={hora} className="relative group">
                        <button
                          disabled={deshabilitada}
                          onClick={() =>
                            !deshabilitada && setHoraSeleccionada(hora)
                          }
                          className={`
          rounded-lg border px-3 py-2 text-sm sm:text-base font-semibold 
          transition-all text-center select-none w-full

          ${
            deshabilitada
              ? "cursor-not-allowed opacity-40 bg-[#f5e9e4] border-[#e0cfc5]"
              : horaSeleccionada === hora
              ? "bg-[#BC5F36] border-[#BC5F36] text-white shadow-md cursor-pointer"
              : "bg-[#fffaf4] border-[#eadacb] text-[#2b1b12] cursor-pointer hover:bg-[#ffe8df] hover:border-[#BC5F36]"
          }
        `}
                        >
                          {hora}
                        </button>

                        {/* TOOLTIP */}
                        {deshabilitada && (
                          <div
                            className="
            absolute -top-10 left-1/2 -translate-x-1/2
            bg-[#2b1b12] text-[#fffaf4] text-xs
            px-3 py-1 rounded-lg shadow-lg border border-[#eadacb]
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none whitespace-nowrap
          "
                          >
                            Esta hora ya pasó hoy ⏳
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONFIRMAR */}
              <div className="pt-6 text-center sticky bottom-4 bg-white/80 backdrop-blur-sm py-3 rounded-xl shadow-md sm:static sm:shadow-none sm:bg-transparent">
                <Button
                  className={`
    px-8 py-3 transition-all duration-200 
    cursor-pointer select-none
    ${
      !fecha || !horaSeleccionada
        ? "opacity-60 cursor-not-allowed"
        : "hover:bg-[#a64d2e] hover:shadow-md"
    }
  `}
                  disabled={!fecha || !horaSeleccionada}
                  onClick={confirmarCita}
                >
                  <CalendarCheck className="h-5 w-5 mr-2" />
                  Confirmar cita
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PASO 3: Confirmación */}
      {paso === "confirmacion" && nuevaCita && (
        <section className="rounded-2xl border border-[#f0e0d6] bg-[#fffdfb] p-10 shadow-md text-[#2b1b12]">
          {/* Encabezado principal */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-full bg-[#BC5F36] text-white flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#2b1b12]">
                ¡Cita confirmada!
              </h3>
              <p className="mt-1 text-base text-[#5a4b3f]">
                Tu visita ha sido agendada exitosamente 🐾. Te esperamos en el{" "}
                <span className="font-semibold text-[#BC5F36]">CAAM</span>; por
                favor llega <strong>10 minutos antes</strong>.
              </p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 🐶 MASCOTA */}
            <div className="rounded-2xl border border-[#f0d9c9] bg-[#fff8f4] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={nuevaCita.mascota?.imagen_url || "/placeholder.jpg"}
                alt={nuevaCita.mascota?.nombre || "Mascota"}
                className="h-56 w-56 rounded-xl object-cover border border-[#e8c9b8] mb-4 shadow-md hover:scale-[1.02] transition-transform"
              />
              <h4 className="text-xl font-bold text-[#8b4513] mb-1">
                {nuevaCita.mascota?.nombre}
              </h4>
              <p className="text-sm text-[#7a5c49] mb-3">
                Estado actual:{" "}
                <span className="font-semibold text-[#BC5F36]">
                  {nuevaCita.mascota?.estado === "en_proceso"
                    ? "Esperando por ti 🧡"
                    : nuevaCita.mascota?.estado}
                </span>
              </p>
              <div className="mt-3 text-sm">
                <p className="flex items-center justify-center gap-1 text-[#5b4032]">
                  <MapPin className="h-4 w-4 text-[#BC5F36]" />
                  <strong>CAAM - Centro de Atención Animal de Morelia</strong>
                </p>
                <p className="text-xs text-[#a4836b] mt-1">
                  Av. Acueducto 1234, Morelia, Michoacán
                </p>
              </div>
            </div>

            {/* 📅 FECHA Y HORA */}
            <div className="rounded-2xl border border-[#f0d9c9] bg-[#fff8f4] p-8 flex flex-col justify-center items-start shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="text-lg font-extrabold text-[#8b4513] mb-4 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                Detalles de tu cita
              </h4>
              <div className="text-base space-y-3 text-[#4b392f]">
                <p className="flex items-center gap-2">
                  📅 <strong>Fecha:</strong>{" "}
                  <span className="text-[#BC5F36] font-semibold">
                    {new Date(nuevaCita.fecha_cita).toLocaleDateString(
                      "es-MX",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  🕒 <strong>Hora:</strong>{" "}
                  <span className="text-[#BC5F36] font-semibold">
                    {nuevaCita.hora_cita.slice(0, 5)}
                  </span>
                </p>
              </div>

              <div className="mt-6 border-t border-[#eadacb] pt-4 text-sm text-[#7a5c49] leading-relaxed">
                <p>
                  Si necesitas reprogramar tu cita, comunícate con el equipo del{" "}
                  <span className="text-[#BC5F36] font-medium">CAAM</span> o
                  cancélala desde tu panel de usuario.
                </p>
              </div>
            </div>
          </div>

          {/* BOTÓN FINALIZAR */}
          <div className="mt-10 flex justify-center">
            <Button
              className="
    bg-[#BC5F36] 
    hover:bg-[#a64d2e] 
    text-white 
    text-base 
    px-12 
    py-4 
    rounded-xl 
    shadow-md 
    transition-all 
    duration-200 
    cursor-pointer 
    hover:shadow-lg 
    select-none
  "
              onClick={handleFinalizar}
            >
              Finalizar
            </Button>
          </div>
        </section>
      )}
      <ConfirmCancelModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => citaAEliminar && cancelarCita(citaAEliminar)}
      />

      <ConfirmCancelSolicitudModal
        open={showCancelSolicitudModal}
        onClose={() => setShowCancelSolicitudModal(false)}
        onConfirm={() =>
          solicitudAEliminar && cancelarSolicitud(solicitudAEliminar)
        }
      />
    </div>
  );
}
