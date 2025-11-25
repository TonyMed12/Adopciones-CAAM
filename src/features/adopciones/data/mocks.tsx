// /data/adopciones/mocks.ts
export type FormEstado = "borrador" | "en_revision" | "aprobado" | "rechazado";
export type CitaGate = "aprobada" | "pendiente";

export type AdopcionForm = {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  mascotaId: string;
  mascotaNombre: string;
  experiencia: "nunca" | "poca" | "mucha";
  evidenciaHogarUrls: string[]; // mock: strings
  direccion: string;
  telefono: string;
  compromisoAceptado: boolean;
  observaciones?: string;
  estado: FormEstado;
  rechazoMotivo?: string;
  createdAt: string;
};

export type UsuarioGate = {
  usuarioId: string;
  cita: CitaGate; // controla si puede ver el form
};

export const gateMock: UsuarioGate = {
  usuarioId: "usr_101",
  cita: "aprobada", // cámbialo a "pendiente" para bloquear
};

export let formulariosMock: AdopcionForm[] = [
  {
    id: "form_001",
    usuarioId: "usr_102",
    usuarioNombre: "Carlos Ruiz",
    mascotaId: "masc_12",
    mascotaNombre: "Toby",
    experiencia: "mucha",
    evidenciaHogarUrls: [],
    direccion: "Calle 1 #234, Col. Centro, CDMX",
    telefono: "55-1234-5678",
    compromisoAceptado: true,
    observaciones: "Vive con patio.",
    estado: "en_revision",
    createdAt: "2025-11-02T20:00:00Z",
  },
];

// utilidades in-memory para mock
export function crearFormularioMock(payload: Omit<AdopcionForm, "id"|"estado"|"createdAt">) {
  const nuevo: AdopcionForm = {
    ...payload,
    id: `form_${Math.random().toString(36).slice(2, 8)}`,
    estado: "en_revision",
    createdAt: new Date().toISOString(),
  };
  formulariosMock = [nuevo, ...formulariosMock];
  return nuevo;
}

export function actualizarEstadoFormularioMock(id: string, estado: FormEstado, rechazoMotivo?: string) {
  formulariosMock = formulariosMock.map(f => f.id === id ? { ...f, estado, rechazoMotivo } : f);
  return formulariosMock.find(f => f.id === id)!;
}
