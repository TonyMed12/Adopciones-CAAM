"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  CalendarCheck,
  PawPrint,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";

type Cita = {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  estado: string;
  mascota?: {
    nombre: string;
    imagen_url: string;
  } | null;
};

export default function MisCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------
  // 📅 Obtener citas del usuario
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchCitas() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("citas_adopcion")
        .select(
          `
          id,
          fecha_cita,
          hora_cita,
          estado,
          mascota:mascotas (nombre, imagen_url)
        `
        )
        .eq("usuario_id", user.id)
        .order("fecha_cita", { ascending: false });

      if (error) {
        console.error("Error cargando citas:", error);
      } else {
        setCitas(data || []);
      }
      setLoading(false);
    }

    fetchCitas();
  }, []);

  // ------------------------------------------------------------
  // 🗑️ Cancelar cita
  // ------------------------------------------------------------
  async function cancelarCita(id: string) {
    const confirm = window.confirm(
      "¿Estás seguro de cancelar tu cita? Esto liberará la mascota para otros adoptantes."
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("citas_adopcion")
      .update({ estado: "cancelada" })
      .eq("id", id);

    if (error) {
      alert("Error al cancelar la cita.");
      console.error(error);
      return;
    }

    alert("Tu cita ha sido cancelada exitosamente.");
    setCitas((prev) => prev.filter((c) => c.id !== id));
  }

  // ------------------------------------------------------------
  // Render principal
  // ------------------------------------------------------------
  if (loading) {
    return (
      <p className="text-center py-10 text-[#7a5c49]">Cargando tus citas...</p>
    );
  }

  return (
    <div className="space-y-8">
      <PageHead
        title="Mis citas de adopción"
        subtitle="Consulta el estado de tus visitas al CAAM 🐾"
      />

      {citas.length === 0 ? (
        <div className="text-center p-10 border border-[#eadacb] bg-[#fffaf4] rounded-xl">
          <PawPrint className="mx-auto h-10 w-10 text-[#BC5F36]" />
          <p className="mt-3 text-sm text-[#7a5c49]">
            No tienes citas programadas aún.
          </p>
          <p className="mt-1 text-sm text-[#7a5c49]">
            Una vez que agendes una visita para conocer una mascota, aparecerá
            aquí 🐶.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={cita.mascota?.imagen_url || "/placeholder.jpg"}
                  alt={cita.mascota?.nombre}
                  className="h-20 w-20 rounded-lg object-cover border border-[#eadacb]"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#8b4513]">
                    {cita.mascota?.nombre}
                  </h3>
                  <p className="text-sm text-[#7a5c49]">
                    <strong>Fecha:</strong> {cita.fecha_cita}
                  </p>
                  <p className="text-sm text-[#7a5c49]">
                    <strong>Hora:</strong> {cita.hora_cita}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded-full ${
                      cita.estado === "programada"
                        ? "bg-[#e7f8e7] text-[#2e7d32]"
                        : cita.estado === "cancelada"
                        ? "bg-[#ffe5e0] text-[#b23c17]"
                        : "bg-[#fff4e7] text-[#BC5F36]"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </div>
              </div>

              {/* Botón cancelar solo si está programada */}
              {cita.estado === "programada" && (
                <div className="mt-4 text-right">
                  <Button
                    variant="ghost"
                    className="text-red-700 hover:text-white hover:bg-red-600"
                    onClick={() => cancelarCita(cita.id)}
                  >
                    Cancelar cita
                  </Button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
