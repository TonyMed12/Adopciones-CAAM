"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    PawPrint,
} from "lucide-react";
import MascotaSeleccionadaCard from "./MascotaSeleccionadaCard";
import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type {
    SolicitudActiva,
    CitaAdopcion,
} from "@/features/adopciones/types/proceso-adopcion";

interface SolicitudPendienteSectionProps {
    solicitudActiva: SolicitudActiva;
    citaActiva: CitaAdopcion | null;
    estado: EstadoDocumentos;
    onCancelar: () => void;
}

export default function SolicitudPendienteSection({
    solicitudActiva,
    citaActiva,
    estado,
    onCancelar,
}: SolicitudPendienteSectionProps) {
    const router = useRouter();
    const [mostrarAgendar, setMostrarAgendar] = useState(false);

    return (
        <div className="rounded-xl border border-[#ffedd5] bg-[#fffaf4] p-5 mb-4 mt-5">
            <h3 className="text-sm font-extrabold text-[#BC5F36] flex items-center gap-2">
                <PawPrint className="h-4 w-4" /> Solicitud pendiente
            </h3>

            <p className="mt-2 text-sm text-[#7a5c49]">
                Ya tienes una solicitud activa. Ahora puedes continuar con el
                proceso y agendar tu cita para conocer a{" "}
                <strong>tu mascota seleccionada</strong>.
            </p>

            {solicitudActiva?.mascota_id && (
                <div
                    className="
            mt-10 
            grid grid-cols-1 
            lg:grid-cols-[500px_1fr] 
            gap-6 
            lg:gap-10
            items-start
          "
                >
                    {/* Botón principal (desktop) */}
                    <div className="hidden lg:block lg:col-span-2 mb-0">
                        <button
                            onClick={() => router.push("/dashboards/usuario/citas")}
                            className="
                w-full 
                bg-[#BC5F36] text-white 
                py-3.5 
                rounded-xl 
                text-base font-semibold 
                shadow-md shadow-[#bc5f36]/30
                hover:bg-[#a64f2b]
                hover:shadow-lg hover:shadow-[#bc5f36]/40
                hover:-translate-y-[2px]
                active:scale-95
                transition-all duration-200
              "
                        >
                            <span className="text-lg mr-2">📅</span>
                            Agendar visita
                        </button>
                    </div>

                    {/* Columna izquierda */}
                    <div className="flex flex-col gap-4">
                        <div
                            className="
                rounded-xl 
                bg-white/80 
                backdrop-blur-md 
                border border-[#eadacb] 
                p-5 
                shadow-lg shadow-[#c7b39b]/30
                w-full
              "
                        >
                            <MascotaSeleccionadaCard
                                mascota={solicitudActiva.mascota}
                                onCancelar={onCancelar}
                            />
                        </div>

                        {/* Botón móvil */}
                        <div className="lg:hidden mt-4">
                            <button
                                onClick={() => setMostrarAgendar(!mostrarAgendar)}
                                className="
                  w-full 
                  bg-[#BC5F36] text-white 
                  py-3 rounded-xl 
                  shadow-md 
                  font-semibold 
                  text-sm
                  hover:bg-[#a64f2b]
                  hover:-translate-y-[2px]
                  active:scale-95
                  transition-all duration-200
                "
                            >
                                {mostrarAgendar
                                    ? "Ocultar detalles"
                                    : "Ver información de la visita"}
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="relative space-y-6">
                        <div className="hidden lg:block absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-[#e5d8c9] to-transparent" />

                        <div className="pl-0 lg:pl-8 space-y-6">
                            {(mostrarAgendar ||
                                typeof window === "undefined" ||
                                window.innerWidth >= 1024) && (
                                    <div className="space-y-6">
                                        {/* Qué sigue */}
                                        <div className="rounded-xl bg-white/80 backdrop-blur-md border border-[#eadacb] p-5 shadow-lg shadow-[#c7b39b]/30">
                                            <h3 className="text-sm font-extrabold text-[#2b1b12] mb-2 flex items-center gap-2">
                                                <span className="text-[#BC5F36] text-lg">📅</span>
                                                ¿Qué sigue ahora?
                                            </h3>

                                            <ul className="text-xs text-[#7a5c49] space-y-2 leading-relaxed">
                                                <li>• Agenda tu visita para convivir con tu mascota.</li>
                                                <li>• El CAAM evaluará cómo interactúan.</li>
                                                <li>• Si es aprobada, llenarás el formulario final.</li>
                                                <li>• Luego un administrador revisará tu información.</li>
                                            </ul>
                                        </div>

                                        {/* Estado del proceso */}
                                        <div className="rounded-xl bg-white/80 backdrop-blur-md border border-[#eadacb] p-5 shadow-lg shadow-[#c7b39b]/30">
                                            <h4 className="text-sm font-extrabold text-[#2b1b12] mb-3 flex items-center gap-2">
                                                <span className="text-[#3B82F6] text-lg">📘</span>
                                                Estado de tu proceso
                                            </h4>

                                            <div className="grid gap-2 text-xs text-[#7a5c49]">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600">✓</span> Mascota seleccionada
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#BC5F36]">→</span> Pendiente agendar visita
                                                </div>
                                                <div className="flex items-center gap-2 opacity-70">
                                                    <span>⏳</span> Formulario (después de la visita)
                                                </div>
                                                <div className="flex items-center gap-2 opacity-70">
                                                    <span>⏳</span> Aprobación final
                                                </div>
                                            </div>
                                        </div>

                                        {/* Consejos */}
                                        <div
                                            className="
                      relative overflow-visible rounded-2xl border border-[#ebd8c7] p-6 
                      shadow-xl 
                      bg-gradient-to-br from-[#fff4e6] via-[#ffe8cf] to-[#ffd8b0]
                    "
                                        >
                                            <h4 className="text-sm font-extrabold text-[#2b1b12] mb-4 flex items-center gap-2">
                                                <span className="text-[#F59E0B] text-xl">💡</span>
                                                Consejos para tu visita
                                            </h4>

                                            <ul className="text-xs text-[#7a5c49] space-y-3 leading-relaxed">
                                                <li>• Llega 10–15 minutos antes.</li>
                                                <li>• Puedes traer fotos del hogar.</li>
                                                <li>• Mantén vacunas al día si tienes mascotas.</li>
                                                <li>• Sé tú mismo, la convivencia es lo más importante.</li>
                                            </ul>
                                        </div>

                                        {/* Botón móvil final */}
                                        {estado === "aprobado" && !citaActiva && (
                                            <button
                                                onClick={() => router.push("/dashboards/usuario/citas")}
                                                className="
                        lg:hidden 
                        w-full 
                        bg-[#BC5F36] text-white 
                        py-3 rounded-xl 
                        text-sm font-semibold
                        shadow-md shadow-[#bc5f36]/40 
                        hover:bg-[#a64f2b]
                        active:scale-95
                        transition-all duration-200
                      "
                                            >
                                                📅 Agendar visita
                                            </button>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
