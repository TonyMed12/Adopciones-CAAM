export type Sexo = "M" | "H";
export type Tamano = "Pequeño" | "Mediano" | "Grande";

export type Mascota = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edadMeses: number;
  descripcion?: string;
  tamano: Tamano;
  sexo: Sexo;
  fotoUrl?: string;
  activo?: boolean;
};