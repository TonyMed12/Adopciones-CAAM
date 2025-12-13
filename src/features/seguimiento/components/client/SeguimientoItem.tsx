"use client";

import dayjs from "dayjs";
import { Button } from "@/components/ui/Button";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { getEstadoChip } from "@/features/seguimiento/utils/estadoChip";

export default function SeguimientoItem({
  seguimiento,
  onSubirEvidencia,
}: {
  seguimiento: any;
  onSubirEvidencia: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 w-full border border-[#E5D1B8] rounded-xl px-4 py-3 bg-white">
      <div className="flex items-center gap-3">
        <CalendarDays size={18} className="text-[#8B4513]" />
        <div>
          <p className="text-sm font-medium text-[#8B4513]">
            {seguimiento.nombre}
          </p>
          <p className="text-xs text-gray-600">
            {dayjs(seguimiento.fecha).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={getEstadoChip(seguimiento.estado)}>
          {seguimiento.estado}
        </span>

        {seguimiento.estado === "Completado" ? (
          <CheckCircle2 className="text-green-600" size={20} />
        ) : seguimiento.estado === "Activo" ? (
          <Button size="sm" onClick={onSubirEvidencia}>
            Subir evidencia
          </Button>
        ) : (
          <Button size="sm" variant="ghost" disabled>
            Pendiente
          </Button>
        )}
      </div>
    </div>
  );
}
