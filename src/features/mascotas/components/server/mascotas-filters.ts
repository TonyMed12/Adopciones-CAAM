import type { Mascota } from "../../types/mascotas";

export interface MascotasFiltros {
    q?: string;
    especie?: string;
    sexo?: string;
}

export function aplicarFiltrosMascotas(
    items: Mascota[],
    { q = "", especie = "Todas", sexo = "Todos" }: MascotasFiltros
): Mascota[] {

    return items.filter((m) => {
        const matchQ =
            !q.trim() ||
            m.nombre.toLowerCase().includes(q.toLowerCase()) ||
            m.raza?.nombre?.toLowerCase().includes(q.toLowerCase());

        const matchEspecie =
            especie === "Todas" ||
            m.raza?.especie?.toLowerCase() === especie.toLowerCase();

        const matchSexo =
            sexo === "Todos" ||
            m.sexo.toLowerCase() === sexo.toLowerCase();

        return matchQ && matchEspecie && matchSexo;
    });
}
