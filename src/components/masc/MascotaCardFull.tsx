"use client";
import React from "react";
import type { Mascota } from "@/types/mascotas.types";
import { X, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

function getFotoSrc(m: Partial<Mascota>) {
  return (
    (m as any).foto ||
    (m as any).fotoUrl ||
    (m as any).imagen ||
    (m as any).image ||
    (m as any).img ||
    m.imagen_url ||
    "/no-image.png"
  );
}

type Props = {
  m: Mascota | null;
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
  if (!m) return null;

  const fotoSrc = getFotoSrc(m);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm px-4 py-8"
          onClick={onClose}
        >
          <motion.article
            key="card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden border-[4px] border-[#FF8414]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full bg-gray-100">
              <img src={fotoSrc} alt={m.nombre} className="w-full h-full object-cover" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow transition"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <span
                className={`absolute left-4 top-4 px-3 py-1 rounded-full text-white font-semibold text-sm shadow ${
                  m.sexo === "Hembra" ? "bg-pink-500" : "bg-blue-500"
                }`}
              >
                {m.sexo}
              </span>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-6 py-4">
                <h2 className="text-3xl font-bold">{m.nombre}</h2>
                <p className="text-sm text-gray-200">
                  {m.raza?.nombre || "Mestizo"} • {m.raza?.especie || "Desconocido"}
                </p>
              </div>
            </div>

            <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh] text-[#2b1b12]">
              <section className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {m.disponible_adopcion === false && (
                    <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm font-semibold">
                      No disponible
                    </span>
                  )}
                  {m.estado && (
                    <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">
                      {m.estado}
                    </span>
                  )}
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-700">Tamaño</dt>
                    <dd>{m.tamano || "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Edad</dt>
                    <dd>{m.edad ? `${m.edad} meses` : "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Peso</dt>
                    <dd>{m.peso_kg ? `${m.peso_kg} kg` : "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Altura</dt>
                    <dd>{m.altura_cm ? `${m.altura_cm} cm` : "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Esterilizado</dt>
                    <dd>{m.esterilizado ? "Sí" : "No"}</dd>
                  </div>
                </dl>

                {m.colores?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mt-2 text-slate-800">Colores</h3>
                    <p>{m.colores.join(", ")}</p>
                  </div>
                )}

                {m.personalidad && (
                  <div>
                    <h3 className="font-semibold mt-2 text-slate-800">Personalidad</h3>
                    <p className="capitalize">{m.personalidad}</p>
                  </div>
                )}

                {m.descripcion_fisica && (
                  <div>
                    <h3 className="font-semibold mt-2 text-slate-800">Descripción Física</h3>
                    <p>{m.descripcion_fisica}</p>
                  </div>
                )}

                {(m.lugar_rescate || m.condicion_ingreso || m.observaciones_medicas) && (
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <h3 className="font-semibold text-slate-800 mb-1">Datos Médicos y de Rescate</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {m.lugar_rescate && (
                        <div>
                          <dt className="font-semibold text-slate-700">Lugar de rescate</dt>
                          <dd>{m.lugar_rescate}</dd>
                        </div>
                      )}
                      {m.condicion_ingreso && (
                        <div>
                          <dt className="font-semibold text-slate-700">Condición al ingreso</dt>
                          <dd>{m.condicion_ingreso}</dd>
                        </div>
                      )}
                    </dl>
                    {m.observaciones_medicas && (
                      <p className="mt-2 text-slate-700 text-sm">
                        <strong>Observaciones:</strong> {m.observaciones_medicas}
                      </p>
                    )}
                  </div>
                )}

                {m.fecha_ingreso && (
                  <p className="text-xs text-slate-500 mt-4">
                    Fecha de ingreso: {new Date(m.fecha_ingreso).toLocaleDateString("es-MX")}
                  </p>
                )}
              </section>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit3 className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button variant="primary" size="sm" onClick={onDelete} disabled={deleteDisabled}>
                  <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                </Button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
