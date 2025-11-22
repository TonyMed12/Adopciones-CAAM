import { Sexo, Tamano, EstadoMascota } from "@/features/mascotas/types/mascotas";

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
  descripcion?: string;

}

export interface Mascota extends CreateMascotaPayload {
  id: string;
  estado?: EstadoMascota | string;
  activo?: boolean;
  especie?: string;
  raza?: string;
  edadMeses?: string; // para el formateo que haces en el front
  foto?: string;
  created_at?: string;
  updated_at?: string;
}