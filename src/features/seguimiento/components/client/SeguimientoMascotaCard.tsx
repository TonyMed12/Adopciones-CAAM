"use client";

import { Button } from "@/components/ui/Button";
import { Info, PawPrint } from "lucide-react";
import SeguimientoItem from "./SeguimientoItem";

export default function SeguimientoMascotaCard({
  mascota,
  onInfo,
  onSubirSeguimiento,
}: {
  mascota: any;
  onInfo: () => void;
  onSubirSeguimiento: (seguimiento: any) => void;
}) {
  return (
    <div className="bg-[#FFF8F0] border border-[#E5D1B8] rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
        <img
          src={mascota.imagen?.startsWith("http") ? mascota.imagen : "/placeholder.png"}
          alt={mascota.nombre}
          className="rounded-2xl object-cover w-32 h-32 mx-auto sm:mx-0"
        />

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-[#8B4513] flex items-center gap-2">
            {mascota.nombre} <PawPrint size={20} />
          </h2>

          <p className="text-sm text-[#5C3D2E] mt-1">
            <b>Fecha de adopción:</b> {mascota.fechaAdopcion}
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={onInfo}
          >
            <Info size={16} /> Cómo funciona el seguimiento
          </Button>
        </div>
      </div>

      {/* Seguimientos */}
      <div className="grid gap-3">
        {mascota.seguimientos.map((s: any, i: number) => (
          <SeguimientoItem
            key={`${mascota.id}-${i}`}
            seguimiento={s}
            onSubirEvidencia={() => onSubirSeguimiento(s)}
          />
        ))}
      </div>
    </div>
  );
}
