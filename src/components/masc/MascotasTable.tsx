"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FormMascota from "@/components/masc/FormMascota";

type RowMascota = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  tamano: string | null;
  edadMeses: string;
  descripcion: string;
  foto: string | null;
  original?: any;
};

type RowActions = {
  onViewCard?: (row: RowMascota) => void;
  onEdited?: () => void;
  onDelete?: (row: RowMascota) => void;
};

type Props = {
  data: RowMascota[];
  actions?: RowActions;
  deleteDisabledForId?: (id: string) => boolean;
  mode?: "default" | "seguimiento"; // 🔥 NUEVO
};

function getFotoSrc(m: RowMascota) {
  return m.foto || null;
}

export default function MascotasTable({
  data,
  actions,
  deleteDisabledForId,
  mode = "default",
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<RowMascota | null>(null);

  const disableActions = mode === "seguimiento";
  const isSeguimientoMode = mode === "seguimiento";

  function handleEdit(row: RowMascota) {
    if (isSeguimientoMode) return; // 🔥 bloquear edición en modo seguimiento
    setSelected(row);
    setEditOpen(true);
  }

  return (
    <>
      {/* Modal de edición */}
      {!disableActions && (
        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title={selected ? `Editar: ${selected.nombre}` : "Editar Mascota"}
        >
          {selected && (
            <FormMascota
              key={selected.id}
              mascota={selected.original ?? selected}
              onCancel={() => setEditOpen(false)}
              onSubmit={() => {
                setEditOpen(false);
                actions?.onEdited?.();
              }}
            />
          )}
        </Modal>
      )}

      {/* Tabla */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[950px] w-full border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-amber-50">
            <tr className="text-left text-slate-700">
              <Th>Foto</Th>
              <Th>Nombre</Th>
              <Th>Especie</Th>
              <Th>Sexo</Th>
              <Th>Raza</Th>
              <Th>Tamaño</Th>
              <Th>Edad</Th>
              <Th>Personalidad</Th>
              {!disableActions && <Th className="text-right">Acciones</Th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((m) => {
              const foto = getFotoSrc(m);
              const sexo =
                m.sexo?.toLowerCase() === "h" ||
                m.sexo?.toLowerCase() === "hembra"
                  ? "Hembra"
                  : "Macho";
              const colorSexo =
                sexo === "Hembra"
                  ? "bg-pink-100 text-pink-700"
                  : "bg-blue-100 text-blue-700";

              return (
                <tr key={m.id} className="hover:bg-amber-50/40">
                  {/* Foto */}
                  <Td>
                    <button
                      onClick={() => actions?.onViewCard?.(m)}
                      className="block w-14 h-14 rounded-lg overflow-hidden bg-slate-100"
                      title={isSeguimientoMode ? "Ver seguimiento" : "Ver tarjeta"}
                    >
                      {foto && (
                        <img
                          src={String(foto)}
                          alt={m.nombre}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  </Td>

                  {/* 🔥 NOMBRE RESALTADO NUEVO */}
                  <Td>
                    <button
                      onClick={() => actions?.onViewCard?.(m)}
                      className="
                        px-2 py-1 rounded-md 
                        transition 
                        text-[15px] font-semibold
                        text-slate-900
                        hover:bg-amber-100 
                        hover:ring-2 hover:ring-amber-300
                        hover:text-amber-800
                      "
                      title={isSeguimientoMode ? "Ver seguimiento" : "Ver tarjeta"}
                    >
                      {m.nombre}
                    </button>
                  </Td>

                  {/* Especie */}
                  <Td>
                    <span className="inline-flex items-center rounded-full bg-amber-100 text-[#8b4513] px-2.5 py-1 text-xs font-semibold">
                      {m.especie}
                    </span>
                  </Td>

                  {/* Sexo */}
                  <Td>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${colorSexo}`}
                    >
                      {sexo}
                    </span>
                  </Td>

                  {/* Raza */}
                  <Td>{m.raza || "Criollo"}</Td>

                  {/* Tamaño */}
                  <Td>
                    {m.tamano
                      ? m.tamano.charAt(0).toUpperCase() +
                        m.tamano.slice(1).toLowerCase()
                      : "—"}
                  </Td>

                  {/* Edad */}
                  <Td>{m.edadMeses || "—"}</Td>

                  {/* Personalidad / descripción */}
                  <Td className="max-w-[320px]">
                    <p className="line-clamp-2 text-slate-700">
                      {m.descripcion
                        ? m.descripcion.charAt(0).toUpperCase() +
                          m.descripcion.slice(1)
                        : "—"}
                    </p>
                  </Td>

                  {/* 🔥 Acciones solo en modo default */}
                  {!disableActions && (
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(m)}
                        >
                          Editar
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => actions?.onDelete?.(m)}
                          disabled={deleteDisabledForId?.(m.id) ?? false}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${
        props.className || ""
      }`}
    />
  );
}

function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={`px-3 py-3 align-middle text-sm text-slate-800 ${
        props.className || ""
      }`}
    />
  );
}
