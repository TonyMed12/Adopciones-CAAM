import { useMemo } from "react";

export function useDiasRestantesSolicitud(
    createdAt?: string | null
): number | null {
    return useMemo(() => {
        if (!createdAt) return null;

        const fechaCreacion = new Date(createdAt);

        if (isNaN(fechaCreacion.getTime())) {
            return null;
        }

        const ahora = Date.now();
        const diferenciaMs = ahora - fechaCreacion.getTime();

        const diasTranscurridos = Math.floor(
            diferenciaMs / (1000 * 60 * 60 * 24)
        );

        const DIAS_LIMITE = 3;
        const diasRestantes = DIAS_LIMITE - diasTranscurridos;

        return diasRestantes;
    }, [createdAt]);
}
