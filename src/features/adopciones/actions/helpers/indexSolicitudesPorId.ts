export function buildNombreCompleto(perfil: any | null | undefined) {
  if (!perfil) return null;

  return [
    perfil.nombres,
    perfil.apellido_paterno,
    perfil.apellido_materno
  ]
    .filter(Boolean)
    .join(" ") || null;
}

export function indexSolicitudesPorId(solicitudes: any[]) {
  return new Map(
    solicitudes.map((s) => {
      const nombreCompleto = buildNombreCompleto(s?.perfiles);

      return [
        s.id,
        {
          usuario_id: s.usuario_id ?? s?.perfiles?.id ?? null,
          usuarioNombre: nombreCompleto,
          usuarioCorreo: s?.perfiles?.email ?? null,

          mascota_id: s.mascota_id ?? s?.mascotas?.id ?? null,
          mascotaNombre: s?.mascotas?.nombre ?? null,
          mascotaImagen: s?.mascotas?.imagen_url ?? null,
        },
      ];
    })
  );
}
