"use client";

import PageHead from "@/components/layout/PageHead";
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
  const { filtro, setFiltro, query, setQuery } = useCitasFilterState();
  const { data: citas = [], isLoading } = useCitasVeterinariasAdmin();
  const { aprobar, cancelar } = useAccionesCitaVeterinaria();

  const citasOrdenadas = useCitasOrdenadas(citas, filtro, query);

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
      <PageHead title="Citas Veterinarias" subtitle="Administra citas veterinarias" />

      <CitasVeterinariasKPIs totales={totales} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        <CitasVeterinariasTablaAdmin
          citas={citasOrdenadas}
          onAprobar={aprobar}
          onCancelar={cancelar}
        />

        <CitasVeterinariasCardsAdmin
          citas={citasOrdenadas}
          onAprobar={aprobar}
          onCancelar={cancelar}
        />

        <CitasVeterinariasPanelLateral citas={citasOrdenadas} proximas={proximas} />
      </div>
    </div>
  );
}
