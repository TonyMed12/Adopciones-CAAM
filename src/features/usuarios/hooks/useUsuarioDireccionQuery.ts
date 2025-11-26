"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDireccionUsuario } from "../queries/usuarios-queries";

export function useUsuarioDireccionQuery(usuarioId: string) {
    return useQuery({
        queryKey: ["usuario-direccion", usuarioId],
        queryFn: () => fetchDireccionUsuario(usuarioId),
        enabled: !!usuarioId,
    });
}
