import { Sexo, Tamano, EstadoMascota } from "@/features/mascotas/types/mascotas";

export interface CreateMascotaPayload {
  id: string;
  nombre: string;
  sexo: string;
  tamano: string;
  raza_id: string;
  edad: string;
  peso_kg: string;
  altura_cm: number;
  personalidad: string;
  descripcion_fisica: string;
  esterilizado: boolean;
  disponible_adopcion: boolean;
  colores: string[];
  lugar_rescate: string;
  condicion_ingreso: string;
  observaciones_medicas: string;
  imagen_url: string | null;
  qr_code: string | null;
}

export interface UpdateMascotaPayload extends CreateMascotaPayload {
  id: string; 
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