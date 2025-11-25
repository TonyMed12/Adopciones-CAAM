export function calcularRango(page: number, limit: number) {
    const desde = (page - 1) * limit;
    const hasta = desde + limit - 1;
    return { desde, hasta };
}
