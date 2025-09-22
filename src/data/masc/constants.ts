import type { Mascota, Tamano } from "./types";

/** Puedes ajustar esta lista si quieren más especies */
export const ESPECIES = ["Perro", "Gato", "Conejo", "Ave", "Otro"] as const;
export const TAMANOS: Tamano[] = ["Pequeño", "Mediano", "Grande"];

/** Datos de ejemplo para visualizar la vista */
export const MOCK: Mascota[] = [
  { id: "1", nombre: "Luna", especie: "Gato",  raza: "Criollo",   edadMeses: 10, sexo: "H", tamano: "Pequeño", descripcion: "Gris con blanco", fotoUrl: "https://placekitten.com/400/300", activo: true },
  { id: "2", nombre: "Max",  especie: "Perro", raza: "Mestizo",   edadMeses: 24, sexo: "M", tamano: "Mediano", descripcion: "Café claro",       fotoUrl: "https://images.dog.ceo/breeds/hound-walker/n02089867_3273.jpg", activo: true },
  { id: "3", nombre: "Nina", especie: "Perro", raza: "Labrador",  edadMeses: 7,  sexo: "H", tamano: "Grande",  descripcion: "Muy cariñosa",    fotoUrl: "https://images.dog.ceo/breeds/labrador/n02099712_6973.jpg",       activo: true },
  { id: "4", nombre: "Coco", especie: "Gato",  raza: "Siamés",    edadMeses: 36, sexo: "M", tamano: "Pequeño", descripcion: "Ojos azules",     fotoUrl: "https://placekitten.com/401/301", activo: true },
];