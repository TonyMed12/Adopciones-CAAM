"use client";

import { useMemo, useState, useEffect } from "react";
import AdopcionesTable from "@/components/adopciones/AdopcionesTable";
import {
  listarAdopcionesAdmin,
  cambiarEstadoAdopcion,
} from "@/adopciones/adopciones-actions";
import type { AdopcionAdminRow } from "@/adopciones/adopciones";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import PageHead from "@/components/layout/PageHead";

export default function GestionAdopcionesPage() {
  const [rows, setRows] = useState<AdopcionAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "todas" | AdopcionForm["estado"]
  >("todas");

  useEffect(() => {
    async function fetchAdopciones() {
      try {
        const data = await listarAdopcionesAdmin();
        setRows(data);
      } catch (error) {
        console.error("Error cargando adopciones:", error);
        toast.error("Error al cargar las adopciones.");
      } finally {
        setLoading(false);
      }
    }

    fetchAdopciones();
  }, []);

  const aprobar = async (id: string) => {
    const confirmed = await toastConfirm(
      "¿Estás seguro de aprobar esta adopción?"
    );
    if (!confirmed) return;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay sesión activa.");

      // 1️⃣ Cambiar estado en BD
      await cambiarEstadoAdopcion({
        id,
        estado: "aprobada",
        admin_responsable: user.id,
        observaciones_admin: "Adopción aprobada por el administrador.",
      });

      // 2️⃣ Actualizar la tabla en pantalla
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "aprobada" } : r))
      );

      // 3️⃣ Tomar datos de esa adopción para el correo
      const adopcion = rows.find((r) => r.id === id);
      // Ajusta estos campos a cómo se llaman realmente en tu tabla:
      const email = adopcion?.adoptante_correo || adopcion?.email || "";
      const nombre = adopcion?.adoptante_nombre || "Adoptante";
      const nombreMascota = adopcion?.mascota_nombre || "tu mascota";

      if (email) {
        await fetch("/api/email/adopcion-aprobada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            nombre,
            nombreMascota,
          }),
        });
      }

      toast.success("Adopción aprobada y correo enviado.");
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar la adopción.");
    }
  };

  const rechazar = async (id: string) => {
    const motivo = prompt("Motivo del rechazo:");
    if (motivo === null) return;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay sesión activa.");

      await cambiarEstadoAdopcion({
        id,
        estado: "rechazada",
        admin_responsable: user.id,
        observaciones_admin: motivo || "Sin motivo.",
      });

      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "rechazada" } : r))
      );
      toast.success("Adopción rechazada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al rechazar la adopción.");
    }
  };

  // (opcional) KPIs rápidos
  const totales = useMemo(
    () => ({
      pendientes: rows.filter((r) => r.estado === "pendiente").length,
      aprobadas: rows.filter((r) => r.estado === "aprobada").length,
      rechazadas: rows.filter((r) => r.estado === "rechazada").length,
    }),
    [rows]
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-[#7a5c49] animate-pulse">
        Cargando adopciones...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <PageHead
        title="Gestión de Adopciones"
        subtitle="Revisa y administra las solicitudes de adopción."
      />

      {/* KPIs opcionales, mismo estilo de “citas” */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
          Pendientes: {totales.pendientes}
        </span>
        <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
          Aprobadas: {totales.aprobadas}
        </span>
        <span className="px-2 py-1 text-sm rounded-md border bg-red-50 text-red-700">
          Rechazadas: {totales.rechazadas}
        </span>
      </div>

      <AdopcionesTable
        items={rows}
        query={query}
        onQueryChange={setQuery}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onAprobar={aprobar}
        onRechazar={rechazar}
      />
    </div>
  );
}
