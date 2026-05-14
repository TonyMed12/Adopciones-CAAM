"use client";

import { PawPrint, Heart, Tag, Sparkles } from "lucide-react";

export default function MascotaInfoCard({
  mascota,
  onImageClick,
}: {
  mascota: any;
  onImageClick?: (url: string | null) => void;
}) {
  const sexo =
    mascota.sexo === "h" ? "Hembra" : mascota.sexo === "m" ? "Macho" : "—";

  return (
    <section
      className="
        relative overflow-hidden
        rounded-3xl border border-[#eadacb]
        bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2]
        p-5 sm:p-6 lg:p-7 mb-8
        shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)]
      "
    >
      {/* Decoración */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#FDE68A]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#BC5F36]/10 blur-3xl" />

      <div className="relative grid gap-5 sm:gap-6 sm:grid-cols-[auto_1fr] items-center">
        {/* Imagen */}
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <button
            type="button"
            onClick={() => onImageClick?.(mascota.imagen_url)}
            className="block group relative rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-[#f3d6bb] cursor-pointer hover:shadow-2xl transition"
          >
            <img
              src={mascota.imagen_url ?? "/placeholder.png"}
              alt={mascota.nombre}
              className="w-36 h-36 sm:w-40 sm:h-40 object-cover group-hover:scale-105 transition duration-300"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
          </button>

          <span className="absolute -top-2 -right-2 grid h-9 w-9 place-items-center rounded-full bg-[#BC5F36] text-white shadow-lg ring-4 ring-white">
            <Heart className="h-4 w-4 fill-current" />
          </span>
        </div>

        {/* Info */}
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#BC5F36] ring-1 ring-[#f3d6bb] mb-3">
            <Sparkles className="h-3 w-3" />
            En seguimiento
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#8B4513] flex flex-wrap items-center justify-center sm:justify-start gap-2 leading-tight tracking-tight">
            <span className="capitalize">{mascota.nombre}</span>
            <PawPrint className="h-6 w-6 text-[#BC5F36]" />
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {mascota.raza?.nombre && (
              <Chip Icon={Tag} label="Raza" value={mascota.raza.nombre} />
            )}

            {mascota.raza?.especie && (
              <Chip
                Icon={PawPrint}
                label="Especie"
                value={mascota.raza.especie}
              />
            )}

            <Chip Icon={Heart} label="Sexo" value={sexo} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#eadacb] px-3 py-1.5 text-sm shadow-sm">
      <Icon className="h-3.5 w-3.5 text-[#BC5F36]" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#a88b77]">
        {label}
      </span>
      <span className="font-semibold text-[#2b1b12] capitalize">{value}</span>
    </span>
  );
}
