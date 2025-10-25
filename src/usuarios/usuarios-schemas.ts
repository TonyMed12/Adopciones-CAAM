import { z } from "zod";

export const DocumentoSchema = z.object({
  id: z.string().uuid(),
  perfil_id: z.string().uuid().nullable().optional(),
  tipo: z.string(),
  url: z.string(),
  status: z.string().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
});

export type Documento = z.infer<typeof DocumentoSchema>;

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

export const PerfilConDocumentosSchema = PerfilSchema.extend({
  documentos: z.array(DocumentoSchema).optional(),
});

export const DeleteUsuarioSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export type PerfilConDocumentos = z.infer<typeof PerfilConDocumentosSchema>;
