import { listarUsuarios } from "../actions/usuarios-actions";
import { obtenerDireccionPrincipal } from "../actions/usuario-direcciones-actions";
import type { ListarUsuariosResult } from "../types/usuarios";

export const usuariosInfiniteQuery = ({
  search,
}: {
  search?: string;
}) => ({
  queryKey: ["usuarios", { search }],
  queryFn: ({ pageParam }: { pageParam?: string | null }) =>
    listarUsuarios({ cursor: pageParam, search }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage: ListarUsuariosResult) =>
    lastPage.nextCursor,

  staleTime: 1000 * 30,      
  gcTime: 1000 * 60 * 5,
});

export async function fetchDireccionUsuario(usuarioId: string) {
  return await obtenerDireccionPrincipal(usuarioId);
}