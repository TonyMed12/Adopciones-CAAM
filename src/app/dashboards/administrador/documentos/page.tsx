"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import DocumentosTable from "@/components/documentos/DocumentosTable";
import VisorDocumento from "@/components/documentos/VisorDocumento";
import type { Documento } from "@/components/documentos/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import ModalRechazo from "@/components/documentos/ModalRechazo";

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
  // 🔥 FETCH DOCUMENTOS
  // ================================================================
  async function fetchDocumentos() {
    setLoading(true);

    let query = supabase
      .from("documentos")
      .select(
        "id, tipo, url, status, created_at, observacion_admin, perfiles(nombres,email)"
      )
      .order("created_at", { ascending: false });

    if (filtro !== "todos") query = query.eq("status", filtro);

    const { data } = await query;

    // Normalizar perfiles: tomar SOLO el primer elemento
    const normalizados = (data || []).map((doc: any) => ({
      ...doc,
      perfiles: doc.perfiles?.[0] || null,
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
  // 🔥 ACTUALIZAR ESTADO (APROBAR O RECHAZAR)
  // ================================================================
  async function actualizarEstado(id: string, nuevoEstado: string) {
    // Actualizar el documento en BD
    await supabase
      .from("documentos")
      .update({ status: nuevoEstado })
      .eq("id", id);

    // ==========================
    // 🟢 LÓGICA SOLO PARA APROBADOS
    // ==========================
    if (nuevoEstado === "aprobado") {
      // Obtener el documento para saber su usuario
      const { data: doc } = await supabase
        .from("documentos")
        .select("id, tipo, perfiles(nombres,email)")
        .eq("id", id)
        .single();

      const perfil = doc?.perfiles?.[0];
      if (perfil) {
        // Verificar todos sus documentos
        const { data: docsUsuario } = await supabase
          .from("documentos")
          .select("status, perfiles(nombres,email)")
          .eq("perfiles.email", perfil.email);

        const normalizados = (docsUsuario || []).map((d: any) => ({
          ...d,
          perfiles: d.perfiles?.[0] || null,
        }));

        const todosAprobados =
          normalizados.length > 0 &&
          normalizados.every((d: any) => d.status === "aprobado");

        if (todosAprobados) {
          // 📩 enviar correo
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
      }
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

      {/* Tabla */}
      {loading ? (
        <p className="text-center py-10 text-slate-500">
          Cargando documentos...
        </p>
      ) : (
        <DocumentosTable
          documentos={documentosPagina}
          filtro={filtro}
          onAprobar={(id) => actualizarEstado(id, "aprobado")} // ✔️ Tu flujo original intacto
          onRechazar={(doc) => setRechazoActivo(doc)}
          onVerDocumento={(url) => setVisorActivo(url)}
        />
      )}

      {/* Paginación */}
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
            onClick={() =>
              paginaActual < totalPaginas && setPaginaActual((p) => p + 1)
            }
            disabled={paginaActual === totalPaginas}
            className="text-sm px-3 py-1 rounded-md bg-[#fff4e7] text-[#BC5F36] disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* MODAL DE RECHAZO */}
      <ModalRechazo
        open={!!rechazoActivo}
        documento={rechazoActivo}
        onClose={() => setRechazoActivo(null)}
        onConfirm={async (motivo) => {
          if (!rechazoActivo) return;

          // Guardar rechazo
          await supabase
            .from("documentos")
            .update({
              status: "rechazado",
              observacion_admin: motivo,
            })
            .eq("id", rechazoActivo.id);

          // Enviar correo de rechazo
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
