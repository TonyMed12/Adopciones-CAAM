"use client";

import { useMemo, useState, useEffect } from "react";
import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import AdopcionesTable from "@/features/adopciones/components/client/AdopcionesTable";
import { RechazoAdopcionModal } from "@/features/adopciones/components/client/RechazoAdopcionModal";
import { AdopcionesKPIs } from "@/features/adopciones/components/client/AdopcionesKPIs";
import AdopcionesTableSkeleton from "@/features/adopciones/components/client/AdopcionesTableSkeleton";
import { useAdopcionesAdminQuery } from "@/features/adopciones/hooks/useAdopcionesAdminQuery";
import { useCambiarEstadoAdopcion } from "@/features/adopciones/hooks/useCambiarEstadoAdopcion";

export default function GestionAdopcionesPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const { data: rows = [], isLoading: loading } = useAdopcionesAdminQuery();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<"todas" | "pendiente" | "aprobada" | "rechazada">("todas");

  const [rechazoOpen, setRechazoOpen] = useState(false);
  const [rechazoMotivo, setRechazoMotivo] = useState("");
  const [rechazoId, setRechazoId] = useState<string | null>(null);

  const cambiarEstado = useCambiarEstadoAdopcion();

  const aprobar = (id: string) => {
    cambiarEstado.mutate({
      id,
      estado: "aprobada",
      observaciones_admin: "Adopción aprobada por el administrador.",
    });
  };

  const rechazar = (id: string) => {
    setRechazoId(id);
    setRechazoMotivo("");
    setRechazoOpen(true);
  };

  const confirmarRechazo = () => {
    if (!rechazoId) return;

    cambiarEstado.mutate({
      id: rechazoId,
      estado: "rechazada",
      observaciones_admin: rechazoMotivo.trim(),
    });

    setRechazoOpen(false);
  };

  const filtrados = useMemo(() => {
    const q = query.toLowerCase().trim();

    return rows.filter((r) => {
      const matchTexto =
        !q ||
        r.usuarioNombre?.toLowerCase().includes(q) ||
        r.mascotaNombre?.toLowerCase().includes(q);

      const matchEstado = filtroEstado === "todas" || r.estado === filtroEstado;

      return matchTexto && matchEstado;
    });
  }, [rows, query, filtroEstado]);

  useEffect(() => {
    setPage(1);
  }, [query, filtroEstado, isMobile]);

  const totalPages = Math.ceil(filtrados.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    return filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [filtrados, page, ITEMS_PER_PAGE]);

  const totales = {
    pendientes: rows.filter((r) => r.estado === "pendiente").length,
    aprobadas: rows.filter((r) => r.estado === "aprobada").length,
    rechazadas: rows.filter((r) => r.estado === "rechazada").length,
  };

  return (
  <div className="p-6 space-y-4">
    <PageHead
      title="Gestión de Adopciones"
      subtitle="Revisa y administra las solicitudes de adopción."
    />

    {loading ? (
      <>
        <AdopcionesKPIs.Skeleton />
        <AdopcionesTableSkeleton />
      </>
    ) : (
      <>
        <RechazoAdopcionModal
          open={rechazoOpen}
          motivo={rechazoMotivo}
          onChangeMotivo={setRechazoMotivo}
          onClose={() => setRechazoOpen(false)}
          onConfirm={confirmarRechazo}
        />

        <AdopcionesKPIs
          totales={totales}
          filtroEstado={filtroEstado}
          onChange={setFiltroEstado}
        />

        <AdopcionesTable
          items={paginated}
          query={query}
          onQueryChange={setQuery}
          filtroEstado={filtroEstado}
          onFiltroEstadoChange={setFiltroEstado}
          onAprobar={aprobar}
          onRechazar={rechazar}
        />

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
      </>
    )}
  </div>
);

}
