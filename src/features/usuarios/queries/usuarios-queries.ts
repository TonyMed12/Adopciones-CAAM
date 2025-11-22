import { listarUsuarios, listarAdopcionesPorUsuario, listarSolicitudesActivasPorUsuario } from "../actions/usuarios-actions";
import { obtenerSolicitudParaAdopcion } from "../actions/solicitudes-actions";
import { obtenerMascotasAdoptadas } from "../actions/usuario-mascotas-actions";

export async function fetchUsuarios() {
  return await listarUsuarios();
}

export async function fetchAdopcionesUsuario(usuarioId: string) {
  if (!usuarioId) return [];
  return await listarAdopcionesPorUsuario(usuarioId);
}

export async function fetchSolicitudesUsuario(usuarioId: string) {
  if (!usuarioId) return [];
  return await listarSolicitudesActivasPorUsuario(usuarioId);
}

export async function fetchSolicitudById(solicitudId: string) {
  return await obtenerSolicitudParaAdopcion(solicitudId);
}

export async function fetchMascotasAdoptadas() {
  return await obtenerMascotasAdoptadas();
}
