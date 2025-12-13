import { z } from "zod";

export const seguimientoSchema = z.object({
  observaciones: z.string().min(3),
  recomendaciones: z.string().optional(),
  satisfaccion_adoptante: z.number(),
  estado_mascota: z.string(),
  fotos: z.any(),
  problemas_reportados: z.string().optional(),
});

export type SeguimientoFormValues = z.infer<typeof seguimientoSchema>;
