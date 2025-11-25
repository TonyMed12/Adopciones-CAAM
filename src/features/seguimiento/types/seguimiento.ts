export interface Seguimiento {
  id: string;
  adopcion_id: string | null;
  fecha_seguimiento: string;
  observaciones: string | null;
  recomendaciones: string | null;
  satisfaccion_adoptante: number | null;
  estado_mascota:
    | "requiere_atencion"
    | "regular"
    | "bueno"
    | "excelente"
    | null;
  problemas_reportados: string[] | null;
  fotos_actuales: string[] | null;
  completado: boolean;
  realizado_por: string | null;
  created_at: string;

  adopciones: {
    id: string;

    solicitudes_adopcion: {
      mascota_id: string;
    }[]; 
  }[]; 
}


export interface MascotaSeguimiento {
  id: string;
  nombre: string;
  sexo: string;
  tamano: string;
  edad: number;
  imagen_url: string | null;
  personalidad?: string;
  descripcion_fisica?: string;
  raza?: {
    nombre: string;
    especie: string;
  } | null;
}
