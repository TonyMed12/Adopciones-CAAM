"use client";

import React from "react";
import { FileCheck2, FileUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SeccionCargaProps {
    archivos: Record<string, File | undefined>;
    docs?: {
        tipo: string;
        estado: string;
        motivo_rechazo?: string;
        url?: string;
    }[];
    onPick: (id: string, file?: File) => void;
    onEnviar: () => void;
    deshabilitarEnviar: boolean;
}

export default function SeccionCarga({ archivos, docs = [], onPick, onEnviar, deshabilitarEnviar }: SeccionCargaProps) {
    const documentos = [
        { id: "identificacion", label: "Identificación oficial (INE)" },
        { id: "comprobante", label: "Comprobante de domicilio" },
        { id: "curp", label: "CURP" },
    ];

    function getDocInfo(tipo: string) {
        return docs.find((d) => d.tipo === tipo);
    }

    return (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#2b1b12]">Sube tus documentos</h3>
            <p className="mt-1 text-sm text-[#7a5c49]">
                Adjunta los archivos requeridos. Si algún documento fue rechazado, podrás volver a subir sólo ese.
            </p>

            <div className="mt-5 grid gap-3">
                {documentos.map((doc) => {
                    const info = getDocInfo(doc.id);
                    const estado = info?.estado;
                    const motivo = info?.motivo_rechazo;
                    const puedeSubir = !estado || estado === "rechazado" || estado === "sin_documentos";

                    return (
                        <div
                            key={doc.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-3"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-extrabold text-[#2b1b12]">{doc.label}</p>
                                {estado === "aprobado" && (
                                    <p className="text-xs text-green-700 mt-1">Documento Aprobado</p>
                                )}
                                {estado === "pendiente" && (
                                    <p className="text-xs text-amber-700 mt-1">Documento En revisión</p>
                                )}
                                {estado === "rechazado" && (
                                    <p className="text-xs text-red-700 mt-1">
                                        Documento Rechazado — {motivo || "Verifica el motivo y súbelo nuevamente."}
                                    </p>
                                )}
                                {archivos[doc.id] && (
                                    <p className="text-xs text-[#6b4f40] mt-1 truncate max-w-[240px]">
                                        Nuevo archivo: {archivos[doc.id]?.name}
                                    </p>
                                )}
                                {info?.url?.startsWith("http") ? (
                                    <a
                                        href={info.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#BC5F36] underline mt-1 hover:text-[#8c3f1e]"
                                    >
                                        Ver archivo actual
                                    </a>
                                ) : (
                                    <p className="text-xs text-[#b09a8c] mt-1 italic">Sin enlace válido</p>
                                )}
                            </div>

                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                id={`file-${doc.id}`}
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onPick(doc.id, file);
                                }}
                                disabled={!puedeSubir}
                            />
                            <Button
                                variant="ghost"
                                className="cursor-pointer"
                                onClick={() => puedeSubir && document.getElementById(`file-${doc.id}`)?.click()}
                                disabled={!puedeSubir}
                            >
                                <FileUp className="h-4 w-4 mr-1" />
                                {puedeSubir
                                    ? "Seleccionar archivo"
                                    : "Éste documento fue aprobado, no es posible cambiarlo"}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex justify-end">
                <Button disabled={deshabilitarEnviar} onClick={onEnviar} className="cursor-pointer">
                    <FileCheck2 className="h-5 w-5 mr-1 cursor-pointer" />{" "}
                    {docs.some((d) => d.estado === "rechazado") ? "Reenviar rechazados" : "Enviar para revisión"}
                </Button>
            </div>
        </section>
    );
}
