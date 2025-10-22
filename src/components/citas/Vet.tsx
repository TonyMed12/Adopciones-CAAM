"use client";
import { Stethoscope, Phone } from "lucide-react";

export default function VeterinarioDestacado({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="rounded-2xl border border-[#eadacb] bg-white p-4">
      <h3 className="text-sm font-extrabold text-[#2b1b12]">Veterinario destacado</h3>
      <div className="mt-3 flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#BC5F36]/10 text-[#BC5F36]">
          <Stethoscope />
        </div>
        <div className="text-sm text-[#6b4d3e]">
          <div className="font-extrabold text-[#2b1b12]">Dra. Gómez</div>
          <div>Clínica Patitas #12</div>
          <div className="mt-1 inline-flex items-center gap-1 text-xs"><Phone size={14}/> +52 55 1234 5678</div>
        </div>
      </div>
      <button onClick={onNueva} className="mt-4 w-full rounded-xl bg-[#BC5F36] py-2 text-sm font-bold text-white">
        Agendar con este vet
      </button>
    </div>
  );
}
