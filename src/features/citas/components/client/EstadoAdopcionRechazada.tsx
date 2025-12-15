"use client";

import { XCircle } from "lucide-react";

export default function EstadoAdopcionRechazada() {
    return (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-red-800 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Adopción no aprobada
            </h3>

            <p className="mt-2 text-sm text-red-700">
                En esta ocasión tu proceso de adopción no fue aprobado.
                Puedes iniciar una nueva solicitud con otra mascota cuando lo desees.
            </p>
        </div>
    );
}
