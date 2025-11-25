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
}

export interface Perfil {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  curp?: string | null;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  ocupacion?: string | null;
  activo: boolean;
  avatar_url?: string | null;
  bio?: string | null;
  preferencias?: Record<string, any> | null;
  email: string;
  rol_id: number;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PerfilConDireccion extends Perfil {
  direccion?: Direccion | null;
}
