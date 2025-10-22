export type Sexo = "Macho" | "Hembra";
export type Tamano = "pequeño" | "mediano" | "grande";
export type EstadoMascota = "disponible" | "adoptado" | "en proceso";

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
    peso_kg?: number | null;
    altura_cm?: number | null;
    colores?: string[];
    descripcion_fisica?: string | null;
    fecha_ingreso: string;
    lugar_rescate?: string | null;
    condicion_ingreso?: string | null; // ⚡ agregado
    observaciones_medicas?: string | null;
    raza_id?: string | null;
    qr_code?: string | null;
    estado?: EstadoMascota;
    created_at?: string;
    updated_at?: string;

    raza?: {
        id: string;
        nombre: string;
        especie: string;
    } | null;
}
