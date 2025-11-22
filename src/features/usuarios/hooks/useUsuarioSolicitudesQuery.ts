import { useQuery } from "@tanstack/react-query";
import { fetchSolicitudesUsuario } from "../queries/usuarios-queries";

export function useUsuarioSolicitudesQuery(usuarioId: string) {
  return useQuery({
    queryKey: ["usuario_solicitudes", usuarioId],
    queryFn: () => fetchSolicitudesUsuario(usuarioId),
    enabled: !!usuarioId
  });
}