import { useQuery } from "@tanstack/react-query";
import { fetchUsuariosByIds } from "../actions/usuarios-actions";

export function useUsuarioQuery(id: string | null) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: async () => {
      const [usuario] = await fetchUsuariosByIds([id!]);
      return usuario ?? null;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
    retry: 1,
  });
}
