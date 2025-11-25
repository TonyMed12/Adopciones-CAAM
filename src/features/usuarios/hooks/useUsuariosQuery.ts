import { useQuery } from "@tanstack/react-query";
import { fetchUsuarios } from "../queries/usuarios-queries";

export function useUsuariosQuery() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    staleTime: 10000,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
}