"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/useIsMobile";
import Pagination from "@/components/ui/Pagination";
import type { Mascota } from "@/features/mascotas/types/mascotas";

export type RowMascota = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  tamano: string | null;
  edadMeses: string;
  descripcion: string;
  foto: string | null;
  original?: Mascota;
};

type RowActions = {
  onViewCard?: (row: RowMascota) => void;
  onEdit?: (row: RowMascota) => void;
  onDelete?: (row: RowMascota) => void;
};

type Props = {
  data: RowMascota[];
  actions?: RowActions;
  deleteDisabledForId?: (id: string) => boolean;
  mode?: "default" | "seguimiento";

  totalItems: number;
  page: number;
  onPageChange: (page: number) => void;
};

function getFotoSrc(m: RowMascota) {
  return m.foto || null;
}

export default function MascotasTable({
  data,
  actions,
  deleteDisabledForId,
  mode = "default",

  page,
  onPageChange,
  totalItems,
}: Props) {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;
  const disableActions = mode === "seguimiento";

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = data.slice(startIndex, endIndex);

  return (
    <>
      {/* MOBILE */}
      {isMobile ? (
        <div className="grid gap-4">
          {pageData.map((m) => {
            const foto = getFotoSrc(m);
            const sexo =
              m.sexo?.toLowerCase() === "hembra" ? "Hembra" : "Macho";
            const colorSexo =
              sexo === "Hembra"
                ? "bg-pink-100 text-pink-700"
                : "bg-blue-100 text-blue-700";

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3"
              >
                <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-100">
                  {foto && (
                    <img
                      src={foto}
                      alt={m.nombre}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#5C3D2E]">
                    {m.nombre}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${colorSexo}`}
                  >
                    {sexo}
                  </span>
                </div>

                <div className="text-sm text-slate-700 space-y-1">
                  <p><b>Especie:</b> {m.especie}</p>
                  <p><b>Raza:</b> {m.raza || "Criollo"}</p>
                  <p><b>Tamaño:</b> {m.tamano || "—"}</p>
                  <p><b>Edad:</b> {m.edadMeses || "—"}</p>
                  <p className="line-clamp-2"><b>Personalidad:</b> {m.descripcion || "—"}</p>
                </div>

                {!disableActions && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => actions?.onViewCard?.(m)}
                    >
                      Ver
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => actions?.onEdit?.(m)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={deleteDisabledForId?.(m.id)}
                      onClick={() => actions?.onDelete?.(m)}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
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
              {pageData.map((m) => {
                const foto = getFotoSrc(m);
                const sexo =
                  m.sexo?.toLowerCase() === "hembra" ? "Hembra" : "Macho";
                const colorSexo =
                  sexo === "Hembra"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-blue-100 text-blue-700";

                return (
                  <tr key={m.id} className="hover:bg-amber-50/40">
                    <Td>
                      <button
                        onClick={() => actions?.onViewCard?.(m)}
                        className="block w-14 h-14 rounded-lg overflow-hidden bg-slate-100"
                      >
                        {foto && (
                          <img
                            src={foto}
                            alt={m.nombre}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    </Td>

                    <Td>
                      <button
                        onClick={() => actions?.onViewCard?.(m)}
                        className="px-2 py-1 rounded-md transition text-[15px] font-semibold hover:bg-amber-100 hover:ring-2 hover:ring-amber-300 hover:text-amber-800"
                      >
                        {m.nombre}
                      </button>
                    </Td>

                    <Td>{m.especie}</Td>

                    <Td>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${colorSexo}`}
                      >
                        {sexo}
                      </span>
                    </Td>

                    <Td>{m.raza || "Criollo"}</Td>
                    <Td>{m.tamano || "—"}</Td>
                    <Td>{m.edadMeses || "—"}</Td>

                    <Td className="max-w-[320px]">
                      <p className="line-clamp-2 text-slate-700">
                        {m.descripcion || "—"}
                      </p>
                    </Td>

                    {!disableActions && (
                      <Td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions?.onEdit?.(m)}
                          >
                            Editar
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            disabled={deleteDisabledForId?.(m.id)}
                            onClick={() => actions?.onDelete?.(m)}
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
      )}

      {page !== undefined &&
        onPageChange &&
        typeof totalItems === "number" && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            itemsLabel="mascotas"
            onChange={onPageChange}
          />
        )}


    </>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${props.className || ""
        }`}
    />
  );
}

function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={`px-3 py-3 align-middle text-sm text-slate-800 ${props.className || ""
        }`}
    />
  );
}
