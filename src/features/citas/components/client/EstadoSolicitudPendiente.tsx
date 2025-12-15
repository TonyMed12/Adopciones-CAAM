"use client";

import { CalendarCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

type MascotaMin = {
    nombre?: string;
};

type EstadoSolicitudPendienteProps = {
    mascota?: MascotaMin | null;
    onAgendar: () => void;
    onCancelar: () => void;
    diasRestantes?: number | null;
};

export default function EstadoSolicitudPendiente({
    mascota,
    onAgendar,
    onCancelar,
    diasRestantes,
}: EstadoSolicitudPendienteProps) {
    return (
        <div className="rounded-2xl border border-[#eadacb] bg-[#fffdf9] shadow-md p-8 space-y-6">
            {/* Encabezado */}
            <div className="text-center">
                <h3 className="text-xl font-extrabold text-[#8b4513]">
                    Agenda tu visita 🐾
                </h3>

                <p className="mt-2 text-sm text-[#7a5c49] max-w-md mx-auto leading-relaxed">
                    Estás a un paso de convivir con{" "}
                    <span className="font-semibold text-[#BC5F36]">
                        {mascota?.nombre}
                    </span>
                    . Elige un día y horario para tu visita al CAAM.
                </p>

                <p className="mt-3 text-xs text-[#a4836b] italic">
                    “La conexión empieza con un primer encuentro.”
                </p>
            </div>

            {/* BARRAS DECORATIVAS */}
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#BC5F36] to-[#d9a48f] lg:hidden" />
            <div className="hidden lg:block w-2 rounded-full bg-gradient-to-b from-[#BC5F36] to-[#d9a48f] opacity-80 shadow-sm" />

            {/* CONTENIDO PRINCIPAL */}
            <div
                className="
                    w-full 
                    max-w-[820px]
                    mx-auto
                    rounded-2xl 
                    border border-[#eadacb] 
                    bg-[#fffaf4] 
                    shadow-md 
                    p-4 sm:p-5
                    flex flex-col lg:flex-row
                    gap-5
                    scale-[0.92] sm:scale-[0.94] lg:scale-[0.88]
                    origin-top
                "
            >
                {/* Barra interna */}
                <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#BC5F36] to-[#d9a48f] lg:hidden" />
                <div className="hidden lg:block w-1.5 rounded-full bg-gradient-to-b from-[#BC5F36] to-[#d9a48f] opacity-80 shadow-sm" />

                {/* CARD INTERNO */}
                <div
                    className="
                        w-full 
                        max-w-[760px]
                        mx-auto
                        rounded-2xl 
                        border border-[#eadacb] 
                        bg-[#fffaf4] 
                        shadow-md 
                        p-4 sm:p-5
                        flex flex-col lg:flex-row
                        gap-4
                    "
                >
                    {/* INFO */}
                    <div className="flex-1 text-center lg:text-left space-y-2">
                        <h4 className="text-base sm:text-lg font-extrabold text-[#8b4513] flex items-center justify-center lg:justify-start gap-2">
                            <MapPin className="h-4 w-4 text-[#BC5F36]" />
                            Centro de Atención Animal de Morelia (CAAM)
                        </h4>

                        <p className="text-xs sm:text-sm text-[#7a5c49] leading-relaxed max-w-[360px] mx-auto lg:mx-0">
                            Elige una fecha y horario para tu visita.
                        </p>

                        <div className="space-y-1.5 text-xs sm:text-sm">
                            <p className="font-semibold">
                                📍 Álamos No. 395, Col. Centenario, Morelia
                            </p>
                            <p className="font-semibold">
                                📞 443 321 4731 / 443 321 1392
                            </p>
                            <p>
                                🕒 <strong>Horario:</strong> 8:30 AM – 2:00 PM
                            </p>
                            <p>
                                📅 <strong>Días:</strong> Lunes a Viernes
                            </p>
                        </div>
                    </div>

                    {/* MAPA */}
                    <div
                        className="
                            w-full 
                            lg:w-56
                            rounded-xl 
                            bg-[#fffaf4]
                            border border-[#eadacb]
                            shadow-md 
                            overflow-hidden
                            flex flex-col
                        "
                    >
                        <div className="w-full h-32 sm:h-36 relative">
                            <iframe
                                title="CAAM Mapa"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.2406524803994!2d-101.1734343!3d19.7266529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86a28e98ea321735%3A0x191bd93c0bd16085!2sCentro%20de%20Atenci%C3%B3n%20Animal!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />

                            {/* Overlay clicable */}
                            <a
                                href="https://www.google.com/maps/place/Centro+de+Atenci%C3%B3n+Animal/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 cursor-pointer bg-transparent"
                                title="Abrir en Google Maps"
                            />
                        </div>

                        <div className="p-3 text-center">
                            <h5 className="text-xs font-bold text-[#8b4513]">
                                Ubicación del CAAM
                            </h5>
                            <p className="text-[11px] text-[#7a5c49] mt-1 leading-relaxed">
                                Haz clic en el mapa para abrir la ubicación en Google Maps.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                    onClick={onAgendar}
                    className="
                        w-full sm:w-auto
                        bg-[#BC5F36]
                        hover:bg-[#a64d2e]
                        text-white font-semibold
                        px-8 py-4 
                        rounded-xl
                        shadow-md
                        transition-all
                        cursor-pointer
                        hover:-translate-y-[2px]
                        active:scale-95
                        flex items-center gap-2
                    "
                >
                    <CalendarCheck className="h-5 w-5" />
                    Agendar cita
                </Button>

                <Button
                    onClick={onCancelar}
                    className="
                        w-full sm:w-auto
                        bg-[#fff5f3]
                        border border-[#e8c9b8]
                        text-[#BC5F36]
                        hover:bg-[#ffe7e2]
                        px-8 py-4 
                        rounded-xl
                        font-semibold
                        transition-all
                        cursor-pointer
                        hover:-translate-y-[2px]
                        active:scale-95
                    "
                >
                    Cancelar solicitud
                </Button>
            </div>

            {/* Expiración */}
            {diasRestantes !== null && diasRestantes !== undefined && (
                <p className="text-center text-xs font-semibold text-[#BC5F36]">
                    ⏳ Tu solicitud expira en{" "}
                    {diasRestantes > 0
                        ? `${diasRestantes} días`
                        : "0 días (expirada)"}
                </p>
            )}
        </div>
    );
}
