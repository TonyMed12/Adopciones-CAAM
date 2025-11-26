"use client";

import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";

export function CitasVeterinariasCardsAdmin({
  citas,
  onAprobar,
  onCancelar,
}: {
  citas: any[];
  onAprobar: (c: any) => void;
  onCancelar: (c: any) => void;
}) {
  return (
    <div className="lg:hidden space-y-4">
      {citas.map((c) => (
        <div key={c.id} className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
          <div className="flex justify-between">
            <h3 className="font-bold text-[#8B4513]">{c.mascota_nombre}</h3>
            <CitasVeterinariasEstadoBadge estado={c.estado} />
          </div>

          <div className="flex items-center gap-3">
            {c.mascota_imagen && (
              <img src={c.mascota_imagen} className="w-12 h-12 rounded-md object-cover" />
            )}
            <div className="text-sm">
              <p className="font-semibold text-[#8B4513]">{c.adoptante_nombre}</p>
              <p className="text-xs">
                {format(new Date(c.fecha_cita), "EEEE d 'de' MMMM, h:mm a", { locale: es })}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-700">
            <b className="text-[#8B4513]">Motivo:</b> {c.motivo}
          </p>

          {c.estado === "pendiente" && (
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="primary" onClick={() => onAprobar(c)} className="flex-1">
                Aprobar
              </Button>

              <Button size="sm" variant="ghost" onClick={() => onCancelar(c)} className="flex-1">
                Cancelar
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
