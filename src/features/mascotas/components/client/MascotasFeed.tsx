"use client";

import React from "react";
import Link from "next/link";
import { SearchX, PawPrint } from "lucide-react";
import { useMascotasPublicasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasPublicasInfiniteQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import MascotaCard from "@/features/mascotas/components/client/MascotaCard";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import MascotasFeedSkeleton from "@/features/mascotas/components/client/MascotasFeedSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

type Props = {
  search: string;
  especie: string;
  sexo: string;
  onView: (m: Mascota) => void;
  onAdopt: (m: Mascota) => void;
  limit?: number;
  disableInfinite?: boolean;
};

export default function MascotasFeed({
  search,
  especie,
  sexo,
  onView,
  onAdopt,
}: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMascotasPublicasInfiniteQuery({ search, especie, sexo });

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  const mascotas = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return <MascotasFeedSkeleton />;
  }

  if (mascotas.length === 0) {
    const hasFilters =
      search.trim() !== "" || especie !== "Todas" || sexo !== "Todos";

    return (
      <EmptyState
        icon={hasFilters ? <SearchX size={32} /> : <PawPrint size={32} />}
        title={
          hasFilters
            ? "No encontramos mascotas con esos filtros"
            : "Aún no hay mascotas disponibles"
        }
        description={
          hasFilters
            ? "Intenta ajustar los filtros o limpiarlos para ver más opciones."
            : "Vuelve pronto, siempre tenemos nuevos compañeros listos para encontrar hogar."
        }
      />
    );
  }

  return (
    <>
      <section
        className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Lista de mascotas"
      >
        {mascotas.map((m) => (
          <MascotaCard
            key={m.id}
            m={m}
            onView={() => onView(m)}
            onAdopt={() => onAdopt(m)}
          />
        ))}
      </section>

      {/* Sentinel para infinite scroll */}
      {hasNextPage && <div ref={loadMoreRef} className="h-10 pointer-events-none" />}

      {/* Loader incremental */}
      {isFetchingNextPage && (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-[#BC5F36] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#7a5c49] font-medium">
            Cargando más mascotas...
          </p>
        </div>
      )}

      {/* Final del listado */}
      {!hasNextPage && mascotas.length > 6 && (
        <div className="py-8 text-center">
          <p className="text-sm text-[#7a5c49]">
            Has llegado al final del catálogo 🐾
          </p>
        </div>
      )}
    </>
  );
}
