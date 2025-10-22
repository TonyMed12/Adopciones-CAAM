import { Sexo, Tamano, EstadoMascota } from "@/mascotas/mascotas";

export interface CreateMascotaPayload {
  nombre: string;
  sexo: Sexo;
  tamano?: Tamano;
  edad?: string | null;
  personalidad?: string | null;
  descripcion_fisica?: string | null;
  disponible_adopcion?: boolean;
  esterilizado?: boolean;
  peso_kg?: number | null;
  altura_cm?: number | null;
  colores?: string[];
  lugar_rescate?: string | null;
  condicion_ingreso?: string | null;
  observaciones_medicas?: string | null;
  raza_id?: string | null;
  imagen_url?: string | null;
}