import dayjs from "dayjs";

export function generarFechasSeguimiento(fecha: dayjs.Dayjs) {
  if (!fecha.isValid()) {
    return ["Fechas no disponibles"];
  }

  return [
    `1 semana: ${fecha.add(7, "day").format("DD/MM/YYYY")}`,
    `1 mes: ${fecha.add(1, "month").format("DD/MM/YYYY")}`,
    `2 meses: ${fecha.add(2, "month").format("DD/MM/YYYY")}`,
    `6 meses: ${fecha.add(6, "month").format("DD/MM/YYYY")}`,
  ];
}
