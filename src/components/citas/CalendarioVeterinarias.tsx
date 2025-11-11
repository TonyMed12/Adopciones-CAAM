"use client";

import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarioVeterinarias({
  citas,
  vistaCompacta = false,
}: {
  citas: any[];
  vistaCompacta?: boolean;
}) {
  const eventos = useMemo(
    () =>
      citas.map((c) => ({
        id: c.id,
        title: `${c.mascota_nombre}`,
        start: c.fecha_cita,
        color:
          c.estado === "pendiente"
            ? "#facc15"
            : c.estado === "aprobada"
            ? "#4ade80"
            : "#f87171",
      })),
    [citas]
  );

  return (
    <div className="text-[9px] leading-tight">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        locale="es"
        events={eventos}
        height="auto"
        contentHeight={200}
        dayMaxEventRows={2}
        eventDisplay="block"
        eventTextColor="#4a2e0e"
        eventBorderColor="#8b4513"
        dayHeaderClassNames="text-[#8b4513] font-semibold"
        titleFormat={{ month: "long", year: "numeric" }}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "",
        }}
        dayCellClassNames="hover:bg-[#fff6e5] cursor-pointer"
        eventDidMount={(info) => {
          info.el.classList.add(
            "rounded-md",
            "shadow-sm",
            "text-[11px]",
            "px-1",
            "py-[2px]"
          );
        }}
      />
    </div>
  );
}
