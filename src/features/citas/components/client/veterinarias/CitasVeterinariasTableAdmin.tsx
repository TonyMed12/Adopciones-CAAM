"use client";

import { Button } from "@/components/ui/Button";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CitasVeterinariasTablaAdmin({
  citas,
  onAprobar,
  onCancelar,
}: {
  citas: any[];
  onAprobar: (c: any) => void;
  onCancelar: (c: any) => void;
}) {
  return (
    <div className="hidden lg:flex justify-center w-full">
      <div className="bg-white rounded-xl shadow-md overflow-x-auto w-full max-w-[1200px]">
        <table className="w-full text-sm text-left text-gray-700">

          <thead className="bg-[#FFF6E5] text-[#8B4513]">
            <tr>
              <th className="px-4 py-3 w-[18%]">Adoptante</th>
              <th className="px-4 py-3 w-[18%]">Mascota</th>
              <th className="px-4 py-3 w-[18%]">Fecha</th>
              <th className="px-4 py-3 w-[20%]">Motivo</th>
              <th className="px-4 py-3 w-[12%]">Estado</th>
              <th className="px-4 py-3 text-center w-[14%]">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5e6d3] text-gray-700">

            {citas.map((item) => (
              <tr key={item.id} className="hover:bg-[#FFF8F0]">

                {/* Adoptante */}
                <td className="px-4 py-3 whitespace-normal break-words max-w-[180px]">
                  {item.adoptante_nombre}
                </td>

                {/* Mascota */}
                <td className="px-4 py-3 flex items-center gap-2 max-w-[160px]">
                  {item.mascota_imagen && (
                    <img
                      src={item.mascota_imagen}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                  )}
                  <span className="truncate max-w-[100px]">
                    {item.mascota_nombre}
                  </span>
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 whitespace-normal break-words max-w-[200px]">
                  {format(
                    new Date(item.fecha_cita),
                    "EEEE d 'de' MMMM, h:mm a",
                    { locale: es }
                  )}
                </td>

                {/* Motivo */}
                <td className="px-4 py-3 whitespace-normal break-words max-w-[260px]">
                  {item.motivo}
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <CitasVeterinariasEstadoBadge estado={item.estado} />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 text-center">
                  {item.estado === "pendiente" ? (
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onAprobar(item)}
                      >
                        Aprobar
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCancelar(item)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-xs">
                      {item.estado}
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
