import {z} from "zod";

export const CreateMascotaSchema = z.object({
    nombre: z.string().min(2, {message: "El nombre debe tener al menos 2 caracteres."}),
    sexo: z.enum(["Macho", "Hembra"]),
    raza_id: z.string().uuid({message: "Debes seleccionar una raza válida."}),
    personalidad: z.string().max(100).optional(),
    edad: z.string().optional(),
    peso_kg: z.coerce.number().positive({message: "El peso debe ser un número positivo."}).optional(),
    altura_cm: z.coerce.number().int().positive({message: "La altura debe ser un entero positivo."}).optional(),
    colores: z.array(z.string().min(1)).default([]),
    descripcion_fisica: z.string().optional(),
    esterilizado: z.boolean().optional().default(false),
    qr_code: z.string().max(100).optional(),
    lugar_rescate: z.string().optional(),
    condicion_ingreso: z.string().optional(),
    observaciones_medicas: z.string().optional(),
    disponible_adopcion: z.boolean().optional().default(true),
    imagen_url: z.string().url({message: "La URL de la imagen no es válida."}).optional(),
    metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type CreateMascotaPayload = z.infer<typeof CreateMascotaSchema>;
