"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PageHead from "@/components/layout/PageHead";

import UserTable from "@/features/usuarios/components/client/UserTable";
import UserModal from "@/features/usuarios/components/client/UserModal";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import UserModalSkeleton from "@/features/usuarios/components/client/UserModalSkeleton";
import UserTableSkeleton from "@/features/usuarios/components/client/UserTableSkeleton";

import { useUsuariosQuery } from "@/features/usuarios/hooks/useUsuariosQuery";
import { useUsuarioAdopcionesQuery } from "@/features/usuarios/hooks/useUsuarioAdopcionesQuery";
import { useUsuarioSolicitudesQuery } from "@/features/usuarios/hooks/useUsuarioSolicitudesQuery";

import { useUsuariosPageState } from "@/features/usuarios/hooks/useUsuariosPageState";

export default function UsuariosPage() {
  const isMobile = useIsMobile();
  const USERS_PER_PAGE = isMobile ? 5 : 10;

  const { data: usuariosData, isLoading: loadingUsuarios } = useUsuariosQuery();
  const usuarios = usuariosData ?? [];

  // 🔥 Hook nuevo que concentra toda la lógica
  const {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    paginated,
    totalPages,
    filtrados,
    selected,
    modalOpen,
    setModalOpen,
    abrirUsuario,
  } = useUsuariosPageState(usuarios, USERS_PER_PAGE);

  const selectedId = selected?.id ?? "";
  const { data: adopcionesData = [], isLoading: loadingAdopciones } = useUsuarioAdopcionesQuery(selectedId);
  const { data: solicitudesData = [], isLoading: loadingSolicitudes } = useUsuarioSolicitudesQuery(selectedId);

  return (
    <div className="space-y-6">
      <PageHead title="Usuarios" subtitle="Listado general de adoptantes." />

      {/* Buscador */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-md rounded-2xl border border-[#EADACB] bg-white px-3 py-2">
          <Search className="h-4 w-4 text-[#8B6F5D]" />
          <input
            placeholder="Buscar usuario..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-[#2B1B12]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-1 border border-[#EADACB] rounded-2xl bg-[#FFF9F3] px-3 py-2 text-sm text-[#BC5F36] font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </button>
      </div>

      {/* Tabla o Skeleton */}
      {loadingUsuarios ? (
        <UserTableSkeleton />
      ) : (
        <>
          <UserTable usuarios={paginated} onSelect={abrirUsuario} />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtrados.length}
            itemsPerPage={USERS_PER_PAGE}
            itemsLabel="usuarios"
            onChange={(n) => {
              setPage(n);
              setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
            }}
          />
        </>
      )}

      <UserModal
        open={modalOpen}
        user={selected}
        isLoading={loadingAdopciones || loadingSolicitudes || !selected}
        solicitudesActivas={solicitudesData}
        adopciones={adopcionesData}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
