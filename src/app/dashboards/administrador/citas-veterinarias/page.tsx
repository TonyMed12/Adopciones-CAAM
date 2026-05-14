"use client";

import React from "react";
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
import { CalendarHeart, Stethoscope } from "lucide-react";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 5;

export default function GestionCitasVeterinariasPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile
    ? ITEMS_PER_PAGE_MOBILE
    : ITEMS_PER_PAGE_DESKTOP;

  const { filtro, query } = useCitasFilterState();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCitasVeterinariasAdmin({ search: query });

  const { aprobar, cancelar } = useAccionesCitaVeterinaria();

  /* ===============================
     UI PAGE (igual que Usuarios)
  =============================== */
  const [uiPage, setUiPage] = React.useState(1);

  /* ===============================
     APLANAR PÁGINAS
  =============================== */
  const citas = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  /* ===============================
     FILTRADO / ORDEN
  =============================== */
  const citasOrdenadas = useCitasOrdenadas(citas, filtro, query);

  /* ===============================
     PAGINACIÓN UI
  =============================== */
  const pagesLoaded = data?.pages.length ?? 1;

  const totalPages = hasNextPage
    ? pagesLoaded + 1
    : pagesLoaded;

  const paginated = citasOrdenadas.slice(
    (uiPage - 1) * ITEMS_PER_PAGE,
    uiPage * ITEMS_PER_PAGE
  );

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < uiPage) {
      setUiPage(nextPage);
      return;
    }

    if (
      nextPage > pagesLoaded &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      await fetchNextPage();
    }

    setUiPage(nextPage);
  };

  /* ===============================
     KPIs / PANEL
  =============================== */
  const totales = {
    pendientes: citas.filter((c) => c.estado === "pendiente").length,
    aprobadas: citas.filter((c) => c.estado === "aprobada").length,
    canceladas: citas.filter((c) => c.estado === "cancelada").length,
  };

  const proximas = citasOrdenadas
    .filter((c) => new Date(c.fecha_cita) > new Date())
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageHead
          title="Citas veterinarias"
          eyebrow={
            <>
              <Stethoscope size={12} />
              <span>Atención médica</span>
            </>
          }
          icon={<CalendarHeart size={20} />}
          subtitle="Administra las citas veterinarias agendadas."
        />
        <CitasVeterinariasSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHead
        title="Citas veterinarias"
        eyebrow={
          <>
            <Stethoscope size={12} />
            <span>Atención médica</span>
          </>
        }
        icon={<CalendarHeart size={20} />}
        subtitle="Administra las citas veterinarias agendadas."
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
        page={uiPage}
        totalPages={totalPages}
        onChange={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={citasOrdenadas.length}
        itemsLabel="citas"
      />
    </div>
  );
}
