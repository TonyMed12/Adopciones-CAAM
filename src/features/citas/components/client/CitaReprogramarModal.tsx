"use client";

import { useMemo } from "react";
import DatePicker from "react-datepicker";
import { Calendar, X } from "lucide-react";
import type { Cita } from "../../types/cita";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;

    isSaving: boolean;

    fecha: string;
    hora: string;

    onFechaChange: (v: string) => void;
    onHoraChange: (v: string) => void;

    cita: Cita | null;
    citas: Cita[];
};

export default function CitaReprogramarModal({
    open,
    onClose,
    onSubmit,
    isSaving,
    fecha,
    hora,
    onFechaChange,
    onHoraChange,
    cita,
    citas,
}: Props) {

    if (!open || !cita) return null;

    // ============================
    // FECHAS PARA VALIDACIÓN
    // ============================
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const maxFecha = useMemo(() => {
        const f = new Date();
        f.setMonth(f.getMonth() + 1);
        f.setHours(0, 0, 0, 0);
        return f;
    }, []);

    // ============================
    // FECHA SELECCIONADA
    // ============================
    const dateValue = useMemo(() => {
        if (!fecha) return null;
        const [y, m, d] = fecha.split("-");
        return new Date(Number(y), Number(m) - 1, Number(d));
    }, [fecha]);

    // ============================
    // HORAS
    // ============================
    const horasDisponibles = [
        "08:30", "09:00", "09:30",
        "10:00", "10:30", "11:00",
        "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00",
    ];

    const ahora = new Date();
    const hoyStr = new Date().toISOString().slice(0, 10);

    const horasConEstado = horasDisponibles.map((h) => {
        // ¿Ocupado por otra cita?
        const ocupado = citas.some(
            (c) =>
                c.fecha_cita === fecha &&
                c.hora_cita.slice(0, 5) === h &&
                c.id !== cita.id
        );

        // ¿Hora pasada si es hoy?
        let pasada = false;
        if (fecha === hoyStr) {
            const [hh, mm] = h.split(":").map(Number);
            const hDate = new Date();
            hDate.setHours(hh, mm, 0, 0);
            if (hDate <= ahora) pasada = true;
        }

        return { hora: h, ocupado, pasada };
    });

    // ============================
    // CAMBIO DE FECHA
    // ============================
    const handleFecha = (date: Date | null) => {
        if (!date) return onFechaChange("");

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        onFechaChange(`${y}-${m}-${d}`);
        onHoraChange("");
    };

    // ============================
    // RENDER
    // ============================
    return (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn cursor-default">

            {/* CONTENEDOR */}
            <div className="w-full max-w-lg rounded-2xl bg-white border border-[#EADACB] shadow-2xl overflow-hidden animate-slideUp">

                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#EADACB] bg-[#FFF8F2]">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#BC5F36]" />
                        <h3 className="text-lg font-extrabold text-[#2B1B12]">Reprogramar cita</h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
                    >
                        <X className="w-5 h-5 text-[#6b4f40]" />
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="px-6 py-5 space-y-6">

                    {/* INFO DEL USUARIO */}
                    <div className="bg-[#FFF4E7] border border-[#EADACB] rounded-xl px-4 py-3">
                        <p className="text-sm">
                            <span className="font-semibold text-[#2B1B12]">
                                {cita.usuario?.nombres} {cita.usuario?.apellido_paterno} {cita.usuario?.apellido_materno}
                            </span>{" "}
                            tiene cita con{" "}
                            <span className="italic text-[#2B1B12]">
                                {cita.mascota?.nombre}
                            </span>.
                        </p>
                        <p className="text-xs text-[#6b4f40] mt-1">Selecciona nueva fecha y hora.</p>
                    </div>

                    {/* FECHA */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B1B12]">
                            Nueva fecha
                        </label>

                        <div className="relative cursor-pointer">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />

                            <DatePicker
                                selected={dateValue}
                                onChange={handleFecha}
                                minDate={hoy}
                                maxDate={maxFecha}
                                filterDate={(d) => {
                                    const esFinDeSemana = d.getDay() === 0 || d.getDay() === 6;

                                    const dClean = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                    const hoyClean = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                                    const maxClean = new Date(maxFecha.getFullYear(), maxFecha.getMonth(), maxFecha.getDate());

                                    const dentroDeRango = dClean >= hoyClean && dClean <= maxClean;

                                    return dentroDeRango && !esFinDeSemana;
                                }}

                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecciona la fecha"
                                className="w-full pl-11 pr-10 py-2 border rounded-md cursor-pointer hover:border-[#BC5F36] focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 focus:outline-none border-[#EADACB]"
                                wrapperClassName="w-full cursor-pointer"
                                calendarClassName="react-datepicker-full"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                portalId="datepicker-root"
                                popperPlacement="bottom-start"
                                popperClassName="z-[2000]"
                            />

                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BC5F36] opacity-60 h-5 w-5 pointer-events-none" />
                        </div>
                    </div>

                    {/* HORAS */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#2B1B12]">
                            Nueva hora
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                            {horasConEstado.map(({ hora: h, ocupado, pasada }) => {
                                const disabled = ocupado || pasada;

                                return (
                                    <button
                                        key={h}
                                        disabled={disabled}
                                        onClick={() => onHoraChange(h)}
                                        className={`
                                            py-2 rounded-lg border text-sm transition font-medium
                                            ${disabled
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                : hora === h
                                                    ? "bg-[#BC5F36] text-white border-[#BC5F36] cursor-pointer"
                                                    : "bg-white text-[#2B1B12] border-[#EADACB] hover:bg-[#FFF4E7] cursor-pointer"
                                            }
                                        `}
                                    >
                                        {h}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t border-[#EADACB] bg-[#FFFDF9] flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border text-sm text-[#2B1B12] hover:bg-gray-100 transition cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={isSaving}
                        onClick={onSubmit}
                        className="px-4 py-2 rounded-lg bg-[#BC5F36] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#a44f2e] transition cursor-pointer"
                    >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>

            </div>
        </div>
    );
}
