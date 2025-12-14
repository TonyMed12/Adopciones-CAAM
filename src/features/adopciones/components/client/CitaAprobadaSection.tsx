"use client";

import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CitaAprobadaSectionProps {
    mascota: {
        nombre: string;
        imagen_url: string | null;
    };
    onIrFormulario: () => void;
}

export default function CitaAprobadaSection({
    mascota,
    onIrFormulario,
}: CitaAprobadaSectionProps) {
    return (
        <div
            className="
        mt-6 mb-6
        rounded-2xl 
        border border-blue-200 
        bg-gradient-to-br from-blue-50 via-white to-blue-100
        p-6 sm:p-8 
        shadow-[0_4px_15px_rgba(0,0,0,0.07)]
        animate-fade-in
      "
        >
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="h-6 w-6" />
                </div>

                <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-blue-900">
                        ¡Tu cita fue aprobada! 🎉
                    </h3>
                    <p className="text-sm sm:text-base text-blue-700 mt-1">
                        El CAAM confirmó que la interacción con tu mascota fue positiva.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-[140px_1fr] gap-6 items-center">
                <div className="w-full rounded-2xl overflow-hidden border border-blue-200 shadow-sm bg-white">
                    <img
                        src={mascota.imagen_url || "/placeholder.jpg"}
                        alt={mascota.nombre}
                        className="w-full h-36 object-cover"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-sm sm:text-base text-blue-900 leading-relaxed">
                        La convivencia fue{" "}
                        <strong className="text-blue-700">aprobada</strong>.
                    </p>

                    <div className="text-sm text-blue-800">
                        <strong>Mascota:</strong> {mascota.nombre}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button
                    onClick={onIrFormulario}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700"
                >
                    <FileText className="h-5 w-5 mr-2" />
                    Llenar formulario de adopción
                </Button>
            </div>
        </div>
    );
}
