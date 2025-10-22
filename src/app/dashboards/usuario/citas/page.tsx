"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { CalendarDays, Clock, PawPrint, ArrowLeft } from "lucide-react";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";

export default function CitasPage() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // --------------------------------------------------
  // 🐾 Obtener solicitudes activas del usuario
  // --------------------------------------------------
  useEffect(() => {
    async function fetchSolicitudes() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("solicitudes_adopcion")
        .select(`
            id,
            numero_solicitud,
            estado,
            mascota:mascotas (
            id,
            nombre,
            imagen_url,
            estado
            )
        `)
        .eq("usuario_id", user.id)
        .in("estado", ["pendiente", "aprobada"]);

      if (error) console.error("Error cargando solicitudes:", error);
      else setSolicitudes(data || []);
      setLoading(false);
    }

    fetchSolicitudes();
  }, []);

  // --------------------------------------------------
  // 📅 Crear cita de adopción
  // --------------------------------------------------
  async function agendarCita() {
    if (!fecha || !hora || !selected) {
      alert("Por favor selecciona fecha y hora.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("No hay sesión activa.");

    try {
      const { error } = await supabase.from("citas_veterinarias").insert([
        {
          usuario_id: user.id,
          cliente_nombre: user.email,
          mascota_id: selected.mascota.id,
          mascota_nombre: selected.mascota.nombre,
          veterinario_id: null,
          fecha_cita: fecha,
          hora_cita: hora,
          motivo_consulta: "Visita de adopción",
          tipo_consulta: "adopcion",
          estado: "programada",
          es_emergencia: false,
        },
      ]);

      if (error) throw error;

      alert("✅ Cita agendada correctamente");
      router.push("/dashboards/usuario/adopcion");
    } catch (err) {
      console.error(err);
      alert("Error al agendar cita");
    }
  }

  // --------------------------------------------------
  // 🧩 Render
  // --------------------------------------------------
  if (loading) {
    return <p className="text-center py-10 text-[#7a5c49]">Cargando solicitudes...</p>;
  }

  return (
    <div className="space-y-8">
      <PageHead
        title="Agendar visita"
        subtitle="Programa una cita para conocer a tu futura mascota 🐾"
      />

      {/* Si no hay solicitudes */}
      {solicitudes.length === 0 && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-sm text-[#2b1b12] text-sm">
          <p>
            No tienes solicitudes de adopción activas. Debes iniciar una antes de
            poder agendar una cita.
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push("/usuario/mascotas")}>
              Ver mascotas disponibles
            </Button>
          </div>
        </section>
      )}

      {/* Listado de solicitudes */}
      {solicitudes.length > 0 && !selected && (
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
                  <h3 className="font-bold text-[#8b4513]">{s.mascota?.nombre}</h3>
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
                  onClick={() => setSelected(s)}
                  className="px-4 py-2"
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Agendar visita
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Formulario para agendar */}
      {selected && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-sm text-[#2b1b12]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-[#BC5F36]" />
              Cita para {selected.mascota?.nombre}
            </h3>
            <Button variant="ghost" onClick={() => setSelected(null)}>
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
              <div className="grid gap-2 mt-3">
                <label className="text-xs text-[#7a5c49]">
                  Fecha de la visita:
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="border border-[#eadacb] rounded-md px-3 py-2 text-sm w-full"
                />
                <label className="text-xs text-[#7a5c49]">
                  Hora de la visita:
                </label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="border border-[#eadacb] rounded-md px-3 py-2 text-sm w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button onClick={agendarCita}>Confirmar cita</Button>
          </div>
        </section>
      )}
    </div>
  );
}
