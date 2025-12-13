import { useUsuarioAdopcionesQuery } from "@/features/adopciones/hooks/useUsuarioAdopcionesQuery";
import { useUsuarioSolicitudesQuery } from "@/features/solicitudes/hooks/useUsuarioSolicitudesQuery";
import { useUsuarioDireccionQuery } from "@/features/usuarios/hooks/useUsuarioDireccionQuery";

export function useUsuarioDetalle(usuarioId: string | null) {
  const {
    data: adopciones = [],
    isLoading: loadingAdopciones,
  } = useUsuarioAdopcionesQuery(usuarioId ?? "");

  const {
    data: solicitudes = [],
    isLoading: loadingSolicitudes,
  } = useUsuarioSolicitudesQuery(usuarioId ?? "");

  const {
    data: direccion,
    isLoading: loadingDireccion,
  } = useUsuarioDireccionQuery(usuarioId ?? "");

  return {
    adopciones,
    solicitudes,
    direccion,
    isLoading:
      loadingAdopciones ||
      loadingSolicitudes ||
      loadingDireccion ||
      !usuarioId,
  };
}
