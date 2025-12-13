"use server";

import { supabase } from "@/lib/supabase/client";
import type { Seguimiento } from "../types/seguimiento";
import { createClient } from "@/lib/supabase/server";
import dayjs from "dayjs";

export async function listarSeguimientosPorMascota(
  mascotaId: string
): Promise<Seguimiento[]> {
  const { data, error } = await supabase
    .from("seguimiento_adopcion")
    .select(
      `
      id,
      adopcion_id,
      fecha_seguimiento,
      observaciones,
      recomendaciones,
      satisfaccion_adoptante,
      estado_mascota,
      problemas_reportados,
      fotos_actuales,
      completado,
      realizado_por,
      created_at,
      adopciones:adopciones (
        id,
        solicitudes_adopcion (
          mascota_id
        )
      )
    `
    )
    .eq("adopciones.solicitudes_adopcion.mascota_id", mascotaId)
    .order("fecha_seguimiento", { ascending: true });

  if (error) {
    console.error("❌ Error listando seguimientos:", error);
    throw new Error("Error obteniendo los seguimientos");
  }

  return (data ?? []) as Seguimiento[];
}

export async function obtenerSeguimientoMascotasUsuario() {
  const supabase = await createClient();

  // 1️⃣ Usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // 2️⃣ Perfil
  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (perfilError || !perfil) {
    throw new Error("Perfil no encontrado");
  }

  // 3️⃣ Adopciones del usuario
  const { data: adopciones, error: adopcionesError } = await supabase
    .from("adopciones")
    .select(`
      id,
      fecha_adopcion,
      solicitudes_adopcion (
        usuario_id,
        mascota_id,
        mascotas (
          nombre,
          raza_id,
          imagen_url
        )
      )
    `)
    .order("fecha_adopcion", { ascending: false });

  if (adopcionesError) {
    throw new Error("Error al obtener adopciones");
  }

  const adopcionesUsuario = (adopciones || []).filter(
    (a) => a.solicitudes_adopcion?.usuario_id === perfil.id
  );

  // 4️⃣ Construcción del modelo final
  const resultado = await Promise.all(
    adopcionesUsuario.map(async (a) => {
      const mascota = a.solicitudes_adopcion?.mascotas;
      const fechaBase = dayjs(a.fecha_adopcion);

      const fechasProgramadas = [
        { nombre: "1 semana", fecha: fechaBase.add(7, "day") },
        { nombre: "1 mes", fecha: fechaBase.add(1, "month") },
        { nombre: "2 meses", fecha: fechaBase.add(2, "month") },
        { nombre: "6 meses", fecha: fechaBase.add(6, "month") },
      ];

      // 5️⃣ Seguimientos existentes
      const { data: seguimientosDB } = await supabase
        .from("seguimiento_adopcion")
        .select("fecha_seguimiento, completado")
        .eq("adopcion_id", a.id);

      const completados = new Set(
        (seguimientosDB || []).map((s) =>
          dayjs(s.fecha_seguimiento).format("YYYY-MM-DD")
        )
      );

      const hoy = dayjs();

      const seguimientos = fechasProgramadas.map((f) => {
        const fecha = f.fecha.startOf("day");
        const fechaStr = fecha.format("YYYY-MM-DD");
        const hoy = dayjs().startOf("day");

        const diff = fecha.diff(hoy, "day");

        let estado: "Pendiente" | "Activo" | "Próximo" | "Completado" =
          "Pendiente";

        if (completados.has(fechaStr)) {
          estado = "Completado";
        } else if (diff <= 0) {
          estado = "Activo";
        } else if (diff <= 3) {
          estado = "Próximo";
        }

        return {
          nombre: f.nombre,
          fecha: fechaStr,
          estado,
        };
      });

      return {
        id: a.id,
        nombre: mascota?.nombre ?? "Sin nombre",
        raza: mascota?.raza_id ?? "Sin raza",
        imagen: mascota?.imagen_url ?? "/placeholder.png",
        fechaAdopcion: fechaBase.format("DD/MM/YYYY"),
        seguimientos,
      };
    })
  );

  return resultado;
}