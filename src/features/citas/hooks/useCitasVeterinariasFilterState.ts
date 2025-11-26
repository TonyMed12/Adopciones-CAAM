"use client";

import { useState } from "react";

export function useCitasFilterState() {
  const [filtro, setFiltro] = useState<
    "todas" | "pendiente" | "aprobada" | "cancelada"
  >("todas");

  const [query, setQuery] = useState("");

  return { filtro, setFiltro, query, setQuery };
}
