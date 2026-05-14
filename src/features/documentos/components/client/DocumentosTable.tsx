"use client";

import { useState } from "react";
import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  User,
  Mail,
  Calendar,
  FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Documento } from "../../types/types";

const ESTADO_META: Record<
  string,
  { Icon: React.ComponentType<{ className?: string }>; chip: string; label: string }
> = {
  pendiente: {
    Icon: Clock,
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    label: "Pendiente",
  },
  aprobado: {
    Icon: CheckCircle2,
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    label: "Aprobado",
  },
  rechazado: {
    Icon: XCircle,
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    label: "Rechazado",
  },
};

function getInitials(name: string = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "?"
  );
}

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

  if (!documentos || documentos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 mb-3">
          <FileSearch className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          No hay documentos
        </p>
        <p className="text-xs text-slate-500 mt-1">
          No hay documentos con estado "{filtro}".
        </p>
      </div>
    );
  }

  /** AGRUPAR POR USUARIO */
  const agrupado = documentos.reduce((acc: any, doc: Documento) => {
    const email = doc.perfiles?.email || "desconocido";
    if (!acc[email]) acc[email] = [];
    acc[email].push(doc);
    return acc;
  }, {});

  return (
    <section
      className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden mt-5"
      style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.06)" }}
    >
      {Object.entries(agrupado).map(([email, docs]: any) => {
        const usuario = docs[0].perfiles;
        const aprobados = docs.filter(
          (d: Documento) => d.status === "aprobado"
        ).length;
        const pendientes = docs.filter(
          (d: Documento) => d.status === "pendiente"
        ).length;
        const rechazados = docs.filter(
          (d: Documento) => d.status === "rechazado"
        ).length;
        const isOpen = openRows[email];

        const nombre = usuario?.nombres || "Sin nombre";

        return (
          <div
            key={email}
            className="border-b border-slate-100 last:border-none"
          >
            {/* ============ HEADER USUARIO ============ */}
            <button
              type="button"
              onClick={() => toggleRow(email)}
              className="
                w-full text-left
                flex flex-col sm:flex-row sm:items-center justify-between gap-3
                px-4 sm:px-5 py-4
                hover:bg-slate-50 transition
              "
            >
              {/* Avatar + nombre */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] text-[#BC5F36] font-extrabold text-sm ring-1 ring-[#f3d6bb] shrink-0">
                  {getInitials(nombre)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-extrabold text-slate-800 truncate">
                    {nombre}
                  </p>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <Mail className="h-3 w-3 shrink-0" />
                    {email}
                  </p>
                </div>
              </div>

              {/* Indicadores de estado */}
              <div className="flex flex-wrap items-center gap-2 justify-end shrink-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold ring-1 ring-slate-200">
                  <FileText className="h-3 w-3" />
                  {docs.length} {docs.length === 1 ? "doc" : "docs"}
                </span>

                {pendientes > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-semibold ring-1 ring-amber-200">
                    <Clock className="h-3 w-3" />
                    {pendientes} pendiente{pendientes !== 1 ? "s" : ""}
                  </span>
                )}

                {rechazados > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[11px] font-semibold ring-1 ring-rose-200">
                    <XCircle className="h-3 w-3" />
                    {rechazados} rechazado{rechazados !== 1 ? "s" : ""}
                  </span>
                )}

                {aprobados > 0 && pendientes === 0 && rechazados === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Completos
                  </span>
                )}

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* ============ EXPANDIBLE ============ */}
            {isOpen && (
              <div className="bg-slate-50/60 border-t border-slate-100 px-3 sm:px-5 py-4 grid gap-3 animate-fade-in">
                {docs.map((doc: Documento) => {
                  const meta =
                    ESTADO_META[doc.status] || ESTADO_META["pendiente"];

                  return (
                    <div
                      key={doc.id}
                      className="
                        flex flex-col gap-3
                        sm:flex-row sm:items-center sm:justify-between
                        rounded-xl bg-white border border-slate-200/80
                        p-3 sm:p-4 shadow-sm
                      "
                    >
                      {/* IZQUIERDA */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                          <FileText className="h-5 w-5" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-extrabold capitalize text-slate-800 text-sm leading-tight">
                              {doc.tipo}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${meta.chip}`}
                            >
                              <meta.Icon className="h-3 w-3" />
                              {meta.label}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Subido el{" "}
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>

                          {doc.status === "rechazado" &&
                            doc.observacion_admin && (
                              <p className="text-xs text-rose-700 mt-1.5 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 leading-relaxed">
                                <strong className="font-semibold">
                                  Motivo:
                                </strong>{" "}
                                {doc.observacion_admin}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* DERECHA */}
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
                        <button
                          onClick={() => onVerDocumento(doc.url)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#BC5F36] hover:text-[#8c3f1e] hover:underline transition"
                        >
                          <Eye className="h-4 w-4" /> Ver
                        </button>

                        {doc.status === "pendiente" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onAprobar(doc.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onRechazar(doc)}
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
