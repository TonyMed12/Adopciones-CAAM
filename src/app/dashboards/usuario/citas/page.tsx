"use client";

import React, { useState } from "react";

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

  const diasRestantes = useDiasRestantesSolicitud(
    solicitudActiva?.created_at
  );

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

  /* -------------------- States -------------------- */
  if (isLoading) {
    return <p className="text-center py-10 text-[#7a5c49]">Cargando...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-600">
        Error al cargar tus citas.
      </p>
    );
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-8">
      <PageHead
        title="Mis citas de adopción"
        subtitle="Consulta o agenda tu cita para conocer a tu futura mascota 🐾"
      />

      {/* PASO 1 */}
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
            <p className="text-center text-[#7a5c49] py-10">
              No tienes solicitudes activas ni citas pendientes.
            </p>
          )}
        </>
      )}

      {/* PASO 2 */}
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

      {/* PASO 3 */}
      {paso === "confirmacion" && citaProgramada && (
        <ConfirmacionCita
          cita={citaProgramada}
          onFinalizar={handleFinalizar}
        />
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