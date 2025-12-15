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
                <section className="rounded-2xl border border-[#eadacb] bg-white p-5 text-[#2b1b12] shadow-sm mt-6">
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-[#BC5F36]" />
                        <h3 className="text-sm font-extrabold">Preguntas frecuentes</h3>
                    </div>
                    <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
                        <li>• Formatos aceptados: PDF, JPG, PNG. Tamaño máx. 5 MB.</li>
                        <li>• La revisión la realiza un administrador.</li>
                        <li>• Si hay observaciones, podrás corregir y volver a enviar.</li>
                    </ul>
                </section>
            </>
        );
    }

    /* ---------------- En revisión ---------------- */
    if (estado === "en_revision") {
        return (
            <section className="rounded-2xl border border-[#eadacb] bg-[#fff9f3] p-10 text-center shadow-sm">
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#BC5F36]/10"
                    >
                        <Clock className="h-10 w-10 text-[#BC5F36]" />
                    </motion.div>

                    <h2 className="text-xl font-extrabold text-[#2b1b12]">
                        Tus documentos están en revisión
                    </h2>

                    <p className="max-w-md text-sm text-[#7a5c49]">
                        Un administrador revisará que todo esté correcto. Te avisaremos
                        cuando hayan sido aprobados.
                    </p>
                </div>
            </section>
        );
    }

    /* ---------------- Aprobado ---------------- */
    return null;
}
