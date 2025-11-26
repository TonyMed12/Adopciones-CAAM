import { listarUsuarios } from "../actions/usuarios-actions";
import { obtenerDireccionPrincipal } from "../actions/usuario-direcciones-actions";

export async function fetchUsuarios() {
  return await listarUsuarios();
}

export async function fetchDireccionUsuario(usuarioId: string) {
  return await obtenerDireccionPrincipal(usuarioId);
}