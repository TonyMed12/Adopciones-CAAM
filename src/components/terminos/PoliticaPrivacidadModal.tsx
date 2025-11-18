"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { Playfair_Display, Poppins } from "next/font/google";
import { Shield, FileText, Lock, UserCheck } from "lucide-react";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
});

export default function PoliticaPrivacidadModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <ModalPremium open={open} onClose={onClose}>
            {/* HEADER PREMIUM */}
            <div className="rounded-2xl p-6 shadow-md border border-[#E3D3C3] bg-gradient-to-br from-[#F7EFE7] to-[#EFE3D7] mb-6">
                <h2
                    className={`${playfair.className} text-3xl md:text-4xl font-bold text-[#4A2F1B]`}
                >
                    Política de Privacidad
                </h2>
                <p
                    className={`${poppins.className} text-sm text-[#7A5C49] mt-2 leading-relaxed`}
                >
                    Cómo protegemos y utilizamos tu información personal.
                </p>
            </div>

            {/* CONTENIDO */}
            <div className="space-y-5">

                {/* Sección 1 */}
                <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                        <FileText className="h-5 w-5 text-[#8B5E34]" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                        >
                            1. Información que recopilamos
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                        Recopilamos datos como nombre, correo electrónico, dirección, documentos
                        oficiales y cualquier información necesaria para evaluar solicitudes de adopción.
                    </p>
                </div>

                {/* Sección 2 */}
                <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                        <Shield className="h-5 w-5 text-[#8B5E34]" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                        >
                            2. Uso de los datos
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                        Utilizamos tu información únicamente para gestionar solicitudes, verificar
                        identidad, programar citas y realizar seguimientos posteriores a la adopción.
                    </p>
                </div>

                {/* Sección 3 */}
                <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                        <Lock className="h-5 w-5 text-[#8B5E34]" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                        >
                            3. Protección de datos
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                        Implementamos medidas de seguridad para evitar accesos no autorizados. No
                        compartimos ni vendemos tus datos sin tu consentimiento expreso.
                    </p>
                </div>

                {/* Sección 4 */}
                <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                        <UserCheck className="h-5 w-5 text-[#8B5E34]" />
                        <h3
                            className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                        >
                            4. Derechos del usuario
                        </h3>
                    </div>
                    <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                        Puedes solicitar la corrección, actualización o eliminación de tus datos en cualquier
                        momento escribiendo a nuestro equipo de soporte.
                    </p>
                </div>

                <div className="pl-1 pr-1">
                    <p
                        className={`${poppins.className} text-[15px] text-[#4A392E] font-medium`}
                    >
                        Al continuar, confirmas que has leído esta Política de Privacidad.
                    </p>
                </div>
            </div>

            {/* BOTÓN FINAL */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-[#8B5E34] hover:bg-[#734C29] transition text-white font-medium shadow-md"
                >
                    Cerrar
                </button>
            </div>
        </ModalPremium>
    );
}
