"use client";

import { useState, useMemo, useEffect } from "react";

import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useCitasVeterinariasAdmin } from "@/features/citas/queries/citas-veterinarias-queries";
import { useAccionesCitaVeterinaria } from "@/features/citas/hooks/useAccionesCitaVeterinaria";
import { useCitasFilterState } from "@/features/citas/hooks/useCitasVeterinariasFilterState";
import { useCitasOrdenadas } from "@/features/citas/hooks/useCitasVeterinariasOrdenadas";

import CitasVeterinariasSkeleton from "@/features/citas/components/client/veterinarias/CitasVeterinariasSkeleton";
import { CitasVeterinariasKPIs } from "@/features/citas/components/client/veterinarias/CitasVeterinariasKPIs";
import { CitasVeterinariasTablaAdmin } from "@/features/citas/components/client/veterinarias/CitasVeterinariasTableAdmin";
import { CitasVeterinariasCardsAdmin } from "@/features/citas/components/client/veterinarias/CitasVeterinariasCardsAdmin";
import { CitasVeterinariasPanelLateral } from "@/features/citas/components/client/veterinarias/CitasVeterinariasPanelLateral";

export default function GestionCitasVeterinariasPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const { filtro, setFiltro, query, setQuery } = useCitasFilterState();
  const { data: citas = [], isLoading } = useCitasVeterinariasAdmin();
  const { aprobar, cancelar } = useAccionesCitaVeterinaria();

  const [page, setPage] = useState(1);

  const citasOrdenadas = useCitasOrdenadas(citas, filtro, query);

  useEffect(() => {
    setPage(1);
  }, [filtro, query, isMobile]);

  const totalPages = Math.ceil(citasOrdenadas.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    return citasOrdenadas.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [citasOrdenadas, page, ITEMS_PER_PAGE]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <PageHead
          title="Citas Veterinarias"
          subtitle="Administra las citas veterinarias agendadas por los adoptantes."
        />
        <CitasVeterinariasSkeleton />
      </div>
    );
  }

  const totales = {
    pendientes: citas.filter((c) => c.estado === "pendiente").length,
    aprobadas: citas.filter((c) => c.estado === "aprobada").length,
    canceladas: citas.filter((c) => c.estado === "cancelada").length,
  };

  const proximas = citasOrdenadas
    .filter((c) => new Date(c.fecha_cita) > new Date())
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      <PageHead
        title="Citas Veterinarias"
        subtitle="Administra citas veterinarias"
      />

      <CitasVeterinariasKPIs totales={totales} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        <CitasVeterinariasTablaAdmin
          citas={paginated}
          onAprobar={aprobar}
          onCancelar={cancelar}
        />

        <CitasVeterinariasCardsAdmin
          citas={paginated} 
          onAprobar={aprobar}
          onCancelar={cancelar}
        />

        <CitasVeterinariasPanelLateral
          citas={citasOrdenadas}
          proximas={proximas}
        />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={citasOrdenadas.length}
        itemsPerPage={ITEMS_PER_PAGE}
        itemsLabel="citas"
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
