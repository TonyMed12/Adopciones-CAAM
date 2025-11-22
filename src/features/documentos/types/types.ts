export type Documento = {
  id: string;
  tipo: string;
  url: string;
  status: string;
  created_at: string;
  observacion_admin?: string;
  perfiles?: {
    nombres: string;
    email: string;
  };
};
