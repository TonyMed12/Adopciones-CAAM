export interface Direccion {
  id: string;
  usuario_id: string;
  calle: string;
  numero_exterior?: string | null;
  numero_interior?: string | null;
  colonia: string;
  codigo_postal: string;
  municipio: string;
  estado: string;
  pais?: string | null;
  tipo_vivienda?: string | null;
  es_propia?: boolean | null;
  direccion_principal?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MascotaMin {
  id: string;
  nombre?: string | null;
  imagen_url?: string | null;
}

export interface SolicitudAdopcionMin {
  id: string;
  numero_solicitud?: string | null;
  estado: string;
  prioridad?: number | null;
  motivo_adopcion?: string | null;
  mascota?: MascotaMin | null;
}

export interface Documento {
  id: string;
  perfil_id?: string | null;
  tipo?: string | null;
  status: string;
  url?: string | null;
  created_at?: string | null;
}

export interface Perfil {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  ocupacion?: string | null;
  email: string;
  curp?: string | null;
  telefono?: string | null;
  rol_id: number;
  avatar_url?: string | null;
  created_at?: string | null;
}
