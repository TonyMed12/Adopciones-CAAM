"use client";
import React from "react";
import type {Mascota} from "@/types/mascotas.types";
import {X} from "lucide-react";
import {Button} from "@/components/ui/Button";

function getFotoSrc(m: Partial<Mascota>) {
    return (
        (m as any).foto ||
        (m as any).fotoUrl ||
        (m as any).imagen ||
        (m as any).image ||
        (m as any).img ||
        m.imagen_url ||
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

export default function MascotaCardFull({m, open, onClose, onEdit, onDelete, deleteDisabled}: Props) {
    if (!open) return null;
    const fotoSrc = getFotoSrc(m);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.45)] px-4 py-8 overflow-y-auto">
            <div className="absolute inset-0" onClick={onClose} />
            <article className="relative z-[71] w-[min(1100px,92vw)] h-[min(86vh,900px)] bg-white rounded-2xl shadow-2xl grid md:grid-cols-2 border-[4px] border-[#FF8414]">
                {/* Imagen */}
                <div className="relative bg-slate-100">
                    {fotoSrc ? (
                        <img src={String(fotoSrc)} alt={m.nombre} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-100" />
                    )}
                    <span
                        className={`absolute left-4 top-4 px-3 py-1 rounded-full text-white font-bold shadow ${
                            m.sexo === "Hembra" ? "bg-pink-400" : "bg-blue-400"
                        }`}
                    >
                        {m.sexo}
                    </span>
                </div>

                {/* Información */}
                <div className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto">
                    {/* Encabezado */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[#8b4513]">{m.nombre}</h2>
                            <div className="mt-2 inline-flex items-center gap-2">
                                {m.estado && (
                                    <span className="rounded-full bg-green-100 text-green-800 px-3 py-1 font-semibold capitalize">
                                        {m.estado}
                                    </span>
                                )}
                                {m.disponible_adopcion === false && (
                                    <span className="rounded-full bg-red-100 text-red-800 px-3 py-1 font-semibold capitalize">
                                        No disponible
                                    </span>
                                )}
                            </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-slate-100" onClick={onClose} aria-label="Cerrar">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Datos principales */}
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
                        <div>
                            <dt className="font-semibold text-slate-800">Raza</dt>
                            <dd>{m.raza  || "Criollo"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-800">Tamaño</dt>
                            <dd>
                                {m.tamano ? m.tamano.charAt(0).toUpperCase() + m.tamano.slice(1).toLowerCase() : "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-800">Edad</dt>
                            <dd>{m.edad || "—"} meses</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-800">Peso</dt>
                            <dd>{m.peso_kg ? `${m.peso_kg} kg` : "—"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-800">Altura</dt>
                            <dd>{m.altura_cm ? `${m.altura_cm} cm` : "—"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-800">Esterilizado</dt>
                            <dd>{m.esterilizado ? "Sí" : "No"}</dd>
                        </div>
                    </dl>

                    {/* Campos adicionales */}
                    {m.colores && m.colores.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Colores</h3>
                            <p className="text-slate-800">{m.colores.join(", ")}</p>
                        </div>
                    )}

                    {m.personalidad && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Personalidad</h3>
                            <p className="text-slate-800">{m.personalidad}</p>
                        </div>
                    )}

                    {m.descripcion_fisica && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Descripción Física</h3>
                            <p className="text-slate-800">{m.descripcion_fisica}</p>
                        </div>
                    )}

                    {/* Datos médicos y rescate */}
                    {(m.lugar_rescate || m.condicion_ingreso || m.observaciones_medicas) && (
                        <div className="border-t border-slate-200 pt-3">
                            <h3 className="font-semibold text-slate-900 mb-2">Datos Médicos y de Rescate</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
                                {m.lugar_rescate && (
                                    <div>
                                        <dt className="font-semibold text-slate-800">Lugar de rescate</dt>
                                        <dd>{m.lugar_rescate}</dd>
                                    </div>
                                )}
                                {m.condicion_ingreso && (
                                    <div>
                                        <dt className="font-semibold text-slate-800">Condición de ingreso</dt>
                                        <dd>{m.condicion_ingreso}</dd>
                                    </div>
                                )}
                            </dl>
                            {m.observaciones_medicas && (
                                <p className="mt-2 text-slate-800 text-sm leading-relaxed">
                                    <strong>Observaciones:</strong> {m.observaciones_medicas}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Fecha de ingreso */}
                    {m.fecha_ingreso && (
                        <p className="text-xs text-slate-500">
                            Fecha de ingreso: {new Date(m.fecha_ingreso).toLocaleDateString("es-MX")}
                        </p>
                    )}

                    {/* Metadata */}
                    {m.metadata && Object.keys(m.metadata).length > 0 && (
                        <div className="border-t border-slate-200 pt-3">
                            <h3 className="font-semibold text-slate-900 mb-1">Metadata</h3>
                            <pre className="bg-slate-50 text-xs p-2 rounded-md text-slate-700 overflow-x-auto">
                                {JSON.stringify(m.metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
