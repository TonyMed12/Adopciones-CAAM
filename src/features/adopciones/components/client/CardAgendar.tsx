"use client";

import { useRouter } from "next/navigation";
import { CalendarCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
    onBack: () => void;
}

export default function CardAgendar({ onBack }: Props) {
    const router = useRouter();

    return (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Agendar visita
                </h3>
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Regresar
                </Button>
            </div>

            <p className="text-sm mb-4">
                Aquí puedes revisar tus solicitudes activas o crear una nueva cita.
            </p>

            <Button
                className="w-full"
                onClick={() => router.push("/dashboards/usuario/citas")}
            >
                Ver mis solicitudes
            </Button>
        </section>
    );
}
