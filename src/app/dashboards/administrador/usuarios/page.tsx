"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PageHead from "@/components/layout/PageHead";

import type { PerfilConDireccion } from "@/features/usuarios/types/usuarios";

import UserTable from "@/features/usuarios/components/client/UserTable";
import UserModal from "@/features/usuarios/components/client/UserModal";
import Pagination from "@/components/ui/Pagination";

import { useIsMobile } from "@/hooks/useIsMobile";

// 🔥 Hooks de TanStack para usuarios
import { useUsuariosQuery } from "@/features/usuarios/hooks/useUsuariosQuery";
import { useUsuarioAdopcionesQuery } from "@/features/usuarios/hooks/useUsuarioAdopcionesQuery";
import { useUsuarioSolicitudesQuery } from "@/features/usuarios/hooks/useUsuarioSolicitudesQuery";

export default function UsuariosPage() {
  const isMobile = useIsMobile();

  const USERS_PER_PAGE = isMobile ? 5 : 10;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PerfilConDireccion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 🚀 TanStack: obtener TODOS los usuarios
  const {
    data: usuariosData,
    isLoading: loadingUsuarios,
    isError,
    error,
  } = useUsuariosQuery();

  const usuarios = usuariosData ?? [];

  // 🔁 Debounce de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchTerm);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🧠 Filtro en cliente
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;

    return usuarios.filter((u) =>
      [u.nombres, u.apellido_paterno, u.apellido_materno, u.email]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(q))
    );
  }, [query, usuarios]);

  const totalPages = Math.ceil(filtrados.length / USERS_PER_PAGE) || 1;

  const paginated = useMemo(() => {
    return filtrados.slice(
      (page - 1) * USERS_PER_PAGE,
      page * USERS_PER_PAGE
    );
  }, [filtrados, page, USERS_PER_PAGE]);

  // 🐾 Datos adicionales del usuario seleccionado (Adopciones + Solicitudes)
  const selectedId = selected?.id ?? "";

  const { data: adopcionesData = [] } = useUsuarioAdopcionesQuery(selectedId);
  const { data: solicitudesData = [] } = useUsuarioSolicitudesQuery(selectedId);

  const abrirUsuario = (u: PerfilConDireccion) => {
    setSelected(u);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Usuarios"
        subtitle="Listado general de adoptantes."
      />

      {/* Buscador + Filtros */}
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

      {/* Estados de carga / error / tabla */}
      {loadingUsuarios ? (
        <div className="rounded-xl border border-dashed border-[#EADACB] bg-white py-10 text-center text-sm text-[#8B6F5D]">
          Cargando usuarios...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-dashed border-red-200 bg-white py-10 text-center text-sm text-red-700">
          Ocurrió un error al cargar usuarios:{" "}
          {(error as Error)?.message ?? "Error desconocido"}
        </div>
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

              // ❤️ Scroll hacia arriba
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 10);
            }}
          />
        </>
      )}

      <UserModal
        open={modalOpen}
        user={selected}
        solicitudesActivas={solicitudesData}
        adopciones={adopcionesData}
        onClose={() => setModalOpen(false)}
        onDeleteClick={() => selected}
      />
    </div>
  );
}
