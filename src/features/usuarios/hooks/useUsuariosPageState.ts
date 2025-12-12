import { useState, useEffect } from "react";
import type { Perfil } from "../types/usuarios";

export function useUsuariosPageState() {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");

  const [activo, setActivo] = useState<boolean | null>(null);
  const [conDireccion, setConDireccion] = useState<boolean | null>(null);

  const [uiPage, setUiPage] = useState(1);

  const [selected, setSelected] = useState<Perfil | null>(null);
  const modalOpen = !!selected;

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchTerm);
      setUiPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setUiPage(1);
  }, [activo, conDireccion]);

  return {
    searchTerm,
    setSearchTerm,
    search,

    activo,
    setActivo,
    conDireccion,
    setConDireccion,

    uiPage,
    setUiPage,

    selected,
    setSelected,
    modalOpen,

    abrirUsuario: (u: Perfil) => setSelected(u),
  };
}
