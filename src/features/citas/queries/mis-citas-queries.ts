import { obtenerMisCitasUsuario } from "../actions/misCitas-actions";
import type { MisCitasBackendDTO } from "../types/mis-citas";

export async function fetchMisCitas(): Promise<MisCitasBackendDTO> {
    return obtenerMisCitasUsuario();
}