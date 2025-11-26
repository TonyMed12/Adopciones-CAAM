"use client";

import CalendarioVeterinarias from "@/features/citas/components/client/CalendarioVeterinarias";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CitasVeterinariasPanelLateral({
  citas,
  proximas,
}: {
  citas: any[];
  proximas: any[];
}) {
  return (
    <div className="flex flex-col gap-4 self-start">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-[#8B4513] mb-3">
          Calendario de citas
        </h2>
        <CalendarioVeterinarias citas={citas} vistaCompacta />
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-[#8B4513] mb-3">
          Próximas citas
        </h2>

        {proximas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay próximas citas.</p>
        ) : (
          <ul className="divide-y divide-[#FDE68A]">
            {proximas.map((c) => (
              <li key={c.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-[#8B4513]">{c.mascota_nombre}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(c.fecha_cita), "EEEE d 'de' MMMM, h:mm a", {
                      locale: es,
                    })}
                  </p>
                </div>

                <span className="text-xs font-semibold text-[#8B4513]">
                  {c.estado}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
