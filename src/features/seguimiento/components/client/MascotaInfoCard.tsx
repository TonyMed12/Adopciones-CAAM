"use client";

import { PawPrint } from "lucide-react";

export default function MascotaInfoCard({
  mascota,
  onImageClick,
}: {
  mascota: any;
  onImageClick?: (url: string | null) => void;
}) {
  return (
    <div className="bg-[#FFF8F0] border border-[#E5D1B8] rounded-2xl p-6 flex gap-6 mb-10">
      <img
        src={mascota.imagen_url ?? "/placeholder.png"}
        className="w-40 h-40 rounded-xl object-cover border border-[#BC5F36]/40 cursor-pointer hover:opacity-90 transition"
        onClick={() => onImageClick?.(mascota.imagen_url)}
      />

      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-[#8B4513] flex gap-2 items-center">
          {mascota.nombre}
          <PawPrint size={22} />
        </h2>

        <p className="text-sm text-[#5C3D2E] mt-1">
          <b>Raza:</b> {mascota.raza?.nombre}
        </p>

        <p className="text-sm text-[#5C3D2E]">
          <b>Especie:</b> {mascota.raza?.especie}
        </p>

        <p className="text-sm text-[#5C3D2E]">
          <b>Sexo:</b> {mascota.sexo === "h" ? "Hembra" : "Macho"}
        </p>
      </div>
    </div>
  );
}
