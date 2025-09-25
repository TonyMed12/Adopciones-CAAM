import {z} from "zod";

export const CreateMascotaSchema = z.object({
    nombre: z.string().min(2, {message: "El nombre debe tener al menos 2 caracteres."}),
    especie: z.enum(["Perro", "Gato", "Conejo", "Ave", "Otro"]),
    sexo: z.enum(["Macho", "Hembra"]),
    raza_id: z.string().uuid({message: "Debes seleccionar una raza válida."}),
    personalidad: z.string().optional(),
    fecha_nacimiento_aprox: z.string().optional(),
    peso_kg: z.coerce.number().positive({message: "El peso debe ser un número positivo."}).optional(),
    esterilizado: z.boolean().optional().default(false),

    imagen_url: z.string().url({message: "La URL de la imagen no es válida."}).optional(),
});

export type CreateMascotaPayload = z.infer<typeof CreateMascotaSchema>;
