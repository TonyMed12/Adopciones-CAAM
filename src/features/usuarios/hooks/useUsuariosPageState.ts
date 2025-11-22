"use client";

import { useState, useEffect, useMemo } from "react";
import type { PerfilConDireccion } from "../types/usuarios";

export function useUsuariosPageState(usuarios: PerfilConDireccion[], usersPerPage: number) {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<PerfilConDireccion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Debounce búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchTerm);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filtrado
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;

    return usuarios.filter((u) =>
      [u.nombres, u.apellido_paterno, u.apellido_materno, u.email]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(q))
    );
  }, [query, usuarios]);

  const totalPages = Math.ceil(filtrados.length / usersPerPage) || 1;

  const paginated = useMemo(() => {
    return filtrados.slice(
      (page - 1) * usersPerPage,
      page * usersPerPage
    );
  }, [filtrados, page, usersPerPage]);

  const abrirUsuario = (user: PerfilConDireccion) => {
    setSelected(user);
    setModalOpen(true);
  };

  return {
    // inputs
    searchTerm,
    setSearchTerm,
    query,

    // pagination
    page,
    setPage,
    paginated,
    totalPages,
    filtrados,

    // modal
    selected,
    setSelected,
    modalOpen,
    setModalOpen,
    abrirUsuario,
  };
}
