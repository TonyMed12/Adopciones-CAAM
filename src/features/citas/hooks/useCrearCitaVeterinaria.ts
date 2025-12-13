"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { crearCitaVeterinaria } from "@/features/citas/actions/citas-veterinarias-actions";
import { CitasVeterinariasKeys } from "@/features/citas/queries/citas-veterinarias-keys";

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

      // 🔹 correo en background (NO bloquear)
      supabase.auth.getUser().then(({ data: userData }) => {
        const email = userData?.user?.email || "";
        const nombre =
          userData?.user?.user_metadata?.full_name || "Usuario";

        const fechaObj = new Date(fecha_cita);

        fetch("/api/email/citaVeterinaria", {
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
      });

      return data;
    },

    onMutate: async (newCita) => {
      await qc.cancelQueries({
        queryKey: CitasVeterinariasKeys.usuario.infinite(authId),
      });

      const previousData = qc.getQueryData(
        CitasVeterinariasKeys.usuario.infinite(authId)
      );

      qc.setQueryData(
        CitasVeterinariasKeys.usuario.infinite(authId),
        (old: any) => {
          if (!old) return old;

          const mascota = mascotas.find(
            (m) => m.adopcion_id === newCita.adopcion_id
          );

          const citaOptimista = {
            id: `optimistic-${Date.now()}`,
            adopcion_id: newCita.adopcion_id,
            fecha_cita: newCita.fecha_cita,
            motivo: newCita.motivo,
            estado: "pendiente",
            created_at: new Date().toISOString(),
            mascota_nombre: mascota?.mascota_nombre || "Mascota",
            mascota_imagen: mascota?.imagen_url || null,
          };

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                items: [citaOptimista, ...old.pages[0].items],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      return { previousData };
    },

    onError: (_err, _newCita, context) => {
      if (context?.previousData) {
        qc.setQueryData(
          CitasVeterinariasKeys.usuario.infinite(authId),
          context.previousData
        );
      }

      setMensaje("Ocurrió un error al registrar la cita.");
    },

    onSuccess: () => {
      setModo("lista");
      setMotivo("");
      setFechaSeleccionada(null);
      setHoraSeleccionada(null);
      setMascotaSeleccionada(null);

      setMensaje(
        "Cita agendada correctamente. Espera confirmación del CAAM."
      );
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: CitasVeterinariasKeys.usuario.infinite(authId),
      });
    },
  });
}
