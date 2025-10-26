"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, CheckCircle2, XCircle, Loader2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
                    {doc.status === "rechazado" && doc.observacion_admin && (
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
                            onClick={() => actualizarEstado(doc.id, "aprobado")}
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

      {/* Modal de rechazo */}
      {rechazoActivo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6">
            <button
              onClick={() => setRechazoActivo(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Rechazar documento
            </h2>
            <p className="text-sm text-slate-600 mb-2">
              Selecciona una o varias razones para el rechazo:
            </p>

            <div className="grid gap-2 mb-4 max-h-[40vh] overflow-y-auto pr-1">
              {motivosPredefinidos.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={razones.includes(m)}
                    onChange={() => toggleRazon(m)}
                    className="accent-[#BC5F36]"
                  />
                  {m}
                </label>
              ))}
            </div>

            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Agrega una observación adicional..."
              className="w-full border border-[#eadacb] rounded-xl px-3 py-2 text-sm text-slate-700 
          focus:ring-2 focus:ring-[#BC5F36]/40 focus:border-[#BC5F36] placeholder:text-slate-400 
          resize-none h-24 transition-all"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => setRechazoActivo(null)}
                className="text-slate-500"
              >
                Cancelar
              </Button>
              <Button
                onClick={() =>
                  actualizarEstado(
                    rechazoActivo.id,
                    "rechazado",
                    [...razones, observacion].filter(Boolean).join("; ")
                  )
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar rechazo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Visor de documento */}
      {visorActivo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-10">
          <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-6xl mx-auto flex flex-col h-[85vh]">
            {/* Botón cerrar */}
            <button
              onClick={() => setVisorActivo(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Encabezado */}
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                Vista del documento
              </h2>
            </div>

            {/* Contenido del visor */}
            <div className="flex-1 overflow-hidden bg-slate-50">
              <iframe
                src={visorActivo}
                className="w-full h-full rounded-b-xl border-none"
                title="Documento del usuario"
              />
            </div>

            {/* Footer */}
            <div className="p-3 text-right border-t border-slate-200 bg-white rounded-b-xl">
              <Button
                variant="ghost"
                onClick={() => setVisorActivo(null)}
                className="text-slate-500"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
