"use client";
import { CalendarDays, Plus } from "lucide-react";

export default function EmptyState({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#eadacb] bg-white p-10 text-center">
      <div className="mx-auto max-w-sm space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#fff4e7] text-[#8B4513]">
          <CalendarDays />
        </div>
        <h3 className="text-lg font-extrabold text-[#2b1b12]">No tienes citas aún</h3>
        <p className="text-sm text-[#6b4d3e]">Agenda tu primera cita. Solo necesitamos unos pocos datos.</p>
        <button
          onClick={onNueva}
          className="w-full justify-center inline-flex items-center gap-2 rounded-2xl bg-[#BC5F36] px-4 py-2 text-sm font-bold text-white shadow"
        >
          <Plus size={18} /> Agendar cita
        </button>
      </div>
    </div>
  );
}
