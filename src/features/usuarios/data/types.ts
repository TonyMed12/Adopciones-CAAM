// src/data/user/types.ts

export type Perfil = {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  email: string;
  curp: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  ocupacion: string | null;
  activo: boolean;
  avatar_url: string | null;
  bio: string | null;
  preferencias: object | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  rol_id: number | null;
};

export type User = {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  nombreCompleto: string;
  email: string;
  telefono: string | null;
  fechaNacimiento: string | null;
  edad: number | null;
  ocupacion: string | null;
  avatar: string | null;
  bio: string | null;
  activo: boolean;
};

export type Documento = {
  id: string;
  perfil_id: string | null;
  tipo: string;
  url: string;
  status: string;
  created_at: string;
};

export type DocumentoUI = {
  id: string;
  nombre: string;
  tipo: string;
  archivo: string;
  fechaSubida: string;
  verificado: boolean;
};

export function perfilToUser(perfil: Perfil): User {
  const calcularEdad = (fechaNacimiento: string | null): number | null => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return {
    id: perfil.id,
    nombres: perfil.nombres,
    apellidoPaterno: perfil.apellido_paterno,
    apellidoMaterno: perfil.apellido_materno,
    nombreCompleto: `${perfil.nombres} ${perfil.apellido_paterno} ${perfil.apellido_materno || ''}`.trim(),
    email: perfil.email,
    telefono: perfil.telefono,
    fechaNacimiento: perfil.fecha_nacimiento,
    edad: calcularEdad(perfil.fecha_nacimiento),
    ocupacion: perfil.ocupacion,
    avatar: perfil.avatar_url,
    bio: perfil.bio,
    activo: perfil.activo,
  };
}

export function documentoToUI(doc: Documento): DocumentoUI {
  return {
    id: doc.id,
    nombre: doc.tipo,
    tipo: doc.tipo,
    archivo: doc.url,
    fechaSubida: doc.created_at,
    verificado: doc.status === 'aprobado',
  };
}