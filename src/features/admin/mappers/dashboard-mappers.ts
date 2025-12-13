import type { DashboardStats, DashboardPendiente } from "../types/dashboard";

export function mapPendientes(stats: DashboardStats): DashboardPendiente[] {
    const list: DashboardPendiente[] = [];

    if (stats.documentosPendientes > 0)
        list.push({
            id: 1,
            descripcion: `${stats.documentosPendientes} documentos por validar`,
            link: "/dashboards/administrador/documentos",
        });

    if (stats.citasAdopPend > 0)
        list.push({
            id: 2,
            descripcion: `${stats.citasAdopPend} citas de adopción por aprobar`,
            link: "/dashboards/administrador/gestion_citas",
        });

    if (stats.citasVetPend > 0)
        list.push({
            id: 3,
            descripcion: `${stats.citasVetPend} citas veterinarias por aprobar`,
            link: "/dashboards/administrador/gestion_citas",
        });

    if (stats.usuariosProceso > 0)
        list.push({
            id: 4,
            descripcion: `${stats.usuariosProceso} usuarios en revisión`,
            link: "/dashboards/administrador/usuarios",
        });

    return list;
}
