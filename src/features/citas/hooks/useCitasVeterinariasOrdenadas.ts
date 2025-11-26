"use client";

import { useMemo } from "react";

export function useCitasOrdenadas(citas: any[], filtro: string, query: string) {
  return useMemo(() => {
    const filtradas =
      filtro === "todas" ? citas : citas.filter((c) => c.estado === filtro);

    const buscadas = query
      ? filtradas.filter(
          (c) =>
            c.mascota_nombre.toLowerCase().includes(query.toLowerCase()) ||
            c.adoptante_nombre.toLowerCase().includes(query.toLowerCase())
        )
      : filtradas;

    return [...buscadas].sort(
      (a, b) =>
        new Date(a.fecha_cita).getTime() - new Date(b.fecha_cita).getTime()
    );
  }, [citas, filtro, query]);
}
