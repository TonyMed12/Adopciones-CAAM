export type Documento = {
  id: string;
  tipo: string;
  url: string;
  status: "pendiente" | "aprobado" | "rechazado";
  created_at: string;
  observacion_admin?: string | null;
  perfiles?: {
    nombres: string;
    email: string;
  } | null;
};
