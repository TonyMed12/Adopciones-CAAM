export type Sexo = "Macho" | "Hembra";

export type Tamano = "pequeño" | "mediano" | "grande";

export type Especie = "Perro" | "Gato" | "Conejo" | "Ave" | "Otro";

export type Mascota = {
    id: string;
    nombre: string;
    especie: Especie;
    sexo: Sexo;
    raza: string;
    tamano: Tamano;
    descripcion: string;
    activo: boolean;
    edadMeses: number;
    fecha_nacimiento_aprox: string | null;
    esterilizado: boolean | null;
    peso_kg: number | null;
    imagen_url?: string | null;
};
