"use client";

import { ClipboardList, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { SolicitudAdopcionMin } from "@/features/perfil/types/perfil";

function estadoTone(estado: string): "warning" | "info" | "neutral" {
  const e = estado.toLowerCase();
  if (e.includes("pend") || e.includes("rev")) return "warning";
  if (e.includes("proc") || e.includes("acti")) return "info";
  return "neutral";
}

export default function PerfilSolicitudesCard({
  solicitudes,
}: {
  solicitudes: SolicitudAdopcionMin[];
}) {
  return (
    <section className="rounded-3xl bg-white border border-[#eadacb] shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-[#eadacb] bg-[#FFF7EF]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid place-items-center h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-200 shrink-0">
            <ClipboardList size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
              Activas
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] tracking-tight truncate">
              Solicitudes en proceso
            </h2>
          </div>
        </div>

        {solicitudes.length > 0 && (
          <Badge tone="warning" size="md" dot>
            {solicitudes.length}{" "}
            {solicitudes.length === 1 ? "solicitud" : "solicitudes"}
          </Badge>
        )}
      </header>

      <div className="p-5 sm:p-6">
        {solicitudes.length === 0 ? (
          <div className="rounded-2xl bg-[#FFF7EF]/40 border border-[#eadacb] p-6 text-center">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-[#a78d7b] mx-auto mb-3 ring-1 ring-[#eadacb]">
              <ClipboardList size={20} />
            </div>
            <p className="text-sm font-bold text-[#2b1b12]">
              No tienes solicitudes pendientes
            </p>
            <p className="text-xs text-[#7a5c49] mt-1">
              Cuando inicies un proceso de adopción aparecerá aquí.
            </p>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {solicitudes.map((sol) => (
              <li
                key={sol.id}
                className="group rounded-2xl border border-[#eadacb] bg-gradient-to-br from-[#FFF7EF] to-white p-4 hover:shadow-md hover:border-[#f3d6bb] hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center h-11 w-11 rounded-2xl bg-white text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                    <PawPrint size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-[#2b1b12] capitalize truncate">
                      {sol.mascota?.nombre ?? "Mascota"}
                    </p>
                    <p className="text-xs text-[#a78d7b] mt-0.5 truncate">
                      #{sol.numero_solicitud}
                    </p>
                    <Badge tone={estadoTone(sol.estado)} size="sm" dot className="mt-2 capitalize">
                      {sol.estado}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
