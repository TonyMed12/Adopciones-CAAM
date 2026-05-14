"use client";

import React from "react";
import {
  FileCheck2,
  FileUp,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  FileSearch,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SeccionCargaProps {
  archivos: Record<string, File | undefined>;
  docs?: {
    tipo: string;
    estado: string;
    motivo_rechazo?: string;
    url?: string;
  }[];
  onPick: (id: string, file?: File) => void;
  onEnviar: () => void;
  deshabilitarEnviar: boolean;
}

const DOCUMENTOS = [
  {
    id: "identificacion",
    label: "Identificación oficial (INE)",
    desc: "Frente y reverso legibles.",
  },
  {
    id: "comprobante",
    label: "Comprobante de domicilio",
    desc: "Recibo no mayor a 3 meses.",
  },
  {
    id: "curp",
    label: "CURP",
    desc: "Documento actualizado.",
  },
] as const;

function getEstadoMeta(estado?: string) {
  switch (estado) {
    case "aprobado":
      return {
        label: "Aprobado",
        Icon: CheckCircle2,
        chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        border: "border-emerald-200",
        bg: "from-emerald-50/40 to-white",
      };
    case "pendiente":
      return {
        label: "En revisión",
        Icon: Clock,
        chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        border: "border-amber-200",
        bg: "from-amber-50/40 to-white",
      };
    case "rechazado":
      return {
        label: "Rechazado",
        Icon: XCircle,
        chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
        border: "border-rose-200",
        bg: "from-rose-50/40 to-white",
      };
    default:
      return {
        label: "Pendiente",
        Icon: FileText,
        chip: "bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]",
        border: "border-[#eadacb]",
        bg: "from-[#fffaf4] to-white",
      };
  }
}

export default function SeccionCarga({
  archivos,
  docs = [],
  onPick,
  onEnviar,
  deshabilitarEnviar,
}: SeccionCargaProps) {
  function getDocInfo(tipo: string) {
    return docs.find((d) => d.tipo === tipo);
  }

  const totalDocs = DOCUMENTOS.length;
  const cargados = DOCUMENTOS.filter((d) => archivos[d.id]).length;
  const tieneRechazados = docs.some((d) => d.estado === "rechazado");

  return (
    <section className="rounded-3xl border border-[#eadacb] bg-white shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)] overflow-hidden">
      {/* ============ Header del card ============ */}
      <div className="relative border-b border-[#f3e3d3] bg-gradient-to-br from-[#FFF7EF] to-white px-5 sm:px-7 py-5 sm:py-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-[#BC5F36] text-white shadow-md shrink-0">
            <FileSearch className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#2b1b12] tracking-tight leading-tight">
                Sube tus documentos
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                <Sparkles className="h-3 w-3" />
                Paso requerido
              </span>
            </div>
            <p className="mt-1 text-sm text-[#7a5c49] leading-relaxed">
              Adjunta los archivos requeridos. Si algún documento fue rechazado,
              podrás volver a subir sólo ese.
            </p>

            {/* Mini progress */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[#f3e3d3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#BC5F36] to-[#D97706] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (cargados / totalDocs) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-[#BC5F36] whitespace-nowrap">
                {cargados}/{totalDocs}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Lista de documentos ============ */}
      <div className="p-4 sm:p-6 grid gap-3 sm:gap-4">
        {DOCUMENTOS.map((doc) => {
          const info = getDocInfo(doc.id);
          const estado = info?.estado;
          const motivo = info?.motivo_rechazo;
          const meta = getEstadoMeta(estado);
          const puedeSubir =
            !estado || estado === "rechazado" || estado === "sin_documentos";
          const nuevoArchivo = archivos[doc.id];

          return (
            <div
              key={doc.id}
              className={`
                relative rounded-2xl border bg-gradient-to-br ${meta.bg} ${meta.border}
                p-4 sm:p-5 transition-all duration-300
                ${puedeSubir ? "hover:shadow-md hover:-translate-y-[1px]" : ""}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Lado izquierdo: icono + info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm sm:text-[15px] font-extrabold text-[#2b1b12] leading-tight">
                        {doc.label}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}
                      >
                        <meta.Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-[#7a5c49] leading-relaxed">
                      {doc.desc}
                    </p>

                    {/* Mensaje de rechazo */}
                    {estado === "rechazado" && motivo && (
                      <div className="mt-2 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-xs text-rose-700 leading-relaxed flex items-start gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>
                          <strong className="font-semibold">Motivo:</strong>{" "}
                          {motivo}
                        </span>
                      </div>
                    )}

                    {/* Archivo seleccionado nuevo */}
                    {nuevoArchivo && (
                      <p className="mt-1.5 text-xs text-[#6b4f40] flex items-center gap-1.5">
                        <FileCheck2 className="h-3.5 w-3.5 text-[#BC5F36] shrink-0" />
                        <span className="truncate font-medium">
                          {nuevoArchivo.name}
                        </span>
                      </p>
                    )}

                    {/* Link al archivo actual */}
                    {info?.url?.startsWith("http") ? (
                      <a
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-[#BC5F36] hover:text-[#8c3f1e] font-semibold transition"
                      >
                        Ver archivo actual
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Lado derecho: botón de carga */}
                <div className="shrink-0 w-full sm:w-auto">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    id={`file-${doc.id}`}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onPick(doc.id, file);
                    }}
                    disabled={!puedeSubir}
                  />
                  <Button
                    variant={nuevoArchivo ? "secondary" : "ghost"}
                    full
                    className="sm:!w-auto whitespace-nowrap cursor-pointer"
                    onClick={() =>
                      puedeSubir &&
                      document.getElementById(`file-${doc.id}`)?.click()
                    }
                    disabled={!puedeSubir}
                  >
                    <FileUp className="h-4 w-4 mr-1.5" />
                    {puedeSubir
                      ? nuevoArchivo
                        ? "Cambiar archivo"
                        : "Seleccionar"
                      : "Aprobado"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ Footer con acción principal ============ */}
      <div className="border-t border-[#f3e3d3] bg-gradient-to-br from-[#fffaf4] to-white px-5 sm:px-7 py-4 sm:py-5">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-[#7a5c49] leading-relaxed">
            Formatos aceptados:{" "}
            <strong className="text-[#2b1b12]">PDF, JPG, PNG</strong> · Máx.{" "}
            <strong className="text-[#2b1b12]">5 MB</strong> por archivo.
          </p>

          <Button
            disabled={deshabilitarEnviar}
            onClick={onEnviar}
            className="cursor-pointer shrink-0"
          >
            <FileCheck2 className="h-4 w-4 mr-1.5" />
            {tieneRechazados ? "Reenviar rechazados" : "Enviar para revisión"}
          </Button>
        </div>
      </div>
    </section>
  );
}
