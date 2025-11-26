"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActividadItemType } from "../types/dashboard";
import type {
    DocumentoActividadRow,
    CitaAdopcionActividadRow,
    CitaVeterinariaActividadRow,
    MascotaAdoptadaActividadRow,
} from "../types/actividad";

export async function obtenerActividadReciente(
    filtro: "todo" | "documento" | "cita" | "mascota"
): Promise<ActividadItemType[]> {
    const supabase = await createClient();
    const eventos: ActividadItemType[] = [];

    /* DOCUMENTOS */
    if (filtro === "todo" || filtro === "documento") {
        const { data: docs } = await supabase
            .from("documentos")
            .select("created_at, tipo, perfiles(nombres)")
            .returns<DocumentoActividadRow[]>();

        docs?.forEach((d) =>
            eventos.push({
                tipo: "documento",
                mensaje: `${d.perfiles?.nombres ?? "Un usuario"} subió ${d.tipo}`,
                fecha: d.created_at,
            })
        );
    }

    /* CITAS ADOPCIÓN */
    if (filtro === "todo" || filtro === "cita") {
        const { data: citasAdop } = await supabase
            .from("citas_adopcion")
            .select(`
        estado,
        creada_en,
        perfiles:usuario_id(nombres),
        mascotas:mascota_id(nombre)
      `)
            .returns<CitaAdopcionActividadRow[]>();

        citasAdop?.forEach((c) =>
            eventos.push({
                tipo: "cita",
                mensaje: `${c.perfiles?.nombres ?? "Un adoptante"} ${c.estado === "programada" ? "agendó" : "actualizó"
                    } una cita de adopción para "${c.mascotas?.nombre ?? "una mascota"}"`,
                fecha: c.creada_en,
            })
        );
    }

    /* CITAS VETERINARIAS */
    if (filtro === "todo" || filtro === "cita") {
        const { data: citasVet } = await supabase
            .from("citas_veterinarias")
            .select(`
        estado,
        created_at,
        adopciones:adopcion_id(
          adoptante:adoptante_id(nombres),
          mascota:mascota_id(nombre)
        )
      `)
            .returns<CitaVeterinariaActividadRow[]>();

        citasVet?.forEach((c) =>
            eventos.push({
                tipo: "cita",
                mensaje: `${c.adopciones?.adoptante?.nombres ?? "Un usuario"} ${c.estado === "pendiente" ? "agendó" : "actualizó"
                    } una cita veterinaria para "${c.adopciones?.mascota?.nombre ?? "una mascota"
                    }".`,
                fecha: c.created_at,
            })
        );
    }

    /* MASCOTAS ADOPTADAS */
    if (filtro === "todo" || filtro === "mascota") {
        const { data: masc } = await supabase
            .from("mascotas")
            .select("nombre, updated_at")
            .eq("estado", "adoptada")
            .returns<MascotaAdoptadaActividadRow[]>();

        masc?.forEach((m) =>
            eventos.push({
                tipo: "mascota",
                mensaje: `La mascota "${m.nombre}" ha sido adoptada.`,
                fecha: m.updated_at,
            })
        );
    }

    eventos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return eventos.slice(0, 8);
}
