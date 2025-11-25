"use client";

import { useQuery } from "@tanstack/react-query";
import { listarDocumentos } from "../actions/documentos-actions";

export function useDocumentosQuery(filtro: string) {
  return useQuery({
    queryKey: ["documentos", filtro],
    queryFn: () => listarDocumentos(filtro),
    staleTime: 10000,
  });
}
