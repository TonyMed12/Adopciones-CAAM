import { useQuery } from "@tanstack/react-query";
import { fetchUsuarios } from "../queries/usuarios-queries";

export function useUsuarioQuery(id: string | null) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: async () => {
      const users = await fetchUsuarios();
      return users.find(u => u.id === id) ?? null;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
    retry: 1,
  });
}