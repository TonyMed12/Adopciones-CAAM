import type { Mascota } from "@/features/mascotas/types/mascotas";
import type { RowMascota } from "@/features/mascotas/components/client/MascotasTable";

export function formatearMascotaParaTabla(m: Mascota): RowMascota {
  const totalMeses = Number(m.edad ?? 0);
  const años = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;

  const edadMeses =
    años > 0
      ? `${años} año${años > 1 ? "s" : ""}${
          meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
        }`
      : `${meses} mes${meses !== 1 ? "es" : ""}`;

  return {
    id: m.id,
    nombre: m.nombre,
    especie: m.raza?.especie || "Desconocido",
    raza: m.raza?.nombre || "Mestizo",
    sexo: m.sexo,
    tamano: m.tamano ?? null,
    edadMeses, 
    descripcion: m.personalidad || m.descripcion_fisica || "",
    foto: m.imagen_url ?? null,
    original: m,
  };
}
