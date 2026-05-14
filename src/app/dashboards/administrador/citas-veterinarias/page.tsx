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
import {
  CalendarHeart,
  Stethoscope,
  Search,
  Files,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 5;

const FILTROS = [
  {
    id: "todas",
    label: "Todas",
    Icon: Files,
    activeChip:
      "data-[active=true]:bg-slate-100 data-[active=true]:text-slate-800 data-[active=true]:ring-slate-300",
  },
  {
    id: "pendiente",
    label: "Pendientes",
    Icon: Clock,
    activeChip:
      "data-[active=true]:bg-amber-100 data-[active=true]:text-amber-800 data-[active=true]:ring-amber-300",
  },
  {
    id: "aprobada",
    label: "Aprobadas",
    Icon: CheckCircle2,
    activeChip:
      "data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800 data-[active=true]:ring-emerald-300",
  },
  {
    id: "cancelada",
    label: "Canceladas",
    Icon: XCircle,
    activeChip:
      "data-[active=true]:bg-rose-100 data-[active=true]:text-rose-800 data-[active=true]:ring-rose-300",
  },
] as const;

export default function GestionCitasVeterinariasPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile
    ? ITEMS_PER_PAGE_MOBILE
    : ITEMS_PER_PAGE_DESKTOP;

  const { filtro, setFiltro, query, setQuery } = useCitasFilterState();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCitasVeterinariasAdmin({ search: query });

  const { aprobar, cancelar } = useAccionesCitaVeterinaria();

  const [uiPage, setUiPage] = React.useState(1);

  const citas = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const citasOrdenadas = useCitasOrdenadas(citas, filtro, query);

  /* paginación */
  const pagesLoaded = data?.pages.length ?? 1;
  const totalPages = hasNextPage ? pagesLoaded + 1 : pagesLoaded;

  const paginated = citasOrdenadas.slice(
    (uiPage - 1) * ITEMS_PER_PAGE,
    uiPage * ITEMS_PER_PAGE
  );

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < uiPage) {
      setUiPage(nextPage);
      return;
    }
    if (nextPage > pagesLoaded && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
    setUiPage(nextPage);
  };

  React.useEffect(() => {
    setUiPage(1);
  }, [filtro, query]);

  /* KPIs / panel */
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

      {/* ============ FILTROS + BÚSQUEDA ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Filtros */}
        <div className="flex-1 overflow-x-auto custom-scroll -mx-1 px-1">
          <div className="inline-flex items-center gap-2 min-w-max">
            {FILTROS.map((f) => {
              const isActive = filtro === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFiltro(f.id)}
                  data-active={isActive}
                  className={`
                    inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl
                    px-3.5 py-2 text-sm font-semibold transition-all duration-200
                    border border-slate-200 bg-white text-slate-600
                    hover:border-[#f3d6bb] hover:text-[#BC5F36] hover:bg-[#fffaf4]
                    data-[active=true]:ring-1 data-[active=true]:shadow-sm
                    data-[active=true]:border-transparent
                    ${f.activeChip}
                  `}
                >
                  <f.Icon className="h-4 w-4" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Búsqueda */}
        <div className="relative sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar adoptante o mascota..."
            className="
              w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2
              text-sm placeholder:text-slate-400 text-slate-700
              focus:outline-none focus:ring-2 focus:ring-[#BC5F36]/30 focus:border-[#BC5F36]
              transition
            "
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Limpiar búsqueda"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ============ LAYOUT TABLA + PANEL ============ */}
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

      {citasOrdenadas.length > ITEMS_PER_PAGE && (
        <Pagination
          page={uiPage}
          totalPages={totalPages}
          onChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={citasOrdenadas.length}
          itemsLabel="citas"
        />
      )}
    </div>
  );
}
