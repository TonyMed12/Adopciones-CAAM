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
import { useIsMobile } from "@/hooks/useIsMobile";
import Pagination from "@/components/ui/Pagination";

export default function GestionAdopcionesPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const [rows, setRows] = useState<AdopcionAdminRow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "todas" | AdopcionAdminRow["estado"]
  >("todas");

  /* =============================
     FETCH ADOPCIONES
  ============================= */
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

  /* =============================
     APROBAR / RECHAZAR
  ============================= */
  const aprobar = async (id: string) => {
    const ok = await toastConfirm("¿Estás seguro de aprobar esta adopción?");
    if (!ok) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa.");

      await cambiarEstadoAdopcion({
        id,
        estado: "aprobada",
        admin_responsable: user.id,
        observaciones_admin: "Adopción aprobada por el administrador.",
      });

      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "aprobada" } : r))
      );

      toast.success("Adopción aprobada correctamente.");
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
      const { data: { user } } = await supabase.auth.getUser();
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

  /* =============================
     FILTRO + BUSQUEDA
  ============================= */
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((r) => {
      const matchTexto =
        !q ||
        r.usuarioNombre?.toLowerCase().includes(q) ||
        r.mascotaNombre?.toLowerCase().includes(q);

      const matchEstado =
        filtroEstado === "todas" || r.estado === filtroEstado;

      return matchTexto && matchEstado;
    });
  }, [rows, query, filtroEstado]);

  /* Resetear a página 1 cuando cambia filtro/búsqueda/móvil */
  useEffect(() => {
    setPage(1);
  }, [query, filtroEstado, isMobile]);

  /* =============================
     PAGINACIÓN
  ============================= */
  const totalPages = Math.ceil(filtrados.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    return filtrados.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [filtrados, page, ITEMS_PER_PAGE]);

  /* =============================
     KPIS
  ============================= */
  const totales = {
    pendientes: rows.filter((r) => r.estado === "pendiente").length,
    aprobadas: rows.filter((r) => r.estado === "aprobada").length,
    rechazadas: rows.filter((r) => r.estado === "rechazada").length,
  };

  /* =============================
     RENDER
  ============================= */
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

      {/* =============================
          KPI CHIPS con mismo estilo
      ============================= */}
      <div className="flex flex-wrap gap-3 pt-1">

        {/* Pendientes */}
        <button
          onClick={() => setFiltroEstado("pendiente")}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
            ${filtroEstado === "pendiente"
              ? "bg-yellow-200 text-yellow-900 border-yellow-500 shadow-sm scale-[1.03]"
              : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"}
          `}
        >
          Pendientes: {totales.pendientes}
        </button>

        {/* Aprobadas */}
        <button
          onClick={() => setFiltroEstado("aprobada")}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
            ${filtroEstado === "aprobada"
              ? "bg-green-200 text-green-900 border-green-600 shadow-sm scale-[1.03]"
              : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}
          `}
        >
          Aprobadas: {totales.aprobadas}
        </button>

        {/* Rechazadas */}
        <button
          onClick={() => setFiltroEstado("rechazada")}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
            ${filtroEstado === "rechazada"
              ? "bg-red-200 text-red-900 border-red-600 shadow-sm scale-[1.03]"
              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"}
          `}
        >
          Rechazadas: {totales.rechazadas}
        </button>

        {/* Mostrar todas */}
        {filtroEstado !== "todas" && (
          <button
            onClick={() => setFiltroEstado("todas")}
            className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-white text-[#6b4f40] hover:bg-gray-50"
          >
            Mostrar todas
          </button>
        )}
      </div>

      {/* =============================
          TABLA + MOBILE CARDS
      ============================= */}
      <AdopcionesTable
        items={paginated}
        query={query}
        onQueryChange={setQuery}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onAprobar={aprobar}
        onRechazar={rechazar}
      />

      {/* =============================
          PAGINACIÓN
      ============================= */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={filtrados.length}
        itemsPerPage={ITEMS_PER_PAGE}
        itemsLabel="adopciones"
        onChange={(n) => {
          setPage(n);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 10);
        }}
      />
    </div>
  );
}
