"use client";
import { Cita } from "../../types/types";

export default function Resumen({
  hoyISO,
  inicioSemanaISO,
  finSemanaISO,
  total,
  citas,
}: {
  hoyISO: string;
  inicioSemanaISO: string;
  finSemanaISO: string;
  total: number;
  citas: Cita[];
}) {
  return (
    <div className="rounded-2xl border border-[#eadacb] bg-white p-4">
      <h3 className="text-sm font-extrabold text-[#2b1b12]">Resumen</h3>
      <ul className="mt-3 grid gap-2 text-sm text-[#6b4d3e]">
        <li className="flex items-center justify-between">
          <span>Hoy</span><span className="font-bold">{citas.filter((c) => c.fecha === hoyISO).length}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Esta semana</span><span className="font-bold">{citas.filter((c) => c.fecha >= inicioSemanaISO && c.fecha <= finSemanaISO).length}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Total registradas</span><span className="font-bold">{total}</span>
        </li>
      </ul>
    </div>
  );
}
