"use client";

import { useState, useMemo } from "react";
import PageHead from "@/components/layout/PageHead";
import Pagination from "@/components/ui/Pagination";
import DocumentosTable from "@/features/documentos/components/client/DocumentosTable";
import ModalRechazo from "@/features/documentos/components/client/ModalRechazo";
import VisorDocumento from "@/features/documentos/components/client/VisorDocumento";
import DocumentosTableSkeleton from "@/features/documentos/components/client/DocumentosTableSkeleton";
import DocumentosFilters from "@/features/documentos/components/client/DocumentosFilters";

import { useDocumentosQuery } from "@/features/documentos/hooks/useDocumentosQuery";
import { useAprobarDocumento } from "@/features/documentos/hooks/useAprobarDocumento";
import { useRechazarDocumento } from "@/features/documentos/hooks/useRechazarDocumento";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function GestionDocumentosPage() {
  const isMobile = useIsMobile();

  const [filtro, setFiltro] = useState("pendiente");
  const [visorActivo, setVisorActivo] = useState<string | null>(null);
  const [rechazoActivo, setRechazoActivo] = useState<any | null>(null);

  const { data: documentos = [], isLoading } = useDocumentosQuery(filtro);

  const aprobar = useAprobarDocumento();
  const rechazar = useRechazarDocumento();

  const USERS_PER_PAGE = isMobile ? 5 : 10;
  const [paginaActual, setPaginaActual] = useState(1);

  const agrupado = useMemo(() => {
    return documentos.reduce((acc: any, doc: any) => {
      const email = doc.perfiles?.email || "desconocido";
      acc[email] = acc[email] || [];
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

  const documentosPagina = usuariosPagina.flatMap(
    (email) => agrupado[email]
  );

  return (
    <>
      <PageHead
        title="Gestión de documentos 📄"
        subtitle="Revisa, aprueba o rechaza los documentos enviados por los usuarios."
      />

      <DocumentosFilters filtro={filtro} onChange={setFiltro} />

      {isLoading ? (
        <DocumentosTableSkeleton />
      ) : (
        <DocumentosTable
          documentos={documentosPagina}
          filtro={filtro}
          onAprobar={(id) => aprobar.mutate(id)}
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

      <ModalRechazo
        open={!!rechazoActivo}
        documento={rechazoActivo}
        onClose={() => setRechazoActivo(null)}
        onConfirm={(motivo) => {
          rechazar.mutate({
            id: rechazoActivo.id,
            motivo,
            doc: rechazoActivo,
          });
          setRechazoActivo(null);
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
