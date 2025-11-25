import { z } from "zod";

export const RazaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  especie: z.enum(["Perro", "Gato", "Otro"]),
  tamano: z.enum(["pequeño", "mediano", "grande"]).optional(),
  activa: z.boolean().optional(),
});

