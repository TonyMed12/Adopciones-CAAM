import type { Mascota } from "@/features/mascotas/types/mascotas";

export type IniciarAdopcionResult =
    | {
        ok: true;
        mascotaId: string;
        mascotaNombre: string;
    }
    | {
        ok: false;
        reason: "NO_AUTH";
    }
    | {
        ok: false;
        reason: "DOCS_INCOMPLETOS";
        mascota: Mascota;
    }
    | {
        ok: false;
        reason: "SOLICITUD_ACTIVA";
    }
    | {
        ok: false;
        reason: "CITA_ACTIVA";
    }
    | {
        ok: false;
        reason: "ERROR";
        message?: string;
    };
