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

    const prioridad: Record<string, number> = {
      pendiente: 1,
      aprobada: 2,
      cancelada: 3,
    };

    return [...buscadas].sort((a, b) => {
      const pa = prioridad[a.estado] ?? 99;
      const pb = prioridad[b.estado] ?? 99;

      if (pa !== pb) return pa - pb;

      return (
        new Date(a.fecha_cita).getTime() -
        new Date(b.fecha_cita).getTime()
      );
    });
  }, [citas, filtro, query]);
}
