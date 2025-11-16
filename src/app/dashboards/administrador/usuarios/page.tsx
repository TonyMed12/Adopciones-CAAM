"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PageHead from "@/components/layout/PageHead";

import {
  listarUsuarios,
  listarAdopcionesPorUsuario,
  listarSolicitudesActivasPorUsuario,
} from "@/usuarios/usuarios-actions";

import type { PerfilConDireccion } from "@/usuarios/usuarios";

import UserTable from "@/components/usuario/UserTable";
import UserModal from "@/components/usuario/UserModal";
import Pagination from "@/components/ui/Pagination";

import { useIsMobile } from "@/hooks/useIsMobile";

export default function UsuariosPage() {
  const isMobile = useIsMobile();

  const USERS_PER_PAGE = isMobile ? 5 : 20;

  const [query, setQuery] = useState("");
  const [usuarios, setUsuarios] = useState<PerfilConDireccion[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<PerfilConDireccion | null>(null);
  const [adopciones, setAdopciones] = useState<any[]>([]);
  const [solicitudesActivas, setSolicitudesActivas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchTerm);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listarUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;

    return usuarios.filter((u) =>
      [u.nombres, u.apellido_paterno, u.apellido_materno, u.email]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(q))
    );
  }, [query, usuarios]);

  const totalPages = Math.ceil(filtrados.length / USERS_PER_PAGE);

  const paginated = useMemo(() => {
    return filtrados.slice(
      (page - 1) * USERS_PER_PAGE,
      page * USERS_PER_PAGE
    );
  }, [filtrados, page, USERS_PER_PAGE]);

  const abrirUsuario = async (u: PerfilConDireccion) => {
    setSelected(u);
    setModalOpen(true);

    setAdopciones([]);
    setSolicitudesActivas([]);

    try {
      const data1 = await listarAdopcionesPorUsuario(u.id);
      setAdopciones(data1);

      const data2 = await listarSolicitudesActivasPorUsuario(u.id);
      setSolicitudesActivas(data2);
    } catch (err) {
      console.error(err);
    }
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

      {loading ? (
        <div className="rounded-xl border border-dashed border-[#EADACB] bg-white py-10 text-center text-sm text-[#8B6F5D]">
          Cargando usuarios...
        </div>
      ) : (
        <>
          <UserTable usuarios={paginated} onSelect={abrirUsuario} />

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(n) => setPage(n)}
            isMobile={isMobile}
          />
        </>
      )}

      <UserModal
        open={modalOpen}
        user={selected}
        solicitudesActivas={solicitudesActivas}
        adopciones={adopciones}
        onClose={() => setModalOpen(false)}
        onDeleteClick={() => selected}
      />
    </div>
  );
}
