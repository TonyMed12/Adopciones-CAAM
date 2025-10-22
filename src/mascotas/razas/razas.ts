export type Raza = {
  id: string;
  nombre: string;
  slug: string;
  especie: "Perro" | "Gato" | "Otro";
  tamano?: "pequeño" | "mediano" | "grande";
  activa?: boolean;
  created_at?: string;
};
