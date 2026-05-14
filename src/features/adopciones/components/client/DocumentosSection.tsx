"use client";

import { motion } from "framer-motion";
import {
  Clock,
  XCircle,
  Info,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import PanelEstado from "./PanelEstado";

import type {
  DocumentoUsuario,
  EstadoDocumentos,
} from "@/features/adopciones/types/documentos";

const SeccionCarga = dynamic(() => import("./SeccionCarga"), {
  ssr: false,
});

interface DocumentosSectionProps {
  estado: EstadoDocumentos;
  documentos: DocumentoUsuario[];
  archivos: Record<string, File | undefined>;
  onPick: (id: string, file?: File) => void;
  onEnviar: () => void;
  deshabilitarEnviar: boolean;
}

export default function DocumentosSection({
  estado,
  documentos,
  archivos,
  onPick,
  onEnviar,
  deshabilitarEnviar,
}: DocumentosSectionProps) {
  /* ---------------- Rechazado ---------------- */
  if (estado === "rechazado") {
    const docsNormalizados = documentos.map((doc) => ({
      ...doc,
      motivo_rechazo: doc.motivo_rechazo ?? undefined,
      url: doc.url ?? undefined,
    }));

    return (
      <>
        <PanelEstado
          tone="danger"
          icon={<XCircle className="h-6 w-6" />}
          title="Documentos con observaciones"
          desc="Por favor corrige lo indicado y vuelve a enviarlos. El equipo del CAAM revisará los nuevos archivos."
        />

        {/* Permitir reenviar */}
        <div className="mt-4">
          <SeccionCarga
            archivos={archivos}
            docs={docsNormalizados}
            onPick={onPick}
            onEnviar={onEnviar}
            deshabilitarEnviar={deshabilitarEnviar}
          />
        </div>
      </>
    );
  }

  /* ---------------- Sin documentos ---------------- */
  if (estado === "sin_documentos") {
    const docsNormalizados = documentos.map((doc) => ({
      ...doc,
      motivo_rechazo: doc.motivo_rechazo ?? undefined,
      url: doc.url ?? undefined,
    }));

    return (
      <>
        {/* Mini banner explicativo */}
        <div className="rounded-2xl border border-[#c7ddff] bg-gradient-to-br from-[#eef4ff] to-white p-4 sm:p-5 mb-5 flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#1d4ed8] ring-1 ring-[#c7ddff] shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#1e3a8a] tracking-tight">
              Empieza por aquí
            </p>
            <p className="mt-0.5 text-xs sm:text-sm text-[#1e40af] leading-relaxed">
              Sube los tres documentos para iniciar tu proceso de adopción. Un
              administrador del CAAM los validará en máximo 1-3 días hábiles.
            </p>
          </div>
        </div>

        <SeccionCarga
          archivos={archivos}
          docs={docsNormalizados}
          onPick={onPick}
          onEnviar={onEnviar}
          deshabilitarEnviar={deshabilitarEnviar}
        />

        {/* FAQs */}
        <section className="rounded-3xl border border-[#eadacb] bg-white p-5 sm:p-6 text-[#2b1b12] shadow-sm mt-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                Preguntas frecuentes
              </h3>
              <p className="text-xs text-[#7a5c49] mt-0.5">
                Resuelve dudas comunes antes de enviar.
              </p>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-2.5 text-sm text-[#6c5241] leading-relaxed">
            {[
              "Formatos aceptados: PDF, JPG, PNG. Tamaño máximo 5 MB.",
              "La revisión la realiza un administrador del CAAM.",
              "Si hay observaciones, podrás corregir y volver a enviar.",
              "Recibirás una notificación cuando estén aprobados.",
            ].map((q) => (
              <li
                key={q}
                className="flex items-start gap-2 rounded-xl bg-[#fffaf4] border border-[#f3e3d3] px-3 py-2"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#BC5F36] shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }

  /* ---------------- En revisión ---------------- */
  if (estado === "en_revision") {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-[#f3d6bb] bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2] p-8 sm:p-12 text-center shadow-sm">
        {/* Decoración de fondo */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#FDE68A]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-[#BC5F36]/15 blur-3xl" />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-[#BC5F36] shadow-lg ring-1 ring-[#f3d6bb]"
          >
            <Clock className="h-9 w-9" />
          </motion.div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] text-[#8B4513] px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb]">
            <Clock className="h-3 w-3" />
            En revisión
          </span>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2b1b12] tracking-tight">
            Tus documentos están en revisión
          </h2>

          <p className="max-w-lg text-sm sm:text-base text-[#6c5241] leading-relaxed">
            Un administrador del CAAM revisará que todo esté correcto. Te
            avisaremos cuando hayan sido aprobados. Esto suele tardar de 1 a 3
            días hábiles.
          </p>

          {/* Mini timeline */}
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md">
            {[
              { l: "Enviado", done: true },
              { l: "En revisión", done: true, current: true },
              { l: "Aprobado", done: false },
            ].map((s, i) => (
              <div
                key={i}
                className={`
                  rounded-xl px-2 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider ring-1
                  ${
                    s.current
                      ? "bg-[#BC5F36] text-white ring-[#BC5F36] shadow"
                      : s.done
                      ? "bg-white text-[#15803d] ring-emerald-200"
                      : "bg-white/60 text-[#a88b77] ring-[#eadacb]"
                  }
                `}
              >
                <div className="flex items-center justify-center gap-1">
                  {s.done && !s.current ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : s.current ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    <Info className="h-3 w-3 opacity-60" />
                  )}
                  <span>{s.l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Aprobado ---------------- */
  return null;
}
