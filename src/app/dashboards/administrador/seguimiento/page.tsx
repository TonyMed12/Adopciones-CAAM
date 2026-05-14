"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotasTable from "@/features/mascotas/components/client/MascotasTable";
import { useMascotasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasInfiniteQuery";
import { useRouter } from "next/navigation";
import { formatearMascotaParaTabla } from "@/features/seguimiento/utils/formatearMascotaParaTabla";
import UserTableSkeleton from "@/components/ui/UserTableSkeleton";
import { ClipboardList, PawPrint } from "lucide-react";

export default function SeguimientoAdminPage() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");
  const [page, setPage] = useState(1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useMascotasInfiniteQuery({
    q,
    especie,
    sexo,
  });

  const mascotas = data?.pages.flatMap((p) => p.items) ?? [];

  const totalItems = data?.pages?.[0]?.total ?? 0;

  useEffect(() => {
    const ITEMS_PER_PAGE = 10;
    const totalNecesario = page * ITEMS_PER_PAGE;

    if (
      mascotas.length < totalNecesario &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [page, mascotas.length, hasNextPage, isFetchingNextPage]);

  const dataTabla = useMemo(() => {
    return mascotas.map(formatearMascotaParaTabla);
  }, [mascotas]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHead
        title="Seguimiento de mascotas"
        eyebrow={
          <>
            <ClipboardList size={12} />
            <span>Historial post-adopción</span>
          </>
        }
        icon={<PawPrint size={20} />}
        subtitle="Administra y revisa los reportes de seguimiento de cada mascota adoptada."
      />

      <Filters
        q={q}
        onQ={setQ}
        especie={especie}
        onEspecie={setEspecie}
        sexo={sexo}
        onSexo={setSexo}
        ESPECIES={["Perro", "Gato", "Otro"]}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Error: {error.message}
        </div>
      ) : isLoading ? (
        <UserTableSkeleton />
      ) : (
        <MascotasTable
          mode="seguimiento"
          data={dataTabla}
          page={page}
          onPageChange={setPage}
          totalItems={totalItems}
          actions={{
            onViewCard: (rowMascota) =>
              router.push(
                `/dashboards/administrador/seguimiento/${rowMascota.id}`
              ),
          }}
          deleteDisabledForId={() => true}
        />
      )}
    </div>
  );
}
