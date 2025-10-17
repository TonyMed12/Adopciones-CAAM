"use client";
import React from "react";
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

type RowActions = {
  onViewCard: (m: Mascota) => void;
  onEdit: (m: Mascota) => void;
  onDelete: (m: Mascota) => void;
};

type Props = {
  data: Mascota[];
  actions: RowActions;
  deleteDisabledForId?: (id: string) => boolean;
};

export default function MascotasTable({
  data,
  actions,
  deleteDisabledForId,
}: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-amber-50">
          <tr className="text-left text-slate-700">
            <Th>Foto</Th>
            <Th>Nombre</Th>
            <Th>Especie</Th>
            <Th>Raza</Th>
            <Th>Tamaño</Th>
            <Th>Edad</Th>
            <Th>Descripción</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((m) => {
            const foto = getFotoSrc(m);
            return (
              <tr key={m.id} className="hover:bg-amber-50/40">
                <Td>
                  <button
                    onClick={() => actions.onViewCard(m)}
                    className="block w-14 h-14 rounded-lg overflow-hidden bg-slate-100"
                    title="Ver tarjeta"
                  >
                    {foto ? (
                      <img
                        src={String(foto)}
                        alt={m.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </button>
                </Td>
                <Td className="font-semibold text-slate-900">
                  <button
                    onClick={() => actions.onViewCard(m)}
                    className="hover:underline"
                    title="Ver tarjeta"
                  >
                    {m.nombre}
                  </button>
                </Td>
                <Td>
                  <span className="inline-flex items-center rounded-full bg-amber-100 text-[#8b4513] px-2.5 py-1 text-xs font-semibold">
                    {m.especie}
                  </span>
                </Td>
                <Td>{m.raza || "Criollo"}</Td>
                <Td>{m.tamano || "—"}</Td>
                <Td>{m.edadMeses} </Td>
                <Td className="max-w-[320px]">
                  <p className="line-clamp-2 text-slate-700">
                    {m.descripcion || "—"}
                  </p>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => actions.onEdit(m)}>
                      Editar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => actions.onDelete(m)}
                      disabled={deleteDisabledForId?.(m.id) ?? false}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${props.className || ""}`}
    />
  );
}
function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={`px-3 py-3 align-middle text-sm text-slate-800 ${props.className || ""}`}
    />
  );
}
