"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import { showSoftToast } from "@/lib/showSoftToast";

import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";
import DocumentosSection from "@/features/adopciones/components/client/DocumentosSection";
import AdopcionAprobadaSection from "@/features/adopciones/components/client/AdopcionAprobadaSection";

import { useProcesoAdopcionQuery } from "@/features/adopciones/hooks/useProcesoAdopcionQuery";
import { useDocumentosParaAdopcionQuery } from "@/features/adopciones/hooks/useDocumentosParaAdopcionQuery";
import { useSubirDocumentoAdopcionMutation } from "@/features/adopciones/hooks/useSubirDocumentoAdopcionMutation";
import { useCancelarSolicitudAdopcionMutation } from "@/features/adopciones/hooks/useCancelarSolicitudAdopcionMutation";

import { mapCitaToCitaProgramadaUI } from "@/features/adopciones/mappers/mapCitaAdopcionToProgramadaUI";

export default function ProcesoAdopcionPage() {
  const router = useRouter();

  /* -------------------- Estado local -------------------- */
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);

  const [archivos, setArchivos] = useState<Record<string, File | undefined>>({
    identificacion: undefined,
    comprobante: undefined,
    curp: undefined,
  });

  /* -------------------- Queries -------------------- */
  const {
    data,
    isLoading,
    isError,
    error,
  } = useProcesoAdopcionQuery();

  const {
    data: documentosData,
    isLoading: isLoadingDocs,
    isError: isDocsError,
  } = useDocumentosParaAdopcionQuery();

  /* -------------------- Mutations -------------------- */
  const subirDocumentoMutation = useSubirDocumentoAdopcionMutation();
  const cancelarSolicitudMutation = useCancelarSolicitudAdopcionMutation();

  /* -------------------- Datos derivados -------------------- */
  const docs = documentosData?.documentos ?? [];
  const estado = documentosData?.estado ?? "sin_documentos";

  const solicitudActiva = data?.solicitudActiva ?? null;
  const citaActiva = data?.citaActiva ?? null;
  const adopcionEstado = data?.adopcionEstado ?? null;

  const citaProgramadaUI = citaActiva
    ? mapCitaToCitaProgramadaUI(citaActiva)
    : null;

  /* -------------------- Handlers -------------------- */
  const handlePickDocumento = (id: string, file?: File) => {
    setArchivos((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const enviar = async () => {
    const tipos = Object.keys(archivos) as Array<keyof typeof archivos>;

    await Promise.all(
      tipos
        .filter((tipo) => archivos[tipo])
        .map((tipo) =>
          subirDocumentoMutation.mutateAsync({
            tipo,
            file: archivos[tipo]!,
          })
        )
    );

    showSoftToast("Documentos enviados correctamente 📄");
  };

  const handleConfirmCancelar = async () => {
    if (!solicitudActiva?.id) return;

    await cancelarSolicitudMutation.mutateAsync(solicitudActiva.id);
    showSoftToast("Solicitud cancelada correctamente 🐾");
    setShowCancelSolicitudModal(false);
  };

  const deshabilitarEnviar =
    subirDocumentoMutation.isPending ||
    (estado === "sin_documentos"
      ? !Object.values(archivos).every(Boolean)
      : docs
        .filter((d) => d.estado === "rechazado")
        .some((d) => !archivos[d.tipo]));

  /* -------------------- Estados de carga / error -------------------- */
  if (isLoading || isLoadingDocs) {
    return (
      <div className="animate-pulse mt-4 rounded-xl border border-[#eadacb] bg-[#fff9f3] p-5 shadow-sm">
        <div className="h-4 w-32 bg-[#eadacb]/50 rounded mb-3" />
        <div className="h-3 w-full bg-[#eadacb]/40 rounded mb-2" />
        <div className="h-3 w-5/6 bg-[#eadacb]/40 rounded" />
      </div>
    );
  }

  if (isDocsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
        Error al cargar documentos
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
        <p className="font-bold">Error al cargar tu proceso de adopción</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  /* -------------------- Render -------------------- */
  return (
    <>
      <div className="space-y-8">
        <PageHead
          title="Proceso de adopción"
          subtitle={
            estado === "aprobado"
              ? "¡Listo! Ya puedes agendar tu cita para conocer a una mascota."
              : "Sube tus documentos para que un administrador los valide antes de continuar."
          }
        />

        <DocumentosSection
          estado={estado}
          documentos={docs}
          archivos={archivos}
          onPick={handlePickDocumento}
          onEnviar={enviar}
          deshabilitarEnviar={deshabilitarEnviar}
        />

        <AdopcionAprobadaSection
          estado={estado}
          solicitudActiva={solicitudActiva}
          citaActiva={citaActiva}
          citaProgramadaUI={citaProgramadaUI}
          adopcionEstado={adopcionEstado}
          onVerCita={() => router.push("/dashboards/usuario/citas")}
          onIrFormulario={(solicitudId) =>
            router.push(`/dashboards/usuario/form-adopcion/${solicitudId}`)
          }
          onCancelarSolicitud={() => setShowCancelSolicitudModal(true)}
        />

        {estado === "sin_documentos" && (
          <section className="rounded-2xl border border-[#eadacb] bg-white p-5 text-[#2b1b12] shadow-sm">
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
        )}
      </div>

      <ConfirmCancelSolicitudModal
        open={showCancelSolicitudModal}
        onClose={() => setShowCancelSolicitudModal(false)}
        onConfirm={handleConfirmCancelar}
      />
    </>
  );
}
