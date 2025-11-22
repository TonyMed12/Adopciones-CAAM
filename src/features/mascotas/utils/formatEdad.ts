export function formatEdad(edadMeses?: string | number | null): string {
    const total = Number(edadMeses ?? 0);
    const años = Math.floor(total / 12);
    const meses = total % 12;

    if (años > 0) {
        return `${años} año${años > 1 ? "s" : ""}${meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
            }`;
    }

    return `${meses} mes${meses !== 1 ? "es" : ""}`;
}
