"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import DocumentosTable from "@/components/documentos/DocumentosTable";
import VisorDocumento from "@/components/documentos/VisorDocumento";
import ModalRechazo from "@/components/documentos/ModalRechazo";
import type { Documento } from "@/components/documentos/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import Pagination from "@/components/ui/Pagination";
import { P } from "node_modules/framer-motion/dist/types.d-BJcRxCew";

export default function GestionDocumentosPage() {
  const supabase = createClient();
  const isMobile = useIsMobile();

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [visorActivo, setVisorActivo] = useState<string | null>(null);
  const [rechazoActivo, setRechazoActivo] = useState<Documento | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const USERS_PER_PAGE = isMobile ? 5 : 10;

  // ================================================================
  // 🔥 FETCH DOCUMENTOS (solo corregimos el JOIN)
  // ================================================================
  async function fetchDocumentos() {
    setLoading(true);

    let query = supabase
      .from("documentos")
      .select(
        `
        id,
        tipo,
        url,
        status,
        created_at,
        observacion_admin,
        perfil_id,
        perfiles:perfil_id (
          nombres,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (filtro !== "todos") query = query.eq("status", filtro);

    const { data } = await query;

    // Normalizar perfiles (antes venía [] y causaba "desconocido")
    const normalizados = (data || []).map((doc: any) => ({
      ...doc,
      perfiles: doc.perfiles || null,
    }));

    setDocumentos(normalizados);
    setPaginaActual(1);
    setLoading(false);
  }

  useEffect(() => {
    fetchDocumentos();
  }, [filtro]);

  // ================================================================
  // 🔥 AGRUPAR POR USUARIO
  // ================================================================
  const agrupado = useMemo(() => {
    return documentos.reduce((acc: any, doc: Documento) => {
      const email = doc.perfiles?.email || "desconocido";
      if (!acc[email]) acc[email] = [];
      acc[email].push(doc);
      return acc;
    }, {});
  }, [documentos]);

  const listaUsuarios = Object.keys(agrupado);
  const totalPaginas = Math.ceil(listaUsuarios.length / USERS_PER_PAGE);

  const usuariosPagina = listaUsuarios.slice(
    (paginaActual - 1) * USERS_PER_PAGE,
    paginaActual * USERS_PER_PAGE
  );

  const documentosPagina = usuariosPagina.flatMap((email) => agrupado[email]);

  // ================================================================
  // 🔥 ACTUALIZAR ESTADO (APROBAR / RECHAZAR)
  // ================================================================
  async function actualizarEstado(id: string, nuevoEstado: string) {
    await supabase
      .from("documentos")
      .update({ status: nuevoEstado })
      .eq("id", id);

    // Si no es aprobado, aquí termina
    if (nuevoEstado !== "aprobado") {
      fetchDocumentos();
      return;
    }

    // ==========================
    // 🟢 LOGICA PARA APROBACIÓN TOTAL
    // ==========================
    const { data: doc } = await supabase
      .from("documentos")
      .select(
        `
        id,
        tipo,
        perfil_id,
        perfiles:perfil_id (
          nombres,
          email
        )
      `
      )
      .eq("id", id)
      .single();

    const perfil = doc?.perfiles;
    if (!perfil) {
      fetchDocumentos();
      return;
    }

    const { data: docsUsuario } = await supabase
      .from("documentos")
      .select(
        `
        status,
        perfiles:perfil_id (
          email
        )
      `
      )
      .eq("perfil_id", doc.perfil_id);

    const todosAprobados =
      docsUsuario && docsUsuario.every((d: any) => d.status === "aprobado");

    if (todosAprobados) {
      await fetch("/api/email/documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: perfil.email,
          nombre: perfil.nombres,
          tipoDocumento: "todos",
          estado: "aprobado_total",
        }),
      });
    }

    fetchDocumentos();
  }

  return (
    <>
      <PageHead
        title="Gestión de documentos 📄"
        subtitle="Revisa, aprueba o rechaza los documentos enviados por los usuarios."
      />

      {/* Filtros */}
      <div className="w-full overflow-x-auto no-scrollbar mt-4">
        <div className="flex gap-3 min-w-max border-b border-[#eadacb] pb-1">
          {["todos", "pendiente", "aprobado", "rechazado"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-t-md text-sm font-semibold transition-all duration-200 border-b-2 ${filtro === estado
                ? "border-[#BC5F36] text-[#BC5F36] bg-[#fff8f4]"
                : "border-transparent text-[#7a5c49] hover:text-[#BC5F36]"
                }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-center py-10 text-slate-500">
          Cargando documentos...
        </p>
      ) : (
        <DocumentosTable
          documentos={documentosPagina}
          filtro={filtro}
          onAprobar={(id) => actualizarEstado(id, "aprobado")}
          onRechazar={(doc) => setRechazoActivo(doc)}
          onVerDocumento={(url) => setVisorActivo(url)}
        />
      )}

      <Pagination
        page={paginaActual}
        totalPages={totalPaginas}
        totalItems={listaUsuarios.length}
        itemsPerPage={USERS_PER_PAGE}
        itemsLabel="usuarios"
        onChange={(p) => setPaginaActual(p)}
      />

      {/* MODAL DE RECHAZO */}
      <ModalRechazo
        open={!!rechazoActivo}
        documento={rechazoActivo}
        onClose={() => setRechazoActivo(null)}
        onConfirm={async (motivo) => {
          if (!rechazoActivo) return;

          await supabase
            .from("documentos")
            .update({
              status: "rechazado",
              observacion_admin: motivo,
            })
            .eq("id", rechazoActivo.id);

          await fetch("/api/email/documento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: rechazoActivo.perfiles?.email ?? "",
              nombre: rechazoActivo.perfiles?.nombres ?? "",
              tipoDocumento: rechazoActivo.tipo,
              estado: "rechazado",
              motivo,
            }),
          });

          setRechazoActivo(null);
          fetchDocumentos();
        }}
      />

      <VisorDocumento
        open={!!visorActivo}
        url={visorActivo}
        onClose={() => setVisorActivo(null)}
      />
    </>
  );
}
