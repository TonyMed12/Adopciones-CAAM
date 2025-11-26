"use client";

import PageHead from "@/components/layout/PageHead";

import { ClipboardList, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { useUsuarioAuth } from "@/features/usuarios/hooks/useUsuarioAuth";

import { useMascotasAdoptadasUsuario } from "@/features/citas/hooks/useMascotasAdoptadasUsuario";
import { useCitasVeterinariasUsuario } from "@/features/citas/queries/citas-veterinarias-queries";

import { useCitasVeterinariasUsuarioPageState } from "@/features/citas/hooks/useCitasVeterinariasUsuarioPageState";
import { useCalendarioCitaVeterinaria } from "@/features/citas/hooks/useCalendarioCitaVeterinaria";
import { useCrearCitaVeterinaria } from "@/features/citas/hooks/useCrearCitaVeterinaria";

import CitasVeterinariasUsuarioLista from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioLista";
import { CitasVeterinariasUsuarioAgendar } from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioAgendar";
import CitasVeterinariasUsuarioSkeleton from "@/features/citas/components/client/veterinarias/CitasVeterinariasUsuarioSkeleton";

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

  // QUERIES
  const { data: mascotas = [] } = useMascotasAdoptadasUsuario(authId || "");
  const {
    data: citas = [],
    isLoading: loadingCitas,
  } = useCitasVeterinariasUsuario(authId || "");

  const bloqueado = citas.some((c) => c.estado === "pendiente");

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

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl p-5 sm:p-8">
      {/* HEADER */}
      <PageHead
        title="Citas Veterinarias"
        subtitle="Agenda nuevas citas y revisa el estado de las existentes."
      />

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 text-center sm:text-left">
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <Button
            variant={modo === "lista" ? "primary" : "ghost"}
            onClick={() => setModo("lista")}
          >
            <ClipboardList className="w-4 h-4 mr-2" /> Mis citas
          </Button>

          <Button
            variant={modo === "agendar" ? "primary" : "ghost"}
            onClick={() => {
              if (bloqueado) {
                setMensaje(
                  "Ya tienes una cita pendiente. Espera la confirmación del CAAM antes de agendar otra."
                );
                return;
              }
              setMensaje(null);
              setModo("agendar");
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Agendar nueva cita
          </Button>
        </div>
      </div>

      {/* MENSAJE GLOBAL */}
      {mensaje && (
        <div
          className={`mt-4 text-center text-sm p-3 rounded-lg ${
            mensaje.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-yellow-50 text-yellow-800 border border-yellow-200"
          }`}
        >
          {mensaje}
        </div>
      )}

      {/* LOADING – SIN EARLY RETURN */}
      {loadingCitas ? (
        <CitasVeterinariasUsuarioSkeleton />
      ) : modo === "lista" ? (
        <CitasVeterinariasUsuarioLista
          citas={citas}
          filtro={filtro}
          setFiltro={setFiltro}
          obtenerMascota={obtenerMascota}
        />
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

            crearCita.mutate({
              adopcion_id: mascotaSeleccionada.adopcion_id,
              fecha_cita: `${fechaSeleccionada}T${horaSeleccionada}:00`,
              motivo,
            });
          }}
        />
      )}
    </div>
  );
}
