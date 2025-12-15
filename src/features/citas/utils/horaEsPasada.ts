export function horaEsPasada(hora: string, fechaSeleccionada?: Date): boolean {
    if (!fechaSeleccionada) return false;

    const hoy = new Date();
    const esHoy =
        fechaSeleccionada.getFullYear() === hoy.getFullYear() &&
        fechaSeleccionada.getMonth() === hoy.getMonth() &&
        fechaSeleccionada.getDate() === hoy.getDate();

    if (!esHoy) return false;

    const [h, m] = hora.split(":").map(Number);

    const fechaHora = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate(),
        h,
        m,
        0
    );

    return fechaHora < hoy;
}
