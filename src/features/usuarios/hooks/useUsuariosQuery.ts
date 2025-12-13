import { useInfiniteQuery } from "@tanstack/react-query";
import { usuariosInfiniteQuery } from "../queries/usuarios-queries";

export function useUsuariosQuery(params: { search?: string }) {
  return useInfiniteQuery(usuariosInfiniteQuery(params));
}

