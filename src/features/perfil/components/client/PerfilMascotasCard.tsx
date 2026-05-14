"use client";

import { Heart, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MascotaCardAdoptada } from "./MascotaCardAdoptada";

export default function PerfilMascotasCard({
  mascotas,
}: {
  mascotas: any[];
}) {
  return (
    <section className="rounded-3xl bg-white border border-[#eadacb] shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-[#eadacb] bg-[#FFF7EF]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid place-items-center h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200 shrink-0">
            <Heart size={18} fill="currentColor" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
              Mi familia
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] tracking-tight truncate">
              Mascotas adoptadas
            </h2>
          </div>
        </div>

        {mascotas.length > 0 && (
          <Badge tone="solid" size="md" icon={<Heart size={12} fill="currentColor" />}>
            {mascotas.length}{" "}
            {mascotas.length === 1 ? "mascota" : "mascotas"}
          </Badge>
        )}
      </header>

      <div className="p-5 sm:p-6">
        {mascotas.length === 0 ? (
          <div className="rounded-2xl bg-[#FFF7EF]/40 border border-[#eadacb] p-6 text-center">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-[#a78d7b] mx-auto mb-3 ring-1 ring-[#eadacb]">
              <PawPrint size={20} />
            </div>
            <p className="text-sm font-bold text-[#2b1b12]">
              Aún no has adoptado ninguna mascota
            </p>
            <p className="text-xs text-[#7a5c49] mt-1">
              Cuando completes tu primera adopción, aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mascotas.map((m) => (
              <MascotaCardAdoptada key={m.id} mascota={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
