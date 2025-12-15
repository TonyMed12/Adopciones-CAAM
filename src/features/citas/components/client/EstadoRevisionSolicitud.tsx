"use client";

import { FileText } from "lucide-react";

export default function EstadoRevisionSolicitud() {
    return (
        <div
            className="
                mt-8
                rounded-2xl 
                border border-[#f2d4b7] 
                bg-gradient-to-br from-[#fff7f1] via-white to-[#ffe9d6]
                p-8 
                shadow-[0_4px_18px_rgba(188,95,54,0.15)]
                animate-fade-in
            "
        >
            <div className="flex items-center gap-4">
                <div
                    className="
                        h-14 w-14 
                        rounded-full 
                        bg-[#BC5F36] 
                        text-white 
                        flex items-center justify-center 
                        shadow-md
                    "
                >
                    <FileText className="h-7 w-7" />
                </div>

                <div>
                    <h3 className="text-xl font-extrabold text-[#8b4513]">
                        Tu formulario está en revisión
                    </h3>
                    <p className="text-sm text-[#7a5c49] mt-1">
                        Ya completaste el formulario de adopción. El equipo del CAAM
                        está revisando tu información. Por favor espera la
                        confirmación final.
                    </p>
                </div>
            </div>

            <div className="mt-5 text-sm text-[#7a5c49] leading-relaxed">
                Te avisaremos cuando tu proceso avance al siguiente paso.
            </div>
        </div>
    );
}
