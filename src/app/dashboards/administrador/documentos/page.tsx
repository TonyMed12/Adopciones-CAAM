"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, CheckCircle2, XCircle, Loader2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createPortal } from "react-dom";

type Documento = {
  id: string;
  tipo: string;
  url: string;
  status: string;
  created_at: string;
  observacion_admin?: string;
  perfiles?: {
    nombres: string;
    email: string;
  };
};

export default function GestionDocumentosPage() {
  const supabase = createClient();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("pendiente");
  const [rechazoActivo, setRechazoActivo] = useState<Documento | null>(null);
  const [visorActivo, setVisorActivo] = useState<string | null>(null);
  const [razones, setRazones] = useState<string[]>([]);
  const [observacion, setObservacion] = useState("");

  const motivosPredefinidos = [
    "Foto borrosa o ilegible",
    "Documento incompleto",
    "La dirección no coincide",
    "Nombre no coincide",
    "Documento vencido",
  ];
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    const html = document.documentElement;

    if (visorActivo) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);

      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";

      html.style.overscrollBehavior = "none";
    } else {
      const prevY = Number(body.dataset.scrollY || 0);

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      delete body.dataset.scrollY;

      html.style.overscrollBehavior = "";

      if (!isNaN(prevY)) window.scrollTo(0, prevY);
    }
  }, [visorActivo]);

  useEffect(() => {
    fetchDocumentos();
  }, [filtro]);

  async function fetchDocumentos() {
    setLoading(true);
    let query = supabase
      .from("documentos")
      .select(
        "id, tipo, url, status, created_at, observacion_admin, perfiles(nombres, email)"
      )
      .order("created_at", { ascending: false });

    if (filtro !== "todos") query = query.eq("status", filtro);

    const { data, error } = await query;
    if (error) console.error(error);
    else setDocumentos(data || []);
    setLoading(false);
  }

  async function actualizarEstado(
    id: string,
    nuevoEstado: string,
    observacion?: string
  ) {
    const updateData: any = { status: nuevoEstado };
    if (observacion) updateData.observacion_admin = observacion;

    const { error } = await supabase
      .from("documentos")
      .update(updateData)
      .eq("id", id);

    if (error) return console.error("Error actualizando estado:", error);
    fetchDocumentos();
    setRechazoActivo(null);
    setRazones([]);
    setObservacion("");
  }

  function toggleRazon(r: string) {
    setRazones((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de documentos 📄
          </h1>
          <div className="flex gap-2 mt-3 sm:mt-0">
            {["todos", "pendiente", "aprobado", "rechazado"].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltro(estado)}
                className={`px-4 py-1.5 rounded-md text-sm border transition-all ${
                  filtro === estado
                    ? "bg-[#BC5F36] text-white border-[#BC5F36]"
                    : "border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <section className="rounded-2xl border border-[#eadacb] bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#fff4e7] text-[#2b1b12]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Usuario</th>
                <th className="px-4 py-3 text-left font-semibold">Correo</th>
                <th className="px-4 py-3 text-left font-semibold">Documento</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    <Loader2 className="animate-spin h-5 w-5 inline-block mr-1" />
                    Cargando documentos...
                  </td>
                </tr>
              ) : documentos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-slate-500 italic"
                  >
                    No hay documentos con estado "{filtro}".
                  </td>
                </tr>
              ) : (
                documentos.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-t border-[#f0e6dc] hover:bg-[#fffaf4]/70 transition"
                  >
                    <td className="px-4 py-3">{doc.perfiles?.nombres}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {doc.perfiles?.email}
                    </td>
                    <td className="px-4 py-3 capitalize flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#BC5F36]" />
                      {doc.tipo}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : doc.status === "aprobado"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                      {doc.status === "rechazado" &&
                        doc.observacion_admin && (
                          <p className="text-xs text-red-700 mt-1">
                            Motivo: {doc.observacion_admin}
                          </p>
                        )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setVisorActivo(
                              `https://jivnxysdyziojckvslqp.supabase.co/storage/v1/object/public/documentos_adopcion/${doc.url}`
                            )
                          }
                          className="text-[#BC5F36] hover:underline flex items-center text-xs"
                        >
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </button>

                        {doc.status === "pendiente" && (
                          <>
                            <Button
                              onClick={() =>
                                actualizarEstado(doc.id, "aprobado")
                              }
                              className="bg-green-600 hover:bg-green-700 text-xs px-3"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Aprobar
                            </Button>
                            <Button
                              onClick={() => setRechazoActivo(doc)}
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 text-xs px-3"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Rechazar
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* === VISOR DOCUMENTOS === */}
      {visorActivo &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto">
            <div className="relative bg-[#fffaf4] rounded-2xl shadow-2xl w-full max-w-6xl mx-auto flex flex-col h-[92vh] border border-[#eadacb] animate-fadeIn">
              {/* Botón cerrar */}
              <button
                onClick={() => setVisorActivo(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#BC5F36] transition"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Barra superior */}
              <div className="flex flex-wrap justify-between items-center px-6 py-3 border-b border-[#eadacb] bg-[#fff1e8] rounded-t-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#2b1b12]">
                      Vista del documento
                    </h2>
                    <p className="text-xs text-slate-500">
                      Revisa el archivo antes de aprobar o rechazar
                    </p>
                  </div>

                  {/* Botones movidos a la izquierda */}
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="ghost"
                      onClick={() => window.open(visorActivo, "_blank")}
                      className="text-[#BC5F36] hover:bg-[#ffe8db] flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" /> Abrir pestaña
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = visorActivo;
                        link.download =
                          visorActivo.split("/").pop() || "documento.pdf";
                        link.click();
                      }}
                      className="text-[#BC5F36] hover:bg-[#ffe8db] flex items-center gap-1"
                    >
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 bg-[#fdf9f5] flex items-center justify-center p-4 overflow-hidden">
                <div className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-white border border-[#e7d8c8]">
                  <iframe
                    src={visorActivo}
                    className="w-full h-full border-none rounded-xl"
                    title="Documento del usuario"
                    style={{
                      backgroundColor: "white",
                      filter: "drop-shadow(0 0 6px rgba(0,0,0,0.1))",
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[#eadacb] bg-[#fff1e8] rounded-b-2xl text-right">
                <Button
                  variant="ghost"
                  onClick={() => setVisorActivo(null)}
                  className="text-slate-600 hover:text-[#BC5F36]"
                >
                  Cerrar visor
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
