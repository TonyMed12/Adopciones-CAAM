"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotasTable from "@/features/mascotas/components/client/MascotasTable";
import { useMascotasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasInfiniteQuery";
import { useRouter } from "next/navigation";
import { formatearMascotaParaTabla } from "@/features/seguimiento/utils/formatearMascotaParaTabla";
import UserTableSkeleton from "@/components/ui/UserTableSkeleton";

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

  /** 🔽 Aplanar páginas */
  const mascotas = data?.pages.flatMap((p) => p.items) ?? [];

  /** 🔢 Total real (para paginación) */
  const totalItems = data?.pages?.[0]?.total ?? 0;

  /** ⏭️ Cargar más páginas cuando se necesite */
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

  /** 🧩 Formateo para tabla */
  const dataTabla = useMemo(() => {
    return mascotas.map(formatearMascotaParaTabla);
  }, [mascotas]);

  return (
    <>
      <PageHead
        title="Seguimiento de Mascotas"
        subtitle="Administra y revisa los seguimientos de cada mascota 🐾"
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
        <div className="p-4 text-red-600">
          Error: {error.message}
        </div>
      ) : isLoading ? (
        <UserTableSkeleton />
      ) : (
        <div className="p-4">
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
        </div>
      )}
    </>
  );
}
