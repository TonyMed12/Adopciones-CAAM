"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Heart, FileText } from "lucide-react";

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

import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function ProcesoAdopcionPage() {
  const queryClient = useQueryClient();
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
  const { data, isLoading, isError, error } = useProcesoAdopcionQuery();

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
    setArchivos((prev) => ({ ...prev, [id]: file }));
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

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["documentos-adopcion"] }),
      queryClient.invalidateQueries({ queryKey: ["proceso-adopcion"] }),
    ]);

    showSoftToast("Documentos enviados correctamente");
  };

  const handleConfirmCancelar = async () => {
    if (!solicitudActiva?.id) return;
    await cancelarSolicitudMutation.mutateAsync(solicitudActiva.id);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["proceso-adopcion"] }),
      queryClient.invalidateQueries({ queryKey: ["documentos-adopcion"] }),
    ]);
    showSoftToast("Solicitud cancelada correctamente");
    setShowCancelSolicitudModal(false);
  };

  const deshabilitarEnviar =
    subirDocumentoMutation.isPending ||
    (estado === "sin_documentos"
      ? !Object.values(archivos).every(Boolean)
      : docs
          .filter((d) => d.estado === "rechazado")
          .some((d) => !archivos[d.tipo]));

  /* -------------------- Loading / Error -------------------- */
  if (isLoading || isLoadingDocs) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isDocsError) {
    return (
      <EmptyState
        icon={<AlertCircle size={32} />}
        title="No pudimos cargar tus documentos"
        description="Hubo un problema al consultar el estado de tus documentos. Intenta nuevamente."
        action={
          <Button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["documentos-adopcion"],
              })
            }
          >
            Reintentar
          </Button>
        }
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle size={32} />}
        title="Error al cargar tu proceso de adopción"
        description={error?.message || "Algo salió mal. Intenta nuevamente."}
        action={
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["proceso-adopcion"] })
            }
          >
            Reintentar
          </Button>
        }
      />
    );
  }

  /* -------------------- Subtitle dinámico -------------------- */
  const subtitle =
    estado === "aprobado"
      ? "¡Documentos validados! Continúa con tu proceso paso a paso."
      : estado === "en_revision"
      ? "Tus documentos están en revisión. Te avisaremos pronto."
      : estado === "rechazado"
      ? "Hay observaciones en tus documentos. Por favor corrígelas."
      : "Sube tus documentos para que un administrador los valide.";

  /* -------------------- Render -------------------- */
  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        <PageHead
          title="Mi proceso de adopción"
          subtitle={subtitle}
          eyebrow={
            <>
              <Heart size={12} fill="currentColor" />
              <span>Tu adopción en curso</span>
            </>
          }
          icon={<FileText size={20} />}
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
          onVerMascotas={() => router.push("/dashboards/usuario/mascotas")}
          onIrFormulario={(id) =>
            router.push(`/dashboards/usuario/form-adopcion/${id}`)
          }
          onCancelarSolicitud={() => setShowCancelSolicitudModal(true)}
        />
      </div>

      <ConfirmCancelSolicitudModal
        open={showCancelSolicitudModal}
        onClose={() => setShowCancelSolicitudModal(false)}
        onConfirm={handleConfirmCancelar}
      />
    </>
  );
}
