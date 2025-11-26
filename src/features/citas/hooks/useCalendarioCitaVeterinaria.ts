"use client";

import { useState, useMemo } from "react";

export function useCalendarioCitaVeterinaria() {
  // Horas disponibles
  const horasDisponibles = [
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
  ];

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());

  const generarCeldas = () => {
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const offset = primerDia.getDay();

    const celdas: any[] = [];

    for (let i = 0; i < offset; i++) celdas.push(null);

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fecha = new Date(anioActual, mesActual, d);
      const isWeekend = fecha.getDay() === 0 || fecha.getDay() === 6;

      const fechaStr = fecha.toISOString().split("T")[0];

      celdas.push({
        d,
        fecha,
        fechaStr,
        deshabilitado: isWeekend || fecha < hoy,
      });
    }

    return celdas;
  };

  const celdas = useMemo(() => generarCeldas(), [mesActual, anioActual]);

  const cambiarMes = (dir: "prev" | "next") => {
    setMesActual((m) => (dir === "next" ? (m + 1) % 12 : (m + 11) % 12));
    if (dir === "next" && mesActual === 11) setAnioActual((y) => y + 1);
    if (dir === "prev" && mesActual === 0) setAnioActual((y) => y - 1);
  };

  const nombreMes = new Date(anioActual, mesActual).toLocaleString("es-MX", {
    month: "long",
    year: "numeric",
  });

  return {
    horasDisponibles,
    celdas,
    cambiarMes,
    hoy,
    mesActual,
    anioActual,
    nombreMes,
  };
}
