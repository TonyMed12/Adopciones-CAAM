"use client";

import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CitaProgramada } from "@/features/citas/types/cita-programada";

type CitaProgramadaCardProps = {
    cita: CitaProgramada;
    onCancelar: (citaId: string) => void;
    onAbrirModal: () => void;
};

export default function CitaProgramadaCard({
    cita,
    onCancelar,
    onAbrirModal,
}: CitaProgramadaCardProps) {
    return (
        <div className="rounded-2xl border border-[#eadacb] bg-[#fffaf4] p-8 shadow-md text-[#2b1b12]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Imagen */}
                <img
                    src={cita.mascota?.imagen_url || "/placeholder.jpg"}
                    alt={cita.mascota?.nombre || "Mascota"}
                    className="h-48 w-48 rounded-xl object-cover border border-[#e8c9b8] shadow-sm"
                />

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-extrabold text-[#8b4513] flex items-center justify-center md:justify-start gap-2">
                        <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                        ¡Tienes una cita programada!
                    </h3>

                    <p className="mt-2 text-sm text-[#7a5c49]">
                        Te esperamos en el{" "}
                        <strong className="text-[#BC5F36]">CAAM</strong> para conocer a{" "}
                        <span className="font-semibold">
                            {cita.mascota?.nombre}
                        </span>
                        .
                    </p>

                    {/* Fecha y hora */}
                    <div className="mt-5 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <div className="rounded-xl bg-[#fffdfb] border border-[#f0d9c9] px-5 py-3 shadow-sm">
                            <p className="text-sm text-[#5a4b3f]">
                                <strong>📅 Fecha:</strong>{" "}
                                <span className="font-semibold text-[#BC5F36]">
                                    {(() => {
                                        const [y, m, d] = cita.fecha_cita
                                            .split("-")
                                            .map(Number);
                                        const fechaOK = new Date(y, m - 1, d);

                                        return fechaOK.toLocaleDateString("es-MX", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });
                                    })()}
                                </span>
                            </p>

                            <p className="text-sm text-[#5a4b3f] mt-1">
                                <strong>🕒 Hora:</strong>{" "}
                                <span className="font-semibold text-[#BC5F36]">
                                    {cita.hora_cita.slice(0, 5)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Cancelar */}
                    <div className="mt-6">
                        <Button
                            className="bg-[#fff5f3] border border-[#e8c9b8] text-[#BC5F36] hover:bg-[#ffe7e2] transition-all duration-200 cursor-pointer rounded-lg"
                            onClick={() => {
                                onCancelar(cita.id);
                                onAbrirModal();
                            }}
                        >
                            Cancelar cita
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
