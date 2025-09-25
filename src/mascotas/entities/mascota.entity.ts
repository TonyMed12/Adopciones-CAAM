import type {Especie, Sexo, Tamano} from "@/types/mascotas.types";

export type MascotaEntity = {
    id: string;
    nombre: string;
    especie: Especie;
    sexo: Sexo;
    disponible_adopcion: boolean | null;
    fecha_nacimiento_aprox: string | null;
    personalidad: string | null;
    imagen_url: string | null;
    esterilizado: boolean | null;
    peso_kg: number | null;

    razas: {
        nombre: string;
        tamano: Tamano;
    } | null;
};
