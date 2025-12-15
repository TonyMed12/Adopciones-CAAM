"use client";

import { CalendarCheck, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

import type { CitaProgramada } from "@/features/citas/types/cita-programada";

type ConfirmacionCitaProps = {
    cita: CitaProgramada;
    onFinalizar: () => void;
};

export default function ConfirmacionCita({
    cita,
    onFinalizar,
}: ConfirmacionCitaProps) {
    return (
        <section className="rounded-2xl border border-[#f0e0d6] bg-[#fffdfb] p-10 shadow-md text-[#2b1b12]">
            {/* Encabezado */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-full bg-[#BC5F36] text-white flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                    <h3 className="text-2xl font-extrabold text-[#2b1b12]">
                        ¡Cita confirmada!
                    </h3>
                    <p className="mt-1 text-base text-[#5a4b3f]">
                        Tu visita ha sido agendada exitosamente 🐾. Te esperamos en el{" "}
                        <span className="font-semibold text-[#BC5F36]">CAAM</span>; por favor
                        llega <strong>10 minutos antes</strong>.
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Mascota */}
                <div className="rounded-2xl border border-[#f0d9c9] bg-[#fff8f4] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                    <img
                        src={cita.mascota?.imagen_url || "/placeholder.jpg"}
                        alt={cita.mascota?.nombre || "Mascota"}
                        className="h-56 w-56 rounded-xl object-cover border border-[#e8c9b8] mb-4 shadow-md hover:scale-[1.02] transition-transform"
                    />
                    <h4 className="text-xl font-bold text-[#8b4513] mb-1">
                        {cita.mascota?.nombre}
                    </h4>
                    <p className="text-sm text-[#7a5c49] mb-3">
                        Estado actual:{" "}
                        <span className="font-semibold text-[#BC5F36]">
                            {cita.mascota?.estado === "en_proceso"
                                ? "Esperando por ti 🧡"
                                : cita.mascota?.estado}
                        </span>
                    </p>

                    <div className="mt-3 text-sm">
                        <p className="flex items-center justify-center gap-1 text-[#5b4032]">
                            <MapPin className="h-4 w-4 text-[#BC5F36]" />
                            <strong>CAAM - Centro de Atención Animal de Morelia</strong>
                        </p>
                        <p className="text-xs text-[#a4836b] mt-1">
                            Av. Acueducto 1234, Morelia, Michoacán
                        </p>
                    </div>
                </div>

                {/* Fecha y hora */}
                <div className="rounded-2xl border border-[#f0d9c9] bg-[#fff8f4] p-8 flex flex-col justify-center items-start shadow-sm hover:shadow-md transition-all duration-300">
                    <h4 className="text-lg font-extrabold text-[#8b4513] mb-4 flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                        Detalles de tu cita
                    </h4>

                    <div className="text-base space-y-3 text-[#4b392f]">
                        <p className="flex items-center gap-2">
                            📅 <strong>Fecha:</strong>{" "}
                            <span className="text-[#BC5F36] font-semibold">
                                {new Date(cita.fecha_cita + "T00:00:00").toLocaleDateString(
                                    "es-MX",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                        </p>

                        <p className="flex items-center gap-2">
                            🕒 <strong>Hora:</strong>{" "}
                            <span className="text-[#BC5F36] font-semibold">
                                {cita.hora_cita.slice(0, 5)}
                            </span>
                        </p>
                    </div>

                    <div className="mt-6 border-t border-[#eadacb] pt-4 text-sm text-[#7a5c49] leading-relaxed">
                        <p>
                            Si necesitas reprogramar tu cita, comunícate con el equipo del{" "}
                            <span className="text-[#BC5F36] font-medium">CAAM</span> o
                            cancélala desde tu panel de usuario.
                        </p>
                    </div>
                </div>
            </div>

            {/* Finalizar */}
            <div className="mt-10 flex justify-center">
                <Button
                    onClick={onFinalizar}
                    className="
            bg-[#BC5F36]
            hover:bg-[#a64d2e]
            text-white
            text-base
            px-12
            py-4
            rounded-xl
            shadow-md
            transition-all
            duration-200
            cursor-pointer
            hover:shadow-lg
            select-none
          "
                >
                    Finalizar
                </Button>
            </div>
        </section>
    );
}
