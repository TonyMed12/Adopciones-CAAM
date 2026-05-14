"use client";

import React, { useEffect } from "react";
import Pagination from "@/components/ui/Pagination";

import { useUsuarioAuth } from "@/features/usuarios/hooks/useUsuarioAuth";
import { useMascotasAdoptadasUsuario } from "@/features/citas/hooks/useMascotasAdoptadasUsuario";
import { useCitasVeterinariasUsuario } from "@/features/citas/queries/citas-veterinarias-queries";

import { useCitasVeterinariasUsuarioPageState } from "@/features/citas/hooks/useCitasVeterinariasUsuarioPageState";
import { useCalendarioCitaVeterinaria } from "@/features/citas/hooks/useCalendarioCitaVeterinaria";
import { useCrearCitaVeterinaria } from "@/features/citas/hooks/useCrearCitaVeterinaria";

import CitasVeterinariasUsuarioLista from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioLista";
import { CitasVeterinariasUsuarioAgendar } from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioAgendar";
import CitasVeterinariasUsuarioSkeleton from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioSkeleton";
import { CitasVeterinariasUsuarioHeader } from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioHeader";

const ITEMS_PER_PAGE = 10;

function crearFechaLocal(fechaStr: string, horaStr: string) {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const [hh, mm] = horaStr.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0);
}

export default function CitasVeterinariasPage() {
  const authId = useUsuarioAuth();

  const {
    modo,
    setModo,
    filtro,
    setFiltro,
    mensaje,
    setMensaje,
    mascotaSeleccionada,
    setMascotaSeleccionada,
    fechaSeleccionada,
    setFechaSeleccionada,
    horaSeleccionada,
    setHoraSeleccionada,
    motivo,
    setMotivo,
  } = useCitasVeterinariasUsuarioPageState();

  const { data: mascotas = [] } = useMascotasAdoptadasUsuario(authId || "");

  const {
    data,
    isLoading: loadingCitas,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCitasVeterinariasUsuario(authId);

  const [uiPage, setUiPage] = React.useState(1);

  const citas = data?.pages.flatMap((p) => p.items) ?? [];

  const totalCitas =
    data?.pages?.[0]?.total ?? citas.length;

  const bloqueado = citas.some((c) => c.estado === "pendiente");

  const prioridad = {
    pendiente: 1,
    aprobada: 2,
    cancelada: 3,
  };

  const citasOrdenadas = [...citas].sort((a, b) => {
    const pa = prioridad[a.estado] ?? 99;
    const pb = prioridad[b.estado] ?? 99;
    if (pa !== pb) return pa - pb;
    return (
      new Date(a.fecha_cita).getTime() -
      new Date(b.fecha_cita).getTime()
    );
  });

  const pagesLoaded = data?.pages.length ?? 1;

  const totalPages = hasNextPage
    ? pagesLoaded + 1
    : pagesLoaded;

  const paginatedCitas = citasOrdenadas.slice(
    (uiPage - 1) * ITEMS_PER_PAGE,
    uiPage * ITEMS_PER_PAGE
  );

  const handlePageChange = async (nextPage: number) => {
    if (nextPage < uiPage) {
      setUiPage(nextPage);
      return;
    }

    if (
      nextPage > pagesLoaded &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      await fetchNextPage();
    }

    setUiPage(nextPage);
  };

  // 🔹 Ocultar mensaje después de 5 segundos
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(() => setMensaje(null), 5000);
    return () => clearTimeout(t);
  }, [mensaje, setMensaje]);

  const {
    horasDisponibles,
    celdas,
    cambiarMes,
    hoy,
    mesActual,
    anioActual,
    nombreMes,
  } = useCalendarioCitaVeterinaria();

  const crearCita = useCrearCitaVeterinaria({
    authId: authId || "",
    mascotas,
    fechaSeleccionada,
    horaSeleccionada,
    motivo,
    setMensaje,
    setModo,
    setFechaSeleccionada,
    setHoraSeleccionada,
    setMotivo,
    setMascotaSeleccionada,
  });

  const obtenerMascota = (adopcion_id: string) =>
    mascotas.find((m) => m.adopcion_id === adopcion_id)?.mascota_nombre ||
    "Desconocida";

  const esExito = mensaje?.startsWith("✅");

  return (
    <div className="max-w-6xl mx-auto">
      <CitasVeterinariasUsuarioHeader
        modo={modo}
        setModo={setModo}
        bloqueado={bloqueado}
        setMensaje={setMensaje}
      />

      {mensaje && (
        <div
          role="alert"
          className={`
            mb-5 flex items-start gap-3 text-sm p-3.5 rounded-2xl border
            ${
              esExito
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }
          `}
        >
          <span className="leading-relaxed">{mensaje}</span>
        </div>
      )}

      {loadingCitas ? (
        <CitasVeterinariasUsuarioSkeleton />
      ) : modo === "lista" ? (
        <>
          <CitasVeterinariasUsuarioLista
            citas={paginatedCitas}
            filtro={filtro}
            setFiltro={setFiltro}
            obtenerMascota={obtenerMascota}
          />

          {totalCitas > ITEMS_PER_PAGE && (
            <Pagination
              page={uiPage}
              totalPages={totalPages}
              onChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalCitas}
              itemsLabel="citas"
            />
          )}
        </>
      ) : (
        <CitasVeterinariasUsuarioAgendar
          mascotas={mascotas}
          mascotaSeleccionada={mascotaSeleccionada}
          setMascotaSeleccionada={setMascotaSeleccionada}
          fechaSeleccionada={fechaSeleccionada}
          setFechaSeleccionada={setFechaSeleccionada}
          horaSeleccionada={horaSeleccionada}
          setHoraSeleccionada={setHoraSeleccionada}
          motivo={motivo}
          setMotivo={setMotivo}
          horasDisponibles={horasDisponibles}
          celdas={celdas}
          cambiarMes={cambiarMes}
          hoy={hoy}
          mesActual={mesActual}
          anioActual={anioActual}
          nombreMes={nombreMes}
          onConfirmar={() => {
            if (
              !mascotaSeleccionada ||
              !fechaSeleccionada ||
              !horaSeleccionada
            ) {
              setMensaje("Completa todos los campos antes de confirmar la cita.");
              return;
            }

            const fechaLocal = crearFechaLocal(
              fechaSeleccionada,
              horaSeleccionada
            );

            crearCita.mutate({
              adopcion_id: mascotaSeleccionada.adopcion_id,
              fecha_cita: fechaLocal.toISOString(),
              motivo,
            });
          }}
        />
      )}
    </div>
  );
}
