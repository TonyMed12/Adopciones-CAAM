export type Sexo = "Macho" | "Hembra";
export type Tamano = "pequeño" | "mediano" | "grande";

export type MascotaEntity = {
    id: string;
    nombre: string;
    sexo: Sexo;
    disponible_adopcion: boolean;
    edad: string | null;
    personalidad: string | null;
    imagen_url: string | null;
    esterilizado: boolean;
    peso_kg: number | null;
    altura_cm: number | null;
    colores: string[];
    descripcion_fisica: string | null;
    qr_code: string | null;
    fecha_ingreso: string;
    lugar_rescate: string | null;
    condicion_ingreso: string | null;
    observaciones_medicas: string | null;
    metadata: Record<string, unknown>;

    raza: {
        id: string;
        nombre: string;
        tamano: Tamano;
        especie: string;
    } | null;
};
