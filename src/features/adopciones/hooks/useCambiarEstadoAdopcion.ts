"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoAdopcion } from "../actions/adopciones-actions";
import { adopcionesQueries } from "../queries/adopciones-queries";
import type { AdopcionAdminRow, Adopcion } from "../types/adopciones";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import { createClient } from "@/lib/supabase/client";

type CambiarEstadoInput = {
  id: string;
  estado: "aprobada" | "rechazada";
  observaciones_admin?: string | null;
  contrato_url?: string | null;
  seguimiento_programado?: string | null;
};

export function useCambiarEstadoAdopcion() {
  const qc = useQueryClient();

  return useMutation<Adopcion, Error, CambiarEstadoInput>({
    mutationFn: async (params) => {
      const ok = await toastConfirm(
        params.estado === "aprobada"
          ? "¿Aprobar esta adopción?"
          : "¿Rechazar esta adopción?"
      );
      if (!ok) throw new Error("Operación cancelada");

      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) throw new Error("No hay sesión activa");

      const rows =
        qc.getQueryData<AdopcionAdminRow[]>(
          adopcionesQueries.list("admin")
        ) ?? [];

      const adopcion = rows.find((r) => r.id === params.id);
      if (!adopcion) throw new Error("No se encontró la adopción");

      const email = adopcion.usuarioCorreo ?? "";
      const adoptante = adopcion.usuarioNombre ?? "Adoptante";
      const nombreMascota = adopcion.mascotaNombre ?? "tu mascota";
      const fotoMascota = adopcion.mascotaImagen ?? "";
      const adopcionId = adopcion.id;

      const result = await cambiarEstadoAdopcion({
        ...params,
        admin_responsable: user.id,
      });

      if (email) {
        fetch(
          params.estado === "aprobada"
            ? "/api/email/adopcion-aprobada"
            : "/api/email/adopcion-rechazada",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              params.estado === "aprobada"
                ? {
                    email,
                    adoptante,
                    nombreMascota,
                    fotoMascota,
                    adopcionId,
                  }
                : {
                    email,
                    adoptante,
                    nombreMascota,
                    fotoMascota,
                    motivo: params.observaciones_admin || "Sin motivo.",
                  }
            ),
          }
        );
      }

      return result;
    },

    onSuccess: (data, vars) => {
      toast.success(
        vars.estado === "aprobada"
          ? "Adopción aprobada"
          : "Adopción rechazada"
      );

      qc.invalidateQueries({
        queryKey: adopcionesQueries.list("admin"),
      });

      if (data?.id) {
        qc.invalidateQueries({
          queryKey: adopcionesQueries.detail(data.id),
        });
      }
    },

    onError: (err) => {
      toast.error("Error al cambiar el estado");
      console.error(err);
    },

    retry: 1,
  });
}
