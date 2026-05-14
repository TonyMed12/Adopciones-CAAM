"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  AlertCircle,
  Loader2,
  CalendarPlus,
} from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import ConfirmCancelModal from "@/features/adopciones/components/client/ConfirmCancelModal";
import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";

import { useMisCitasQuery } from "@/features/citas/hooks/useMisCitasQuery";
import { useCancelarCitaMutation } from "@/features/citas/hooks/useCancelarCitaMutation";
import { useCancelarSolicitudAdopcionMutation } from "@/features/citas/hooks/useCancelarSolicitudAdopcionMutation";
import { useConfirmarCitaMutation } from "@/features/citas/hooks/useConfirmarCitaMutation";
import { useHorasOcupadasQuery } from "@/features/citas/hooks/useHorasOcupadasQuery";
import { useDiasRestantesSolicitud } from "@/features/citas/hooks/useDiasRestantesSolicitud";

import FormularioAgendarCita from "@/features/citas/components/client/FormularioAgendarCita";
import CitaProgramadaCard from "@/features/citas/components/client/CitaProgramadaCard";
import ConfirmacionCita from "@/features/citas/components/client/ConfirmacionCita";

import EstadoRevisionSolicitud from "@/features/citas/components/client/EstadoRevisionSolicitud";
import EstadoAdopcionAprobada from "@/features/citas/components/client/EstadoAdopcionAprobada";
import EstadoAdopcionRechazada from "@/features/citas/components/client/EstadoAdopcionRechazada";
import EstadoSolicitudEnProceso from "@/features/citas/components/client/EstadoSolicitudEnProceso";
import EstadoSolicitudPendiente from "@/features/citas/components/client/EstadoSolicitudPendiente";

import { useSoftToast } from "@/hooks/useSoftToast";
import { horaEsPasada } from "@/features/citas/utils/horaEsPasada";

import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function MisCitasPage() {
  /* -------------------- Queries -------------------- */
  const { data, isLoading, isError } = useMisCitasQuery();

  const solicitudActiva = data?.solicitudActiva ?? null;
  const adopcionEstado = data?.adopcionEstado ?? null;
  const perfil = data?.perfil ?? null;
  const citaProgramada = data?.citaProgramada ?? null;

  /* -------------------- Mutations -------------------- */
  const confirmarCitaMutation = useConfirmarCitaMutation();
  const cancelarCitaMutation = useCancelarCitaMutation();
  const cancelarSolicitudMutation = useCancelarSolicitudAdopcionMutation();

  /* -------------------- UI State -------------------- */
  const { show } = useSoftToast();

  const [paso, setPaso] = useState<"inicio" | "formulario" | "confirmacion">(
    "inicio"
  );

  const [fecha, setFecha] = useState("");
  const [fechaDate, setFechaDate] = useState<Date | undefined>();
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [citaAEliminar, setCitaAEliminar] = useState<string | null>(null);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<string | null>(
    null
  );

  const { data: horasOcupadas = [] } = useHorasOcupadasQuery(fecha);

  const diasRestantes = useDiasRestantesSolicitud(solicitudActiva?.created_at);

  /* -------------------- Handlers -------------------- */
  async function confirmarCita() {
    if (!fecha || !horaSeleccionada || !solicitudActiva || !perfil) {
      show("Selecciona fecha y hora");
      return;
    }

    await confirmarCitaMutation.mutateAsync({
      usuarioId: perfil.id,
      solicitudId: solicitudActiva.id,
      mascotaId: solicitudActiva.mascota?.id ?? null,
      fecha,
      hora: horaSeleccionada,
    });

    setPaso("confirmacion");
  }

  async function cancelarCita(citaId: string) {
    if (!solicitudActiva) return;

    await cancelarCitaMutation.mutateAsync({
      citaId,
      solicitudId: solicitudActiva.id,
    });
  }

  async function cancelarSolicitud(id: string) {
    await cancelarSolicitudMutation.mutateAsync(id);
    show("Solicitud cancelada correctamente 🐾");
  }

  function handleFinalizar() {
    setPaso("inicio");
  }

  /* -------------------- Loading / Error -------------------- */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="flex items-center justify-center gap-2 text-[#7a5c49] py-4">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Cargando tus citas...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle size={32} />}
        title="No pudimos cargar tus citas"
        description="Ocurrió un error al consultar tus citas. Intenta nuevamente en unos momentos."
        action={
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        }
      />
    );
  }

  /* -------------------- Subtitle dinámico -------------------- */
  const subtitle = citaProgramada
    ? "Tu cita está confirmada. Te esperamos en el CAAM."
    : solicitudActiva
    ? "Programa o gestiona tu cita para conocer a tu futura mascota."
    : "Aún no tienes solicitudes activas ni citas pendientes.";

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHead
        title="Mis citas de adopción"
        subtitle={subtitle}
        eyebrow={
          <>
            <CalendarCheck size={12} />
            <span>Agenda</span>
          </>
        }
        icon={<CalendarCheck size={20} />}
      />

      {/* PASO 1: Inicio */}
      {paso === "inicio" && (
        <>
          {citaProgramada ? (
            <CitaProgramadaCard
              cita={citaProgramada}
              onCancelar={(id) => setCitaAEliminar(id)}
              onAbrirModal={() => setShowCancelModal(true)}
            />
          ) : solicitudActiva && adopcionEstado === "pendiente" ? (
            <EstadoRevisionSolicitud />
          ) : solicitudActiva && adopcionEstado === "aprobada" ? (
            <EstadoAdopcionAprobada />
          ) : solicitudActiva && adopcionEstado === "rechazada" ? (
            <EstadoAdopcionRechazada />
          ) : solicitudActiva ? (
            solicitudActiva.estado === "en_proceso" ? (
              <EstadoSolicitudEnProceso
                solicitudId={solicitudActiva.id}
                loading={loadingForm}
                onIrFormulario={() => {
                  setLoadingForm(true);
                  window.location.href = `/dashboards/usuario/form-adopcion/${solicitudActiva.id}`;
                }}
              />
            ) : (
              <EstadoSolicitudPendiente
                mascota={solicitudActiva.mascota}
                diasRestantes={diasRestantes}
                onAgendar={() => setPaso("formulario")}
                onCancelar={() => {
                  setSolicitudAEliminar(solicitudActiva.id);
                  setShowCancelSolicitudModal(true);
                }}
              />
            )
          ) : (
            <EmptyState
              icon={<CalendarPlus size={32} />}
              title="No tienes citas ni solicitudes activas"
              description="Para agendar una cita primero necesitas iniciar el proceso de adopción seleccionando una mascota."
              action={
                <Button
                  onClick={() =>
                    (window.location.href = "/dashboards/usuario/mascotas")
                  }
                >
                  Ver mascotas disponibles
                </Button>
              }
            />
          )}
        </>
      )}

      {/* PASO 2: Formulario */}
      {paso === "formulario" && solicitudActiva && (
        <FormularioAgendarCita
          solicitudActiva={solicitudActiva}
          fecha={fecha}
          fechaDate={fechaDate}
          horaSeleccionada={horaSeleccionada}
          horasOcupadas={horasOcupadas}
          setFecha={setFecha}
          setFechaDate={setFechaDate}
          setHoraSeleccionada={setHoraSeleccionada}
          confirmarCita={confirmarCita}
          setPaso={setPaso}
          horaEsPasada={horaEsPasada}
          confirmarCitaMutation={confirmarCitaMutation}
          showSoftToast={show}
        />
      )}

      {/* PASO 3: Confirmación */}
      {paso === "confirmacion" && citaProgramada && (
        <ConfirmacionCita cita={citaProgramada} onFinalizar={handleFinalizar} />
      )}

      {/* Modales */}
      <ConfirmCancelModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => citaAEliminar && cancelarCita(citaAEliminar)}
      />

      <ConfirmCancelSolicitudModal
        open={showCancelSolicitudModal}
        onClose={() => setShowCancelSolicitudModal(false)}
        onConfirm={() =>
          solicitudAEliminar && cancelarSolicitud(solicitudAEliminar)
        }
      />
    </div>
  );
}
