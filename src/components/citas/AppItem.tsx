"use client";
import { Clock, MapPin, PawPrint, Stethoscope, Trash2 } from "lucide-react";
import { Cita } from "../../data/citas/types";

export default function AppointmentItem({ cita, onEliminar }: { cita: Cita; onEliminar: (id: string) => void }) {
  return (
    <li className="rounded-2xl border border-[#eadacb] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff4e7] text-[#BC5F36]">
            <PawPrint size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-2 text-[15px] text-[#6b4d3e]">
              <span className="font-extrabold text-[#2b1b12]">{cita.mascota}</span>
              <span>•</span>
              <span>{cita.motivo}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-[#6b4d3e]">
              <span className="inline-flex items-center gap-1"><Clock size={14} /> {cita.hora} · {cita.duracionMin} min</span>
              <span className="inline-flex items-center gap-1"><Stethoscope size={14} /> {cita.veterinario}</span>
              {cita.lugar && <span className="inline-flex items-center gap-1"><MapPin size={14} /> {cita.lugar}</span>}
            </div>
            {cita.notas && <p className="mt-2 text-sm text-[#6b4d3e]">{cita.notas}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEliminar(cita.id)}
            className="inline-flex items-center gap-1 rounded-xl border border-[#eadacb] bg-white px-3 py-2 text-xs font-bold text-[#8a5d49] hover:bg-[#fff4e7]"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}
