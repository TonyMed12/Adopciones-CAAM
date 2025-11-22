import { z } from "zod";

const SexoEnum = z.enum(["macho", "hembra"]);
const TamanoEnum = z.enum(["pequeño", "mediano", "grande"]);
const EstadoEnum = z.enum(["disponible", "en_proceso", "adoptada"]);

/* -------------------- CREATE -------------------- */
export const CreateMascotaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),

  sexo: SexoEnum,
  tamano: TamanoEnum,

  disponible_adopcion: z.boolean().default(true),

  edad: z.string().optional().nullable(),
  personalidad: z.string().optional().nullable(),
  imagen_url: z.string().url("Debe ser una URL válida").nullable().default(null),

  esterilizado: z.boolean().default(false),

  peso_kg: z.string().optional().nullable(),
  altura_cm: z.number().optional().nullable(),

  colores: z.array(z.string()).optional().nullable(),

  descripcion_fisica: z.string().optional().nullable(),

  fecha_ingreso: z
    .string()
    .default(() => new Date().toISOString().split("T")[0]),

  lugar_rescate: z.string().optional().nullable(),
  condicion_ingreso: z.string().optional().nullable(),
  observaciones_medicas: z.string().optional().nullable(),

  raza_id: z.string().uuid("ID de raza inválido").optional().nullable(),

  qr_code: z.string().nullable().default(null),

  estado: EstadoEnum.default("disponible"),
});

/* -------------------- ARCHIVO -------------------- */
export const MascotaArchivoSchema = z.object({
  imagen: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, "Máximo 5 MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Formato de imagen inválido"
    ),
});

/* -------------------- UPDATE -------------------- */
export const UpdateMascotaSchema = CreateMascotaSchema.extend({
  id: z.string().uuid("ID inválido"),
});

/* -------------------- DELETE -------------------- */
export const DeleteMascotaSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
