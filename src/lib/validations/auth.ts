import { z } from 'zod'

// Validaciones comunes
const emailSchema = z.string()
  .email('Ingresa un correo electrónico válido')
  .min(1, 'El correo electrónico es requerido')

const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(100, 'La contraseña no puede tener más de 100 caracteres')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número')

const nombresSchema = z.string()
  .min(2, 'Los nombres deben tener al menos 2 caracteres')
  .max(100, 'Los nombres no pueden tener más de 100 caracteres')
  .regex(/^[a-zA-ZÀ-ÿñÑ\s]+$/, 'Los nombres solo pueden contener letras y espacios')

const apellidoSchema = z.string()
  .min(2, 'El apellido debe tener al menos 2 caracteres')
  .max(50, 'El apellido no puede tener más de 50 caracteres')
  .regex(/^[a-zA-ZÀ-ÿñÑ\s]+$/, 'El apellido solo puede contener letras y espacios')

const telefonoSchema = z.string()
  .optional()
  .refine((val) => {
    if (!val) return true
    const phoneRegex = /^(\+52\s?)?(\d{3}\s?\d{3}\s?\d{4}|\d{10})$/
    return phoneRegex.test(val.replace(/\s/g, ''))
  }, 'Ingresa un número de teléfono válido (ej: 555 123 4567)')

const curpSchema = z.string()
  .optional()
  .refine((val) => {
    if (!val) return true
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/
    return curpRegex.test(val.toUpperCase())
  }, 'Ingresa una CURP válida')

// Schema para registro de adoptante
export const registroAdoptanteSchema = z.object({
  nombres: nombresSchema,
  apellido_paterno: apellidoSchema,
  apellido_materno: z.string()
    .max(50, 'El apellido materno no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿñÑ\s]*$/, 'El apellido materno solo puede contener letras y espacios')
    .optional(),
  
  email: emailSchema,
  telefono: telefonoSchema,
  
  fecha_nacimiento: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const fecha = new Date(val)
      const hoy = new Date()
      const edad = hoy.getFullYear() - fecha.getFullYear()
      return edad >= 18 && edad <= 100
    }, 'Debes ser mayor de 18 años'),
  
  curp: curpSchema,
  ocupacion: z.string()
    .max(100, 'La ocupación no puede tener más de 100 caracteres')
    .optional(),
  
  password: passwordSchema,
  confirmPassword: z.string(),
  
  acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos y condiciones'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'Debes aceptar la política de privacidad'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
  remember: z.boolean().optional(),
})

// Tipos derivados
export type RegistroAdoptanteData = z.infer<typeof registroAdoptanteSchema>
export type LoginData = z.infer<typeof loginSchema>

// Schemas para formularios paso a paso
export const registroAdoptantePaso1Schema = registroAdoptanteSchema.pick({
  nombres: true,
  apellido_paterno: true,
  apellido_materno: true,
  email: true,
  telefono: true,
})

export const registroAdoptantePaso2Schema = registroAdoptanteSchema.pick({
  fecha_nacimiento: true,
  curp: true,
  ocupacion: true,
})

export const registroAdoptantePaso3Schema = registroAdoptanteSchema.pick({
  password: true,
  confirmPassword: true,
  acceptTerms: true,
  acceptPrivacy: true,
})