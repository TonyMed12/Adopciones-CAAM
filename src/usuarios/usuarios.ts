
export interface Documento {
  id: string;
  perfil_id?: string | null;
  tipo: string;
  url: string;
  status?: string | null;
  created_at?: string | null;
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

export interface PerfilConDocumentos extends Perfil {
  documentos?: Documento[] | null;
}
