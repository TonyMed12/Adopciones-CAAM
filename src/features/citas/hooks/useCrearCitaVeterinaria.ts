"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { crearCitaVeterinaria } from "@/features/citas/actions/citas-veterinarias-actions";

type Mascota = {
  adopcion_id: string;
  mascota_nombre: string;
  imagen_url: string | null;
};

type Params = {
  authId: string;
  mascotas: Mascota[];

  fechaSeleccionada: string | null;
  horaSeleccionada: string | null;
  motivo: string;

  setMensaje: (msg: string | null) => void;
  setModo: (m: "lista" | "agendar") => void;
  setFechaSeleccionada: (f: string | null) => void;
  setHoraSeleccionada: (h: string | null) => void;
  setMotivo: (m: string) => void;
  setMascotaSeleccionada: (m: any) => void;
};

export function useCrearCitaVeterinaria({
  authId,
  mascotas,
  fechaSeleccionada,
  horaSeleccionada,
  motivo,
  setMensaje,
  setModo,
  setFechaSeleccionada,
  setHoraSeleccionada,
  setMotivo,
  setMascotaSeleccionada,
}: Params) {
  const supabase = createClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adopcion_id,
      fecha_cita,
      motivo,
    }: {
      adopcion_id: string;
      fecha_cita: string;
      motivo: string;
    }) => {
      const data = await crearCitaVeterinaria({
        adopcion_id,
        fecha_cita,
        motivo,
      });

      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email || "";
      const nombre = userData?.user?.user_metadata?.full_name || "Usuario";

      const fechaObj = new Date(fecha_cita);

      await fetch("/api/email/citaVeterinaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre,
          nombreMascota:
            mascotas.find((m) => m.adopcion_id === adopcion_id)
              ?.mascota_nombre || "Mascota",
          fechaTexto: fechaObj.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          horaTexto: fechaObj.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          motivo,
        }),
      });

      return data;
    },

    onSuccess: () => {
      setModo("lista");
      setMotivo("");
      setFechaSeleccionada(null);
      setHoraSeleccionada(null);
      setMascotaSeleccionada(null);

      setMensaje("✅ Cita agendada correctamente. Espera confirmación del CAAM.");

      qc.invalidateQueries();
    },

    onError: () => {
      setMensaje("Ocurrió un error al registrar la cita.");
    },
  });
}
