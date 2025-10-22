export type RolUsuario = 'administrador' | 'adoptante' | 'voluntario'
export type TipoVivienda = 'casa' | 'departamento' | 'otro'

export interface Perfil {
  id: string
  nombres: string
  apellido_paterno: string
  apellido_materno?: string
  email: string
  curp?: string
  telefono?: string
  fecha_nacimiento?: string
  ocupacion?: string
  rol: RolUsuario
  activo?: boolean
  avatar_url?: string
  bio?: string
  preferencias?: Record<string, any>
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: Perfil
        Insert: Omit<Perfil, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Perfil, 'id'>>
      }
    }
  }
}