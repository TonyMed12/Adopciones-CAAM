"use client";

import React from "react";
import { FileText, CalendarDays, PawPrint } from "lucide-react";

function formatTimeAgo(fechaStr: string) {
    const fecha = new Date(fechaStr);
    const diffMs = Date.now() - fecha.getTime();
    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 1) return "justo ahora";
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    return `hace ${dias} día${dias > 1 ? "s" : ""}`;
}

export function ActivityItem({
    tipo,
    mensaje,
    fecha,
}: {
    tipo: string;
    mensaje: string;
    fecha: string;
}) {
    const iconos: Record<string, React.ReactNode> = {
        documento: <FileText className="h-4 w-4 text-[#BC5F36]" />,
        cita: <CalendarDays className="h-4 w-4 text-[#BC5F36]" />,
        mascota: <PawPrint className="h-4 w-4 text-[#BC5F36]" />,
    };

    return (
        <li className="flex items-start gap-3 border-b pb-2">
            <span className="mt-1">{iconos[tipo]}</span>
            <div>
                <p className="text-sm text-slate-700">{mensaje}</p>
                <p className="text-xs text-slate-400">{formatTimeAgo(fecha)}</p>
            </div>
        </li>
    );
}
