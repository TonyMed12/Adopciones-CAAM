"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function BotonesProceso() {
    const [tieneSolicitudes, setTieneSolicitudes] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchSolicitudes() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("solicitudes_adopcion")
                .select("id")
                .eq("perfil_id", user.id)
                .in("estado", ["pendiente", "aprobada"]);

            setTieneSolicitudes(!!data?.length);
        }

        fetchSolicitudes();
    }, []);

    return (
        <div className="mt-5 flex justify-center">
            {tieneSolicitudes ? (
                <Button onClick={() => router.push("/dashboards/usuario/citas")}>
                    <CalendarCheck className="h-5 w-5 mr-2" /> Agendar visita
                </Button>
            ) : (
                <Button onClick={() => router.push("/dashboards/usuario/mascotas")}>
                    <PawPrint className="h-5 w-5 mr-2" /> Ver mascotas disponibles
                </Button>
            )}
        </div>
    );
}
