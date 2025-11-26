"use client";

import { useState } from "react";

export function useCitasVeterinariasUsuarioPageState() {
  const [modo, setModo] = useState<"lista" | "agendar">("lista");
  const [filtro, setFiltro] = useState<
    "todas" | "pendiente" | "aprobada" | "cancelada"
  >("todas");

  const [mensaje, setMensaje] = useState<string | null>(null);

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  return {
    modo,
    setModo,
    filtro,
    setFiltro,
    mensaje,
    setMensaje,
    mascotaSeleccionada,
    setMascotaSeleccionada,
    fechaSeleccionada,
    setFechaSeleccionada,
    horaSeleccionada,
    setHoraSeleccionada,
    motivo,
    setMotivo,
  };
}
