"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import DocumentosTable from "@/components/documentos/DocumentosTable";
import VisorDocumento from "@/components/documentos/VisorDocumento";
import type { Documento } from "@/components/documentos/types";
import { useIsMobile } from "@/hooks/useIsMobile"; // <-- ajusta tu ruta

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

  async function fetchDocumentos() {
    setLoading(true);

    let query = supabase
      .from("documentos")
      .select("id, tipo, url, status, created_at, observacion_admin, perfiles(nombres,email)")
      .order("created_at", { ascending: false });

    if (filtro !== "todos") query = query.eq("status", filtro);

    const { data } = await query;
    setDocumentos(data || []);
    setPaginaActual(1); 
    setLoading(false);
  }

  useEffect(() => {
    fetchDocumentos();
  }, [filtro]);

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

  async function actualizarEstado(id: string, nuevoEstado: string) {
    await supabase.from("documentos").update({ status: nuevoEstado }).eq("id", id);
    fetchDocumentos();
  }

  return (
    <>
      <PageHead
        title="Gestión de documentos 📄"
        subtitle="Revisa, aprueba o rechaza los documentos enviados por los usuarios."
      />

      <div className="w-full overflow-x-auto no-scrollbar mt-4">
        <div className="flex gap-3 min-w-max border-b border-[#eadacb] pb-1">
          {["todos", "pendiente", "aprobado", "rechazado"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-t-md text-sm font-semibold transition-all duration-200 border-b-2 ${
                filtro === estado
                  ? "border-[#BC5F36] text-[#BC5F36] bg-[#fff8f4]"
                  : "border-transparent text-[#7a5c49] hover:text-[#BC5F36]"
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10 text-slate-500">Cargando documentos...</p>
      ) : (
        <DocumentosTable
          documentos={documentosPagina}
          filtro={filtro}
          onAprobar={(id) => actualizarEstado(id, "aprobado")}
          onRechazar={(doc) => setRechazoActivo(doc)}
          onVerDocumento={(url) => setVisorActivo(url)}
        />
      )}

      {/* PAGINACIÓN */}
      {listaUsuarios.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => paginaActual > 1 && setPaginaActual((p) => p - 1)}
            disabled={paginaActual === 1}
            className="text-sm px-3 py-1 rounded-md bg-[#fff4e7] text-[#BC5F36] disabled:opacity-30"
          >
            Anterior
          </button>

          <span className="text-sm text-slate-600">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() => paginaActual < totalPaginas && setPaginaActual((p) => p + 1)}
            disabled={paginaActual === totalPaginas}
            className="text-sm px-3 py-1 rounded-md bg-[#fff4e7] text-[#BC5F36] disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      )}

      <VisorDocumento open={!!visorActivo} url={visorActivo} onClose={() => setVisorActivo(null)} />
    </>
  );
}
