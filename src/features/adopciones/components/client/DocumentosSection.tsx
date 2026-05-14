"use client";

import { motion } from "framer-motion";
import { Clock, XCircle, Info } from "lucide-react";
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
        return (
            <PanelEstado
                tone="danger"
                icon={<XCircle className="h-6 w-6" />}
                title="Documentos rechazados"
                desc="Por favor corrige lo indicado y vuelve a enviarlos."
            />
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
                <SeccionCarga
                    archivos={archivos}
                    docs={docsNormalizados}
                    onPick={onPick}
                    onEnviar={onEnviar}
                    deshabilitarEnviar={deshabilitarEnviar}
                />

                {/* FAQs */}
                <section className="rounded-2xl border border-[#eadacb] bg-gradient-to-br from-white to-[#FFF7EF] p-5 sm:p-6 text-[#2b1b12] shadow-sm mt-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                            <Info className="h-5 w-5" />
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold">
                            Preguntas frecuentes
                        </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[#6c5241] leading-relaxed">
                        <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#BC5F36] shrink-0" />
                            <span>Formatos aceptados: PDF, JPG, PNG. Tamaño máximo 5 MB.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#BC5F36] shrink-0" />
                            <span>La revisión la realiza un administrador del CAAM.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#BC5F36] shrink-0" />
                            <span>Si hay observaciones, podrás corregir y volver a enviar.</span>
                        </li>
                    </ul>
                </section>
            </>
        );
    }

    /* ---------------- En revisión ---------------- */
    if (estado === "en_revision") {
        return (
            <section className="relative overflow-hidden rounded-3xl border border-[#f3d6bb] bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2] p-8 sm:p-12 text-center shadow-sm">
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-[#BC5F36] shadow-lg ring-1 ring-[#f3d6bb]"
                    >
                        <Clock className="h-9 w-9" />
                    </motion.div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] text-[#8B4513] px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb]">
                        En revisión
                    </span>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#2b1b12] tracking-tight">
                        Tus documentos están en revisión
                    </h2>

                    <p className="max-w-lg text-sm sm:text-base text-[#6c5241] leading-relaxed">
                        Un administrador del CAAM revisará que todo esté correcto.
                        Te avisaremos cuando hayan sido aprobados. Esto suele tardar de 1 a 3 días hábiles.
                    </p>
                </div>
            </section>
        );
    }

    /* ---------------- Aprobado ---------------- */
    return null;
}
