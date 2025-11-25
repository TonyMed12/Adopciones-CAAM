import { Mascota } from "../types/mascotas";

export function useMascotasFilter(
    items: Mascota[],
    q: string,
    especie: string,
    sexo: string
) {
    return items.filter((m) => {
        const matchQ =
            !q.trim() ||
            m.nombre.toLowerCase().includes(q.toLowerCase()) ||
            m.raza?.nombre?.toLowerCase().includes(q.toLowerCase());

        const matchEspecie =
            especie === "Todas" ||
            m.raza?.especie?.toLowerCase() === especie.toLowerCase();

        const matchSexo =
            sexo === "Todos" || m.sexo.toLowerCase() === sexo.toLowerCase();

        return matchQ && matchEspecie && matchSexo;
    });
}
