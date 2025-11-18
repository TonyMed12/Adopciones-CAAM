import ModalPremium from "@/components/ui/ModalPremium";
import { Playfair_Display, Poppins } from "next/font/google";
import { BookOpen, PawPrint, HeartHandshake, Search, Ban } from "lucide-react";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
});

interface TerminosModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TerminosModal({ open, onClose }: TerminosModalProps) {
    return (
        <ModalPremium open={open} onClose={onClose}>
            <div className="modal-container relative">

                {/* HEADER PREMIUM SIN X */}
                <div className="rounded-2xl p-6 shadow-md border border-[#E3D3C3] bg-gradient-to-br from-[#F7EFE7] to-[#EFE3D7] mb-6">
                    <h2
                        className={`${playfair.className} text-3xl md:text-4xl font-bold text-[#4A2F1B]`}
                    >
                        Términos y Condiciones
                    </h2>
                    <p
                        className={`${poppins.className} text-sm text-[#7A5C49] mt-2 leading-relaxed`}
                    >
                        Información importante antes de continuar.
                    </p>
                </div>

                <div className="space-y-5">
                    {/* SECCIÓN 1 */}
                    <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <BookOpen className="h-5 w-5 text-[#8B5E34]" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                            >
                                1. Uso de la plataforma
                            </h3>
                        </div>
                        <p
                            className={`${poppins.className} text-[#4A392E] leading-relaxed`}
                        >
                            Te comprometes a proporcionar información verdadera, completa y
                            actualizada.
                        </p>
                    </div>

                    {/* SECCIÓN 2 */}
                    <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <PawPrint className="h-5 w-5 text-[#8B5E34]" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                            >
                                2. Proceso de adopción
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                            Enviar una solicitud no garantiza aprobación; cada caso será evaluado.
                        </p>
                    </div>

                    {/* SECCIÓN 3 */}
                    <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <HeartHandshake className="h-5 w-5 text-[#8B5E34]" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                            >
                                3. Responsabilidades del adoptante
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                            Si eres aprobado, deberás brindar cuidados adecuados y un ambiente seguro.
                        </p>
                    </div>

                    {/* SECCIÓN 4 */}
                    <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <Search className="h-5 w-5 text-[#8B5E34]" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                            >
                                4. Seguimiento
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                            Aceptas participar en seguimientos posteriores, enviando evidencia del bienestar de la mascota.
                        </p>
                    </div>

                    {/* SECCIÓN 5 */}
                    <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <Ban className="h-5 w-5 text-[#B4412F]" />
                            <h3
                                className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}
                            >
                                5. Prohibiciones
                            </h3>
                        </div>
                        <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
                            Está prohibido maltratar, abandonar o comercializar a la mascota.
                        </p>
                    </div>

                    <div className="pl-1 pr-1">
                        <p
                            className={`${poppins.className} text-[15px] text-[#4A392E] font-medium`}
                        >
                            Al continuar, confirmas que has leído estos términos y condiciones.
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
            </div>
        </ModalPremium>
    );
}
