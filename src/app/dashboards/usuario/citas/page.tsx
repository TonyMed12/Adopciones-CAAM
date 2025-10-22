"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  CalendarCheck,
  PawPrint,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";

type Solicitud = {
  id: string;
  numero_solicitud: string;
  estado: string;
  mascota: {
    id: string;
    nombre: string;
    imagen_url: string;
    estado: string;
  };
};

export default function CitasPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Solicitud | null>(null);

  const [paso, setPaso] = useState<"listado" | "formulario" | "confirmacion">(
    "listado"
  );
  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [nuevaCita, setNuevaCita] = useState<any | null>(null);

  const horasDisponibles = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // ------------------------------------------------------------
  // 🐾 Obtener solicitudes activas del usuario
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchSolicitudes() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("solicitudes_adopcion")
        .select(
          `
    id,
    numero_solicitud,
    estado,
    mascota:mascotas (
      id,
      nombre,
      imagen_url,
      estado
    )
  `
        )
        .eq("usuario_id", user.id)
        .in("estado", ["pendiente", "aprobada"]);

      if (error) {
        console.error("Error cargando solicitudes:", error);
      } else {
        // Convertir la mascota de array a objeto (toma el primer elemento)
        const formatted = (data || []).map((s: any) => ({
          ...s,
          mascota: Array.isArray(s.mascota) ? s.mascota[0] : s.mascota,
        }));
        setSolicitudes(formatted);
      }
      setLoading(false);
    }

    fetchSolicitudes();
  }, []);

  // ------------------------------------------------------------
  // 📅 Confirmar cita y mostrar resumen (inserta en Supabase)
  // ------------------------------------------------------------
  async function confirmarCita() {
    if (!fecha || !horaSeleccionada || !selected) {
      alert("Por favor selecciona fecha y hora.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("No hay sesión activa.");

    const cita = {
      usuario_id: user.id,
      cliente_nombre: user.email,
      mascota_id: selected.mascota.id,
      mascota_nombre: selected.mascota.nombre,
      veterinario_id: null,
      fecha_cita: fecha,
      hora_cita: horaSeleccionada,
      motivo_consulta: "Visita de adopción",
      tipo_consulta: "adopcion",
      estado: "programada",
      es_emergencia: false,
    };

    try {
      const { error } = await supabase.from("citas_adopcion").insert([
        {
          usuario_id: user.id,
          solicitud_id: selected.id,
          mascota_id: selected.mascota.id,
          fecha_cita: fecha,
          hora_cita: horaSeleccionada,
          estado: "programada",
        },
      ]);

      if (error) throw error;

      // Si se insertó correctamente, guardamos la cita local para mostrar resumen
      setNuevaCita({
        ...cita,
        mascota: selected.mascota,
      });
      setPaso("confirmacion");
    } catch (err) {
      console.error(err);
      alert("Error al agendar cita");
    }
  }

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  if (loading) {
    return (
      <p className="text-center py-10 text-[#7a5c49]">
        Cargando solicitudes...
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <PageHead
        title="Agendar visita"
        subtitle="Programa una cita para conocer a tu futura mascota 🐾"
      />

      {/* PASO 1: Listado de solicitudes */}
      {paso === "listado" && solicitudes.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-4 flex flex-col shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={s.mascota?.imagen_url || "/placeholder.jpg"}
                  alt={s.mascota?.nombre}
                  className="h-20 w-20 rounded-lg object-cover border border-[#eadacb]"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#8b4513]">
                    {s.mascota?.nombre}
                  </h3>
                  <p className="text-xs text-[#7a5c49] mb-1">
                    Solicitud #{s.numero_solicitud}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      s.estado === "pendiente"
                        ? "bg-[#fff4e7] text-[#BC5F36]"
                        : "bg-[#f3fff3] text-[#2e7d32]"
                    }`}
                  >
                    {s.estado}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelected(s);
                    setPaso("formulario");
                  }}
                >
                  <CalendarCheck className="h-4 w-4 mr-1" />
                  Agendar visita
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PASO 2: Formulario para seleccionar fecha y hora */}
      {paso === "formulario" && selected && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-sm text-[#2b1b12]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-[#BC5F36]" />
              Cita para {selected.mascota?.nombre}
            </h3>
            <Button variant="ghost" onClick={() => setPaso("listado")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Regresar
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={selected.mascota?.imagen_url || "/placeholder.jpg"}
              alt={selected.mascota?.nombre}
              className="h-40 w-40 rounded-lg object-cover border border-[#eadacb]"
            />
            <div className="flex-1 space-y-3 text-sm">
              <p>
                <strong>Mascota:</strong> {selected.mascota?.nombre}
              </p>
              <p>
                <strong>Estado actual:</strong> {selected.mascota?.estado}
              </p>

              {/* Fecha */}
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                  <h4 className="text-sm font-extrabold text-[#2b1b12]">
                    Fecha de la visita
                  </h4>
                </div>
                <div className="mt-3">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-50 rounded-xl border border-[#eadacb] bg-[#fffaf4] px-4 py-3 text-sm text-[#2b1b12] focus:border-[#BC5F36] focus:outline-none focus:ring-2 focus:ring-[#BC5F36]/20"
                  />
                </div>
              </div>

              {/* Hora */}
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#BC5F36]" />
                  <h4 className="text-sm font-extrabold text-[#2b1b12]">
                    Hora de la visita
                  </h4>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-8">
                  {horasDisponibles.map((hora) => (
                    <button
                      key={hora}
                      onClick={() => setHoraSeleccionada(hora)}
                      className={[
                        "rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
                        horaSeleccionada === hora
                          ? "border-[#BC5F36] bg-[#BC5F36] text-white"
                          : "border-[#eadacb] bg-[#fffaf4] text-[#2b1b12] hover:border-[#BC5F36]",
                      ].join(" ")}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón confirmar */}
              <div className="mt-8 flex justify-center">
                <Button
                  className="px-8 py-3"
                  disabled={!fecha || !horaSeleccionada}
                  onClick={confirmarCita}
                >
                  <CalendarCheck className="h-5 w-5" />
                  Confirmar cita
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PASO 3: Confirmación visual */}
      {paso === "confirmacion" && nuevaCita && (
        <section className="rounded-2xl border border-[#dbead3] bg-[#f3fff3] p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#2e7d32] text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-[#2b1b12]">
                Cita confirmada
              </h3>
              <p className="mt-1 text-sm text-[#7a5c49]">
                Tu visita ha sido agendada exitosamente. Por favor llega 10
                minutos antes de la hora programada.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Mascota */}
            <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-[#BC5F36]" />
                <h4 className="text-sm font-extrabold text-[#2b1b12]">
                  Mascota
                </h4>
              </div>
              <p className="mt-2 text-sm text-[#7a5c49]">
                <strong>Nombre:</strong> {nuevaCita.mascota.nombre}
              </p>
              <p className="mt-1 text-sm text-[#7a5c49]">
                <strong>Estado:</strong> {nuevaCita.mascota.estado}
              </p>
            </div>

            {/* Fecha y hora */}
            <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                <h4 className="text-sm font-extrabold text-[#2b1b12]">
                  Fecha y hora
                </h4>
              </div>
              <p className="mt-2 text-sm text-[#7a5c49]">
                <strong>Fecha:</strong> {nuevaCita.fecha_cita}
              </p>
              <p className="mt-1 text-sm text-[#7a5c49]">
                <strong>Hora:</strong> {nuevaCita.hora_cita}
              </p>
            </div>

            {/* Ubicación */}
            <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#BC5F36]" />
                <h4 className="text-sm font-extrabold text-[#2b1b12]">
                  Ubicación
                </h4>
              </div>
              <p className="mt-2 text-sm text-[#7a5c49]">
                CAAM - Centro de Adopción Animal de Morelia
                <br />
                Av. Acueducto 1234, Morelia, Michoacán
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button className="px-6 py-3" onClick={() => setPaso("listado")}>
              Agendar otra cita
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
