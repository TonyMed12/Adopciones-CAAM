"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import { Loader2 } from "lucide-react";

export function PendientesList({
    pendientes,
    loading,
    onNavigate,
}: {
    pendientes: { id: number; descripcion: string; link: string }[];
    loading: boolean;
    onNavigate: (link: string) => void;
}) {
    return (
        <>
            {loading ? (
                <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin h-4 w-4" /> Cargando tareas...
                </div>
            ) : pendientes.length > 0 ? (
                <ul className="space-y-3">
                    {pendientes.map((p) => (
                        <li
                            key={p.id}
                            className="flex items-center justify-between border-b pb-2 text-sm text-slate-700"
                        >
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-[#BC5F36]" />
                                <span>{p.descripcion}</span>
                            </div>

                            <button
                                onClick={() => onNavigate(p.link)}
                                className="text-[#BC5F36] font-medium hover:underline"
                            >
                                Revisar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500">No hay tareas pendientes por ahora 🐶</p>
            )}
        </>
    );
}
