import { z } from "zod";

const SexoEnum = z.enum(["macho", "hembra"]);
const TamanoEnum = z.enum(["pequeño", "mediano", "grande"]);
const EstadoEnum = z.enum(["disponible", "en_proceso", "adoptada"]);
const PersonalidadEnum = z.enum(["timido", "carinoso", "jugueton", "tranquilo", "energetico", "protector"]);

/* -------------------- CREATE -------------------- */
export const CreateMascotaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre es demasiado largo"),

  sexo: SexoEnum,
  tamano: TamanoEnum,

  disponible_adopcion: z.boolean().default(true),

  edad: z
    .string()
    .min(1, "Ingresa la edad en meses")
    .refine((v) => !isNaN(Number(v)), { message: "La edad debe ser un número" })
    .refine((v) => Number(v) >= 0, { message: "La edad no puede ser negativa" })
    .refine((v) => Number(v) <= 300, {
      message: "Edad demasiado alta para una mascota",
    }),
  personalidad: PersonalidadEnum.refine(() => true, {
    message: "Debes seleccionar una personalidad para registrar la mascota",
  }),
  imagen_url: z.string().url("Debe ser una URL válida").nullable().default(null),

  esterilizado: z.boolean().default(false),
  peso_kg: z
    .number()
    .nullable()
    .refine((v) => v === null || v > 0, {
      message: "El peso debe ser mayor a 0",
    })
    .refine((v) => v === null || v < 200, {
      message: "Peso inválido",
    }),
  altura_cm: z
    .number()
    .nullable()
    .refine((v) => v === null || v > 0, {
      message: "La altura debe ser mayor a 0",
    })
    .refine((v) => v === null || v < 250, {
      message: "Altura inválida",
    }),

  colores: z
    .array(z.string())
    .min(1, "Selecciona al menos un color")
    .optional()
    .nullable(),

  descripcion_fisica: z
    .string()
    .min(10, "Describe brevemente la apariencia")
    .nullable()
    .optional(),

  fecha_ingreso: z
    .string()
    .default(() => new Date().toISOString().split("T")[0]),

  lugar_rescate: z
    .string()
    .min(3, "Ingresa un lugar de rescate")
    .nullable()
    .optional(),
  condicion_ingreso: z
    .string()
    .min(3, "Selecciona o describe la condición")
    .nullable()
    .optional(),
  observaciones_medicas:
    z.string()
      .min(3, "Describe brevemente alguna observación médica")
      .nullable()
      .optional(),

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