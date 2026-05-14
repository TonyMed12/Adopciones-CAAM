"use client";

import { Heart, PawPrint } from "lucide-react";

export type MascotaAdoptadaMin = {
  id: string;
  nombre: string;
  imagen_url: string | null;
  sexo?: string;
  tamano?: string;
  edad?: string | null;
  personalidad?: string | null;
  raza?: { nombre: string; especie: string } | null;
};

export function MascotaCardAdoptada({
  mascota,
}: {
  mascota: MascotaAdoptadaMin;
}) {
  const esHembra = mascota.sexo?.toLowerCase()?.startsWith("h");

  return (
    <article className="group overflow-hidden rounded-2xl bg-white border border-[#eadacb] shadow-sm hover:shadow-md hover:border-[#f3d6bb] hover:-translate-y-0.5 transition-all">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] overflow-hidden">
        {mascota.imagen_url ? (
          <img
            src={mascota.imagen_url}
            alt={mascota.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <PawPrint size={36} className="text-[#d7c4b2]" />
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm text-[#BC5F36] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <Heart size={10} fill="currentColor" />
            Adoptada
          </span>

          {mascota.sexo && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md ${
                esHembra
                  ? "bg-gradient-to-r from-pink-500 to-rose-500"
                  : "bg-gradient-to-r from-sky-500 to-blue-600"
              }`}
            >
              {esHembra ? "♀" : "♂"}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-extrabold text-[#2b1b12] capitalize tracking-tight truncate">
          {mascota.nombre}
        </h3>

        {mascota.raza?.nombre && (
          <p className="text-xs text-[#7a5c49] capitalize mt-0.5 truncate">
            {mascota.raza.nombre}
          </p>
        )}

        {mascota.personalidad && (
          <p className="text-xs italic mt-2 text-[#6c5241] line-clamp-2 leading-relaxed">
            "{mascota.personalidad}"
          </p>
        )}
      </div>
    </article>
  );
}
