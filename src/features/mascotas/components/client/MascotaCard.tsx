"use client";
import React from "react";
import {
  Heart,
  Ruler,
  Cake,
  Sparkles,
  Eye,
  PawPrint,
} from "lucide-react";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import { Button } from "@/components/ui/Button";

type Props = {
  m: Mascota;
  onView: () => void;
  onAdopt: () => void;
  adoptDisabled?: boolean;
};

export default function MascotaCard({
  m,
  onView,
  onAdopt,
  adoptDisabled = false,
}: Props) {
  const fotoSrc = m.imagen_url ?? null;

  const estado = m.estado?.toLowerCase() ?? "disponible";
  const disponible =
    m.disponible_adopcion !== false && estado === "disponible";

  let botonTexto = "Adoptar";
  let disabled = adoptDisabled;

  if (estado === "adoptada") {
    botonTexto = "Adoptada";
    disabled = true;
  } else if (estado === "en_proceso") {
    botonTexto = "En proceso";
    disabled = true;
  } else if (!disponible) {
    botonTexto = "No disponible";
    disabled = true;
  }

  const esHembra = m.sexo?.toLowerCase() === "hembra";

  const capitalizar = (s?: string | null) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "—";

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white border border-[#eadacb] shadow-sm hover:shadow-xl hover:border-[#f3d6bb] hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in">
      {/* ============ Imagen ============ */}
      <button
        type="button"
        onClick={onView}
        className="relative aspect-[5/4] bg-[#f7eee4] overflow-hidden focus:outline-none"
        aria-label={`Ver detalles de ${m.nombre}`}
      >
        {fotoSrc ? (
          <img
            src={fotoSrc}
            alt={m.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-gradient-to-br from-[#FFF1E6] to-[#f7eee4]">
            <PawPrint size={48} className="text-[#d7c4b2]" />
          </div>
        )}

        {/* Gradiente sutil para legibilidad de chips */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />

        {/* Chips arriba */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          {/* Sexo */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md ${
              esHembra
                ? "bg-gradient-to-r from-pink-500 to-rose-500"
                : "bg-gradient-to-r from-sky-500 to-blue-600"
            }`}
          >
            <span className="text-sm leading-none">{esHembra ? "♀" : "♂"}</span>
            {capitalizar(m.sexo)}
          </span>

          {/* Estado (badge) */}
          {estado === "adoptada" && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white bg-slate-700/95 shadow-md backdrop-blur-sm">
              Adoptada
            </span>
          )}
          {estado === "en_proceso" && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-amber-300/95 shadow-md backdrop-blur-sm">
              En proceso
            </span>
          )}
          {disponible && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-emerald-50 bg-emerald-600/90 shadow-md backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />
              Disponible
            </span>
          )}
        </div>

        {/* Especie badge bottom-left */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-[#8B4513] shadow-md">
          <PawPrint size={12} />
          {m.raza?.especie ?? "Otro"}
        </div>
      </button>

      {/* ============ Info ============ */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-extrabold text-[#2b1b12] text-lg leading-tight truncate"
            title={m.nombre}
          >
            {m.nombre}
          </h3>
          <span className="shrink-0 rounded-full bg-[#FFF1E6] text-[#8B4513] px-2 py-0.5 text-[11px] font-semibold">
            {m.raza?.nombre ?? "Criollo"}
          </span>
        </div>

        {/* Meta grid */}
        <ul className="grid grid-cols-3 gap-2">
          <li className="flex flex-col items-start gap-0.5 rounded-lg bg-[#FFF7EF] border border-[#eadacb] px-2 py-2">
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide text-[#a78d7b]">
              <Cake size={11} /> Edad
            </span>
            <span className="text-xs font-bold text-[#2b1b12] truncate w-full">
              {m.edad ?? "—"}
            </span>
          </li>
          <li className="flex flex-col items-start gap-0.5 rounded-lg bg-[#FFF7EF] border border-[#eadacb] px-2 py-2">
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide text-[#a78d7b]">
              <Ruler size={11} /> Tamaño
            </span>
            <span className="text-xs font-bold text-[#2b1b12] truncate w-full">
              {capitalizar(m.tamano)}
            </span>
          </li>
          <li className="flex flex-col items-start gap-0.5 rounded-lg bg-[#FFF7EF] border border-[#eadacb] px-2 py-2">
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide text-[#a78d7b]">
              <Sparkles size={11} /> Pers.
            </span>
            <span className="text-xs font-bold text-[#2b1b12] truncate w-full">
              {m.personalidad
                ? m.personalidad.split(",")[0]
                : "—"}
            </span>
          </li>
        </ul>

        {/* Acciones */}
        <div className="mt-auto pt-2 flex gap-2">
          <Button
            variant="ghost"
            size="md"
            onClick={onView}
            className="!flex-1 gap-1.5"
          >
            <Eye size={16} /> Ver más
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onAdopt}
            disabled={disabled}
            className="!flex-1 gap-1.5"
          >
            <Heart size={16} fill="currentColor" /> {botonTexto}
          </Button>
        </div>
      </div>
    </article>
  );
}
