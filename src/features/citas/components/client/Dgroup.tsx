"use client";
import { CalendarDays } from "lucide-react";
import { Cita } from "../../types/types";
import { formateaFechaHumana } from "./Helper";
import AppointmentItem from "./AppItem";

export default function DayGroups({
  grupos,
  onEliminar,
}: {
  grupos: [string, Cita[]][];
  onEliminar: (id: string) => void;
}) {
  return (
    <>
      {grupos.map(([fecha, items]) => (
        <div key={fecha} className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[#6b4d3e]">
            <CalendarDays size={16} /> {formateaFechaHumana(fecha)}
          </h3>
          <ul className="grid gap-3">
            {items.map((cita) => (
              <AppointmentItem key={cita.id} cita={cita} onEliminar={onEliminar} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
