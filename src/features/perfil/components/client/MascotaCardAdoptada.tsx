"use client";

import { Card } from "@/components/ui/card";

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
  return (
    <Card className="overflow-hidden bg-[#fffaf3] border border-[#e2cbb3] rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="relative w-full h-48">
        <img
          src={mascota.imagen_url || "/placeholder.jpg"}
          alt={mascota.nombre}
          className="w-full h-full object-cover"
        />

        {mascota.sexo && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full ${
              mascota.sexo === "macho" ? "bg-blue-500" : "bg-pink-400"
            }`}
          >
            {mascota.sexo === "macho" ? "Macho" : "Hembra"}
          </span>
        )}
      </div>

      <div className="p-4 text-[#5b3e26]">
        <h3 className="text-lg font-semibold text-[#8b4513]">
          {mascota.nombre}
        </h3>

        {mascota.raza?.nombre && (
          <p className="text-sm">
            <span className="font-semibold">Raza:</span>{" "}
            {mascota.raza.nombre}
          </p>
        )}

        {mascota.personalidad && (
          <p className="text-sm italic mt-2 text-[#7a5c49]">
            {mascota.personalidad}
          </p>
        )}
      </div>
    </Card>
  );
}
