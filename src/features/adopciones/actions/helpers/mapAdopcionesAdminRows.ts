import type { AdopcionAdminRow } from "../../types/adopciones";

export function mapAdopcionesAdminRows(adopciones: any[], byId: Map<string, any>): AdopcionAdminRow[] {
  return adopciones.map((a) => {
    const meta =
      byId.get(a.solicitud_id) ||
      ({
        usuario_id: null,
        usuarioNombre: null,
        usuarioCorreo: null,
        mascota_id: null,
        mascotaNombre: null,
        mascotaImagen: null,
      } as any);

    return {
      id: a.id,
      estado: a.estado,
      created_at: a.created_at,

      usuario_id: meta.usuario_id,
      usuarioNombre: meta.usuarioNombre,
      usuarioCorreo: meta.usuarioCorreo,

      mascota_id: meta.mascota_id,
      mascotaNombre: meta.mascotaNombre,
      mascotaImagen: meta.mascotaImagen,

      tipo_vivienda: a.tipo_vivienda,
      espacio_disponible: a.espacio_disponible,
      otras_mascotas: a.otras_mascotas,

      evidencias: Array.isArray(a.evidencia_hogar_urls) ? a.evidencia_hogar_urls : [],
      observaciones_usuario: a.observaciones_usuario,
      observaciones_admin: a.observaciones_admin,
    };
  });
}
