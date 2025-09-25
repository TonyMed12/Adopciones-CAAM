"use client";
import React from "react";
import type { Sexo, Tamano, Mascota } from "@/types/mascotas.types"; 
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

function getFotoSrc(m: Partial<Mascota>) {
  return (
    (m as any).foto ||
    (m as any).fotoUrl ||
    (m as any).imagen ||
    (m as any).image ||
    (m as any).img ||
    null
  );
}

type Props = {
  m: Mascota;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteDisabled?: boolean;
};

export default function MascotaCardFull({
  m,
  open,
  onClose,
  onEdit,
  onDelete,
  deleteDisabled,
}: Props) {
  if (!open) return null;
  const fotoSrc = getFotoSrc(m);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 " onClick={onClose} />

      {/* Card */}
      <article className="relative z-[71] w-[min(1100px,92vw)] h-[min(86vh,900px)] bg-white rounded-2xl shadow-2xl grid md:grid-cols-2 border-[4px] border-[#FF8414]">
        {/* Imagen */}
        <div className="relative bg-slate-100">
          {fotoSrc ? (
            <img
              src={String(fotoSrc)}
              alt={m.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full" />
          )}
          <span
            className={`absolute left-4 top-4 px-3 py-1 rounded-full text-white font-bold shadow ${
              m.sexo === "H" ? "bg-pink-400" : "bg-blue-400"
            }`}
          >
            {m.sexo === "H" ? "Hembra" : "Macho"}
          </span>
        </div>

        {/* Info */}
        <div className="p-6 md:p-8 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#8b4513]">{m.nombre}</h2>
              <div className="mt-2 inline-flex items-center gap-2">
                <span className="rounded-full bg-amber-100 text-[#8b4513] px-3 py-1 font-semibold">
                  {m.especie}
                </span>
              </div>
            </div>
            <button
              className="p-2 rounded-full hover:bg-slate-100"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
            <div>
              <dt className="font-semibold text-slate-800">Raza</dt>
              <dd>{m.raza || "Criollo"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Tamaño</dt>
              <dd>{m.tamano || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Edad</dt>
              <dd>{m.edadMeses} meses</dd>
            </div>
          </dl>

          {m.descripcion && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Descripción</h3>
              <p className="text-slate-800 leading-relaxed">{m.descripcion}</p>
            </div>
          )}

          <div className="mt-auto flex items-center gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={onEdit}>
              Editar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onDelete}
              disabled={deleteDisabled}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
