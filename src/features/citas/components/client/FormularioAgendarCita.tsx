"use client";

import { CalendarCheck, PawPrint, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { isWeekend } from "date-fns";

import type { SolicitudActiva } from "@/features/citas/types/solicitud-activa";

type FormularioAgendarCitaProps = {
    solicitudActiva: SolicitudActiva;
    fecha: string;
    fechaDate: Date | undefined;
    horaSeleccionada: string;
    horasOcupadas: string[];

    setFecha: (v: string) => void;
    setFechaDate: (v: Date | undefined) => void;
    setHoraSeleccionada: (v: string) => void;

    confirmarCita: () => void;
    setPaso: (v: "inicio") => void;

    horaEsPasada: (hora: string, fecha?: Date) => boolean;
    confirmarCitaMutation: { isPending: boolean };

    showSoftToast: (msg: string) => void;
};

export default function FormularioAgendarCita({
    solicitudActiva,
    fecha,
    fechaDate,
    horaSeleccionada,
    horasOcupadas,
    setFecha,
    setFechaDate,
    setHoraSeleccionada,
    confirmarCita,
    setPaso,
    horaEsPasada,
    confirmarCitaMutation,
    showSoftToast,
}: FormularioAgendarCitaProps) {
    const mascota = solicitudActiva.mascota;

    return (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-5 sm:p-8 shadow-sm text-[#2b1b12]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-[#8b4513]">
                    <PawPrint className="h-5 w-5 text-[#BC5F36]" />
                    Cita para {mascota?.nombre}
                </h3>

                <Button
                    variant="ghost"
                    onClick={() => setPaso("inicio")}
                    className="text-[#BC5F36] hover:bg-[#fff3ee] cursor-pointer"
                >
                    ← Regresar
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Mascota */}
                <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-5 flex flex-col items-center text-center shadow-sm">
                    <img
                        src={mascota?.imagen_url || "/placeholder.jpg"}
                        alt={mascota?.nombre ?? "Mascota"}
                        className="w-40 h-40 rounded-lg object-cover border border-[#eadacb] mb-4 shadow-md"
                    />
                    <h4 className="text-lg font-bold text-[#8b4513]">
                        {mascota?.nombre}
                    </h4>
                    <p className="text-sm text-[#7a5c49] mt-1">
                        <MapPin className="inline h-4 w-4 text-[#BC5F36]" /> CAAM Morelia
                    </p>
                </div>

                {/* Selección */}
                <div className="space-y-6">
                    {/* Fecha */}
                    <div>
                        <label className="block text-sm font-extrabold mb-3">
                            Selecciona la fecha
                        </label>

                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={fechaDate}
                                onSelect={(day: Date | undefined) => {
                                    const hoy = new Date();
                                    hoy.setHours(0, 0, 0, 0);

                                    const limite = new Date();
                                    limite.setMonth(limite.getMonth() + 1);
                                    limite.setHours(0, 0, 0, 0);

                                    // Sin fecha → limpiar todo
                                    if (!day) {
                                        setFechaDate(undefined);
                                        setFecha("");
                                        setHoraSeleccionada("");
                                        return;
                                    }

                                    // Más de 1 mes
                                    if (day > limite) {
                                        showSoftToast(
                                            "Solo puedes agendar dentro del próximo mes 📅"
                                        );
                                        setFechaDate(undefined);
                                        setFecha("");
                                        setHoraSeleccionada("");
                                        return;
                                    }

                                    // Nueva fecha válida → limpiar hora previa
                                    setHoraSeleccionada("");
                                    setFechaDate(day);

                                    const year = day.getFullYear();
                                    const month = String(day.getMonth() + 1).padStart(2, "0");
                                    const d = String(day.getDate()).padStart(2, "0");
                                    setFecha(`${year}-${month}-${d}`);
                                }}
                                disabled={(date) => {
                                    const hoy = new Date();
                                    hoy.setHours(0, 0, 0, 0);

                                    const dia = new Date(date);
                                    dia.setHours(0, 0, 0, 0);

                                    return isWeekend(dia) || dia < hoy;
                                }}
                            />
                        </div>
                    </div>

                    {/* Horas */}
                    <div>
                        <label className="block text-sm font-extrabold mb-2">
                            Hora disponible
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
                                "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
                            ].map((hora) => {
                                const deshabilitada =
                                    !fecha ||
                                    horaEsPasada(hora, fechaDate) ||
                                    horasOcupadas.includes(hora);

                                return (
                                    <button
                                        key={hora}
                                        disabled={deshabilitada}
                                        onClick={() => {
                                            if (!fecha) {
                                                showSoftToast("Selecciona una fecha primero 📅");
                                                return;
                                            }
                                            setHoraSeleccionada(hora);
                                        }}
                                        className={`rounded-lg border px-3 py-2 text-sm font-semibold cursor-pointer
                      ${deshabilitada
                                                ? "opacity-40 cursor-not-allowed"
                                                : horaSeleccionada === hora
                                                    ? "bg-[#BC5F36] text-white"
                                                    : "bg-[#fffaf4] hover:bg-[#ffe8df]"
                                            }`}
                                    >
                                        {hora}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Confirmar */}
                    <Button
                        disabled={
                            !fecha ||
                            !horaSeleccionada ||
                            confirmarCitaMutation.isPending
                        }
                        onClick={confirmarCita}
                        className="w-full bg-[#BC5F36] text-white cursor-pointer"
                    >
                        <CalendarCheck className="h-5 w-5 mr-2" />
                        Confirmar cita
                    </Button>
                </div>
            </div>
        </section>
    );
}
