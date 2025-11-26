import { listarSolicitudesActivasPorUsuario } from "../actions/solicitudes-actions";
import { obtenerSolicitudParaAdopcion } from "../actions/solicitudes-actions";

export async function fetchSolicitudesUsuario(usuarioId: string) {
    if (!usuarioId) return [];
    return await listarSolicitudesActivasPorUsuario(usuarioId);
}

export async function fetchSolicitudById(solicitudId: string) {
    return await obtenerSolicitudParaAdopcion(solicitudId);
}
