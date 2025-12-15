import { useConfirmarCitaMutation } from "./useConfirmarCitaMutation";
import type { SolicitudActiva } from "../types/solicitud-activa";
import type { PerfilUsuario } from "@/features/usuarios/types/perfil-usuario";

type Params = {
    solicitud: SolicitudActiva | null;
    perfil: PerfilUsuario | null;
    onSuccess: () => void;
    showToast: (msg: string) => void;
};

export function useAgendarCitaFlow({
    solicitud,
    perfil,
    onSuccess,
    showToast,
}: Params) {
    const mutation = useConfirmarCitaMutation();

    async function confirmar(fecha: string, hora: string) {
        if (!fecha || !hora || !solicitud || !perfil) {
            showToast("Selecciona fecha y hora");
            return;
        }

        await mutation.mutateAsync({
            usuarioId: perfil.id,
            solicitudId: solicitud.id,
            mascotaId: solicitud.mascota?.id ?? null,
            fecha,
            hora,
        });

        onSuccess();
    }

    return {
        confirmar,
        isPending: mutation.isPending,
    };
}
