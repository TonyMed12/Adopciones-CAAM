"use client";

import React from "react";
import { useMascotasPublicasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasPublicasInfiniteQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import MascotaCard from "@/features/mascotas/components/client/MascotaCard";
import type { Mascota } from "@/features/mascotas/types/mascotas";

type Props = {
    search: string;
    especie: string;
    sexo: string;
    onView: (m: Mascota) => void;
    onAdopt: (m: Mascota) => void;
};

export default function MascotasFeed({
    search,
    especie,
    sexo,
    onView,
    onAdopt,
}: Props) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useMascotasPublicasInfiniteQuery({
        search,
        especie,
        sexo,
    });

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        onLoadMore: fetchNextPage,
    });

    const mascotas = data?.pages.flatMap((p) => p.items) ?? [];

    // Loading inicial
    if (isLoading) {
        return (
            <div className="py-12 text-center text-[#7a5c49]">
                Cargando mascotas...
            </div>
        );
    }

    return (
        <>
            <section
                className="
          grid gap-3
          [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]
        "
            >
                {mascotas.map((m) => (
                    <MascotaCard
                        key={m.id}
                        m={m}
                        onView={() => onView(m)}
                        onAdopt={() => onAdopt(m)}
                    />
                ))}

                {mascotas.length === 0 && (
                    <div className="col-span-full py-12 text-center text-[#7a5c49]">
                        <div className="text-4xl mb-2 opacity-80">🔎</div>
                        <p className="font-semibold">
                            No encontramos mascotas con esos filtros
                        </p>
                    </div>
                )}
            </section>

            {/* Sentinel */}
            {hasNextPage && (
                <div
                    ref={loadMoreRef}
                    className="h-10 pointer-events-none"
                />
            )}

            {/* Loader incremental tipo feed */}
            {isFetchingNextPage && (
                <div className="py-6 flex justify-center opacity-40 transition-opacity duration-300">
                    <div className="w-4 h-4 border-2 border-[#BC5F36] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </>
    );
}
