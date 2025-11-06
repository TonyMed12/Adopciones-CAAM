import {z} from "zod";

export const NuevaAdopcionSchema = z.object({
    solicitud_id: z.string().uuid(),
    tipo_vivienda: z.string().min(2, "Tipo de vivienda requerido"),
    espacio_disponible: z.string().min(2, "Espacio disponible requerido"),
    otras_mascotas: z.boolean(),
    detalle_otras_mascotas: z.string().nullable().optional(),
    evidencia_hogar_urls: z.array(z.string().url()).min(1, "Debes subir al menos una foto"),
    compromiso_seguimiento: z.boolean().refine((val) => val, "Debes aceptar el compromiso de seguimiento"),
    compromiso_cuidado: z.boolean().refine((val) => val, "Debes aceptar el compromiso de cuidado"),
    observaciones_usuario: z.string().nullable().optional(),
});

export const RevisionAdopcionSchema = z
.object({
    id: z.string().uuid(),
    admin_responsable: z.string().uuid(),
    estado: z.enum(["aprobada", "rechazada"]),
    observaciones_admin: z.string().nullable().optional(),
    contrato_url: z.string().url().nullable().optional(),
    seguimiento_programado: z.string().nullable().optional(),
})
.superRefine((val, ctx) => {
    if (val.estado === "rechazada" && !val.observaciones_admin?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debes indicar el motivo del rechazo.",
            path: ["observaciones_admin"],
        });
    }
});
