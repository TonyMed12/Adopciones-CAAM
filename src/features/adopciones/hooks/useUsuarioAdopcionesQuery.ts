import { useQuery } from "@tanstack/react-query";
import { fetchAdopcionesUsuario } from "../queries/adopciones-queries";

export function useUsuarioAdopcionesQuery(usuarioId: string) {
  return useQuery({
    queryKey: ["usuario_adopciones", usuarioId],
    queryFn: () => fetchAdopcionesUsuario(usuarioId),
    enabled: !!usuarioId
  });
}