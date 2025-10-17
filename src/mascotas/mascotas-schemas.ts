import { z } from "zod";
import { Sexo, Tamano, EstadoMascota } from "./mascotas";

// Enums basados en tus tipos definidos
const SexoEnum = z.enum(["Macho", "Hembra"] satisfies [Sexo, Sexo]);
const TamanoEnum = z.enum(["pequeño", "mediano", "grande"] satisfies [Tamano, Tamano, Tamano]);
const EstadoEnum = z.enum(["disponible", "adoptado", "en proceso"] satisfies [EstadoMascota, EstadoMascota, EstadoMascota]);

// 📌 Schema para crear mascota
export const CreateMascotaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  sexo: SexoEnum,
  tamano: TamanoEnum,
  disponible_adopcion: z.boolean().default(true),
  edad: z.string().optional().nullable(),
  personalidad: z.string().optional().nullable(),
  imagen_url: z.string().url("Debe ser una URL válida").optional().nullable(),
  esterilizado: z.boolean().default(false),
  peso_kg: z.number().optional().nullable(),
  altura_cm: z.number().optional().nullable(),
  colores: z.array(z.string()).optional(),
  descripcion_fisica: z.string().optional().nullable(),
  fecha_ingreso: z.string().default(new Date().toISOString()),
  lugar_rescate: z.string().optional().nullable(),
  condicion_ingreso: z.string().optional().nullable(),
  observaciones_medicas: z.string().optional().nullable(),
  raza_id: z.string().uuid("ID de raza inválido").optional().nullable(),
  qr_code: z.string().optional().nullable(),
  estado: EstadoEnum.default("disponible"),
});

export const UpdateMascotaSchema = CreateMascotaSchema.extend({
  id: z.string().uuid("ID inválido"),
});

export const DeleteMascotaSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
