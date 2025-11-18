"use client";

import { useState } from "react";
import { FileText, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Documento } from "./types";

export default function DocumentosTable({
  documentos,
  filtro,
  onAprobar,
  onRechazar,
  onVerDocumento,
}: {
  documentos: Documento[];
  filtro: string;
  onAprobar: (id: string) => void;
  onRechazar: (doc: Documento) => void;
  onVerDocumento: (url: string) => void;
}) {
  const [openRows, setOpenRows] = useState<{ [email: string]: boolean }>({});

  const toggleRow = (email: string) => {
    setOpenRows((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  if (!documentos || documentos.length === 0)
    return (
      <p className="text-center py-10 text-slate-500 italic">
        No hay documentos con estado "{filtro}".
      </p>
    );

  /** AGRUPAR POR USUARIO */
  const agrupado = documentos.reduce((acc: any, doc: Documento) => {
    const email = doc.perfiles?.email || "desconocido";
    if (!acc[email]) acc[email] = [];
    acc[email].push(doc);
    return acc;
  }, {});

  return (
    <section className="rounded-2xl border border-[#eadacb] bg-white shadow-sm overflow-hidden">

      {Object.entries(agrupado).map(([email, docs]: any) => {
        const usuario = docs[0].perfiles;
        const aprobados = docs.filter((d: Documento) => d.status === "aprobado").length;
        const pendientes = docs.filter((d: Documento) => d.status === "pendiente").length;
        const rechazados = docs.filter((d: Documento) => d.status === "rechazado").length;
        const isOpen = openRows[email];

        return (
          <div key={email} className="border-b border-[#f3e8dd] last:border-none">

            {/* HEADER USUARIO */}
            <div
              className="
                flex flex-col sm:flex-row 
                sm:items-center sm:justify-between 
                px-4 py-4 
                hover:bg-[#fffaf4] cursor-pointer transition
              "
              onClick={() => toggleRow(email)}
            >
              {/* IZQUIERDA */}
              <div className="flex flex-col">
                <span className="font-semibold text-[#3b291d] text-base sm:text-lg">
                  {usuario?.nombres}
                </span>
                <span className="text-xs text-slate-500 break-all">
                  {email}
                </span>
              </div>

              {/* DERECHA */}
              <div className="flex flex-row items-center gap-4 mt-2 sm:mt-0">

                {/* Cantidad */}
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <FileText className="h-4 w-4 text-[#BC5F36]" />
                  <span className="font-medium text-sm">{docs.length}</span>
                  <span className="text-xs text-slate-500">docs</span>
                </div>

                {/* Estado general */}
                {pendientes > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs whitespace-nowrap">
                    {pendientes} pendientes
                  </span>
                )}

                {rechazados > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs whitespace-nowrap">
                    {rechazados} rechazados
                  </span>
                )}

                {aprobados > 0 && pendientes === 0 && rechazados === 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs whitespace-nowrap">
                    Completos ✓
                  </span>
                )}

                <span className="text-[#BC5F36] text-xl font-bold leading-none">
                  {isOpen ? "▾" : "▸"}
                </span>
              </div>
            </div>

            {/* EXPANDIBLE */}
            {isOpen && (
              <div className="bg-[#fff9f4] px-3 sm:px-6 pb-4 pt-2 space-y-3 animate-fadeIn">
                {docs.map((doc: Documento) => (
                  <div
                    key={doc.id}
                    className="
                      flex flex-col sm:flex-row sm:items-center sm:justify-between
                      gap-3
                      border border-[#eadacb] rounded-xl 
                      p-4 bg-white shadow-sm
                    "
                  >
                    {/* IZQUIERDA */}
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-[#BC5F36] flex-shrink-0" />
                      <div>
                        <p className="font-semibold capitalize text-[#3b291d] text-sm">
                          {doc.tipo}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Subido el: {new Date(doc.created_at).toLocaleDateString()}
                        </p>

                        {doc.status === "rechazado" && doc.observacion_admin && (
                          <p className="text-xs text-red-700 mt-1">
                            Motivo: {doc.observacion_admin}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* DERECHA */}
                    <div className="flex items-center gap-2 justify-end sm:justify-normal">
                      <span
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                          ${
                            doc.status === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : doc.status === "aprobado"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {doc.status}
                      </span>

                      <button
                        onClick={() => onVerDocumento(doc.url)}
                        className="text-[#BC5F36] hover:underline text-xs flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </button>

                      {doc.status === "pendiente" && (
                        <>
                          <Button
                            onClick={() => onAprobar(doc.id)}
                            className="bg-green-600 hover:bg-green-700 text-xs px-3"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Aprobar
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => onRechazar(doc)}
                            className="text-red-600 hover:bg-red-50 text-xs px-3"
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
