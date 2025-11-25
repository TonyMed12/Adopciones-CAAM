import { verRaza } from "./razas";

export type Sexo = "macho" | "hembra";
export type Tamano = "pequeño" | "mediano" | "grande";
export type EstadoMascota =
    | "disponible"
    | "en_proceso"
    | "adoptada";

export interface Mascota {
    id: string;
    nombre: string;
    sexo: Sexo;
    tamano: Tamano;
    disponible_adopcion: boolean;
    edad?: string | null;
    personalidad?: string | null;
    imagen_url?: string | null;
    esterilizado: boolean;
    peso_kg?: string | null;
    altura_cm?: number | null;
    colores?: string[] | null;
    descripcion_fisica?: string | null;
    fecha_ingreso: string;
    lugar_rescate?: string | null;
    condicion_ingreso?: string | null;
    observaciones_medicas?: string | null;
    raza_id?: string | null;
    qr_code?: string | null;
    estado: EstadoMascota;
    created_at?: string;
    updated_at?: string;

    raza?: verRaza | null;
}

