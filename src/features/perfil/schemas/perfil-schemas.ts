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

export const DocumentoSchema = z.object({
    id: z.string().uuid(),
    perfil_id: z.string().uuid().nullable().optional(),
    tipo: z.string().nullable().optional(),
    status: z.string(),
    url: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
});

export const MascotaSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().nullable().optional(),
    imagen_url: z.string().nullable().optional(),
});

export const SolicitudAdopcionSchema = z.object({
    id: z.string().uuid(),
    numero_solicitud: z.string().nullable().optional(),
    estado: z.string(),
    prioridad: z.number().nullable().optional(),
    motivo_adopcion: z.string().nullable().optional(),
    mascota: MascotaSchema.nullable().optional(),
});

export const PerfilSchema = z.object({
    id: z.string().uuid(),
    nombres: z.string(),
    apellido_paterno: z.string(),
    apellido_materno: z.string().nullable().optional(),
    email: z.string().email(),
    curp: z.string().nullable().optional(),
    ocupacion: z.string().nullable().optional(),
    telefono: z.string().nullable().optional(),
    rol_id: z.number(),
    avatar_url: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
});

export type Direccion = z.infer<typeof DireccionSchema>;
export type Documento = z.infer<typeof DocumentoSchema>;
export type SolicitudAdopcion = z.infer<typeof SolicitudAdopcionSchema>;
export type Perfil = z.infer<typeof PerfilSchema>;
