"use client";

import React from "react";
import PageHead from "@/components/layout/PageHead";
import UserTable from "@/features/usuarios/components/client/UserTable";
import UserModal from "@/features/usuarios/components/client/UserModal";
import UserTableSkeleton from "@/features/usuarios/components/client/UserTableSkeleton";
import UserFilters from "@/features/usuarios/components/client/UserFilters";
import Pagination from "@/components/ui/Pagination";

import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

import { useUsuariosQuery } from "@/features/usuarios/hooks/useUsuariosQuery";
import { useUsuarioDetalle } from "@/features/usuarios/hooks/useUsuarioDetalle";
import { useUsuariosPageState } from "@/features/usuarios/hooks/useUsuariosPageState";

const USERS_PER_PAGE = 10;

export default function UsuariosPage() {
  const {
    search,
    searchTerm,
    setSearchTerm,
    uiPage,
    setUiPage,
    selected,
    setSelected,
    modalOpen,
    abrirUsuario,
  } = useUsuariosPageState();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsuariosQuery({ search });

  const usuarios =
    data?.pages.flatMap((page) => page.items) ?? [];

  const pagesLoaded = data?.pages.length ?? 1;

  const totalPages = hasNextPage
    ? pagesLoaded + 1
    : pagesLoaded;

  const paginatedUsuarios = usuarios.slice(
    (uiPage - 1) * USERS_PER_PAGE,
    uiPage * USERS_PER_PAGE
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

  const selectedId = selected?.id ?? null;

  const {
    adopciones,
    solicitudes,
    direccion,
    isLoading: isLoadingModal,
  } = useUsuarioDetalle(selectedId);

  useBodyScrollLock(modalOpen);

  return (
    <div className="space-y-6">
      <PageHead title="Usuarios" subtitle="Listado general de adoptantes." />

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading ? (
        <UserTableSkeleton />
      ) : (
        <>
          <UserTable
            usuarios={paginatedUsuarios}
            onSelect={abrirUsuario}
          />

          <Pagination
            page={uiPage}
            totalPages={totalPages}
            onChange={handlePageChange}
            itemsPerPage={USERS_PER_PAGE}
            totalItems={usuarios.length}
            itemsLabel="usuarios"
          />
        </>
      )}

      {modalOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4 py-8">
            <UserModal
              open
              user={selected}
              direccion={direccion}
              solicitudesActivas={solicitudes}
              adopciones={adopciones}
              isLoading={isLoadingModal}
              onClose={() => setSelected(null)}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
