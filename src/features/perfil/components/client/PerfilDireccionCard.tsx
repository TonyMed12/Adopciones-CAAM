"use client";

import { MapPin, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Direccion } from "@/features/perfil/types/perfil";

export default function PerfilDireccionCard({
  direccion,
  onEdit,
}: {
  direccion: Direccion | null;
  onEdit: () => void;
}) {
  return (
    <section className="rounded-3xl bg-white border border-[#eadacb] shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-[#eadacb] bg-[#FFF7EF]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid place-items-center h-10 w-10 rounded-2xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#BC5F36]">
              Ubicación
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] tracking-tight truncate">
              Dirección principal
            </h2>
          </div>
        </div>

        <Button
          onClick={onEdit}
          variant="secondary"
          size="sm"
          className="gap-1.5 shrink-0"
        >
          {direccion ? (
            <>
              <Pencil size={14} />
              <span className="hidden sm:inline">Editar</span>
            </>
          ) : (
            <>
              <Plus size={14} />
              <span className="hidden sm:inline">Agregar</span>
            </>
          )}
        </Button>
      </header>

      <div className="p-5 sm:p-6">
        {direccion ? (
          <div className="rounded-2xl bg-[#FFF7EF]/40 border border-[#eadacb] p-5">
            <div className="flex items-start gap-4">
              <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1 text-[#2b1b12] flex-1 min-w-0">
                <p className="font-bold text-sm sm:text-base">
                  {direccion.calle} {direccion.numero_exterior}
                  {direccion.numero_interior
                    ? ` Int. ${direccion.numero_interior}`
                    : ""}
                </p>
                <p className="text-sm text-[#6c5241]">
                  Col. {direccion.colonia}, {direccion.municipio}
                </p>
                <p className="text-sm text-[#6c5241]">
                  {direccion.estado}, CP {direccion.codigo_postal}, México
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            compact
            icon={<MapPin size={28} />}
            title="Sin dirección registrada"
            description="Agrega tu dirección principal para completar tu perfil."
            action={
              <Button onClick={onEdit} size="md" className="gap-1.5">
                <Plus size={16} />
                Agregar dirección
              </Button>
            }
          />
        )}
      </div>
    </section>
  );
}
