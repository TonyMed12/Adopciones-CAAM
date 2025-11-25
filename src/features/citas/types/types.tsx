export type Cita = {
  id: string;
  mascota: string;
  veterinario: string;
  motivo: string;
  fecha: string;   // YYYY-MM-DD
  hora: string;    // HH:MM
  duracionMin: number;
  telefono?: string;
  lugar?: string;
  notas?: string;
};
