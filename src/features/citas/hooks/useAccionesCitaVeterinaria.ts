"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCambiarEstadoCita } from "./useCambiarEstadoCitaVeterinaria";
import { CitasVeterinariasKeys } from "@/features/citas/queries/citas-veterinarias-keys";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function useAccionesCitaVeterinaria() {
  const { mutateAsync: cambiarEstado } = useCambiarEstadoCita();
  const qc = useQueryClient();

  const formatearFecha = (fecha: string) =>
    format(new Date(fecha), "EEEE d 'de' MMMM, h:mm a", { locale: es });

  const aprobar = async (item: any) => {
    try {
      await cambiarEstado({ id: item.id, estado: "aprobada" });

      const fechaTexto = formatearFecha(item.fecha_cita);

      await fetch("/api/email/cita-veterinaria-aprobada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: item.adoptante_correo,
          nombre: item.adoptante_nombre,
          nombreMascota: item.mascota_nombre,
          fotoMascota: item.mascota_imagen,
          fechaTexto,
        }),
      });

      toast.success("Cita aprobada correctamente.");

      qc.invalidateQueries({
        queryKey: CitasVeterinariasKeys.admin.all(),
      });
    } catch (error) {
      toast.error("Error al aprobar la cita.");
    }
  };

  const cancelar = async (item: any) => {
    try {
      await cambiarEstado({ id: item.id, estado: "cancelada" });

      const fechaTexto = formatearFecha(item.fecha_cita);

      await fetch("/api/email/cita-veterinaria-cancelada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: item.adoptante_correo,
          nombre: item.adoptante_nombre,
          nombreMascota: item.mascota_nombre,
          fotoMascota: item.mascota_imagen,
          motivo: item.motivo,
          fechaTexto,
        }),
      });

      toast.success("Cita cancelada correctamente.");

      qc.invalidateQueries({
        queryKey: CitasVeterinariasKeys.admin.all(),
      });
    } catch (error) {
      toast.error("Error al cancelar la cita.");
    }
  };

  return { aprobar, cancelar };
}
