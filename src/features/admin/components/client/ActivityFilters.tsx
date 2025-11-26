"use client";

import React from "react";

export function ActividadFilters({
    filtro,
    setFiltro,
}: {
    filtro: "todo" | "documento" | "cita" | "mascota";
    setFiltro: (f: "todo" | "documento" | "cita" | "mascota") => void;
}) {
    return (
        <div className="flex gap-2 sm:gap-3 min-w-max px-1 pb-1 border-b border-[#eadacb]">
            {["todo", "documento", "cita", "mascota"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFiltro(f as "todo" | "documento" | "cita" | "mascota")}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-t-md text-sm font-semibold transition-all duration-200 border-b-2 ${filtro === f
                            ? "border-[#BC5F36] text-[#BC5F36] bg-[#fff8f4]"
                            : "border-transparent text-[#7a5c49] hover:text-[#BC5F36]"
                        }`}
                >
                    {f === "todo"
                        ? "Todo"
                        : f === "documento"
                            ? "Documentos"
                            : f === "cita"
                                ? "Citas"
                                : "Mascotas"}
                </button>
            ))}
        </div>
    );
}
