import { z } from "zod";

export const DireccionSchema = z.object({
  id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  calle: z.string(),
  numero_exterior: z.string().nullable().optional(),
  numero_interior: z.string().nullable().optional(),
  colonia: z.string(),
  codigo_postal: z.string(),
  municipio: z.string(),
  estado: z.string(),
  pais: z.string().nullable().optional(),
  tipo_vivienda: z.string().nullable().optional(),
  es_propia: z.boolean().nullable().optional(),
  direccion_principal: z.boolean().nullable().optional(),
});

export const PerfilSchema = z.object({
  id: z.string().uuid(),
  nombres: z.string(),
  apellido_paterno: z.string(),
  apellido_materno: z.string().nullable().optional(),
  curp: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  fecha_nacimiento: z.coerce.date().nullable().optional(),
  ocupacion: z.string().nullable().optional(),
  activo: z.boolean(),
  avatar_url: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  preferencias: z.record(z.string(), z.any()).nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
  email: z.string().email(),
  created_by: z.string().uuid().nullable().optional(),
  rol_id: z.number(),
});

export type Perfil = z.infer<typeof PerfilSchema>;

export const PerfilConDireccionSchema = PerfilSchema.extend({
  direccion: DireccionSchema.nullable().optional(),
});

export type PerfilConDireccion = z.infer<typeof PerfilConDireccionSchema>;

export const DeleteUsuarioSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
