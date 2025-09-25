import {z} from "zod";

// ESQUEMA PARA EL LOGIN DE USUARIOS

export const LoginSchema = z.object({
    correo: z.string().email({message: "Por favor, introduce un correo electrónico válido."}),
    contrasena: z.string().min(8, {message: "La contraseña debe tener al menos 8 caracteres."}),
});

