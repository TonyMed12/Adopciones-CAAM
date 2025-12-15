"use client";

import React, { useState } from "react";

import { CalendarCheck, PawPrint, CheckCircle2, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { isWeekend } from "date-fns";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import ConfirmCancelModal from "@/features/adopciones/components/client/ConfirmCancelModal";
import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";
import { FileText } from "lucide-react";
import { XCircle } from "lucide-react";


import { useMisCitasQuery } from "@/features/citas/hooks/useMisCitasQuery";
import { useCancelarCitaMutation } from "@/features/citas/hooks/useCancelarCitaMutation";
import { useCancelarSolicitudAdopcionMutation } from "@/features/citas/hooks/useCancelarSolicitudAdopcionMutation";
import { useConfirmarCitaMutation } from "@/features/citas/hooks/useConfirmarCitaMutation";
import { useHorasOcupadasQuery } from "@/features/citas/hooks/useHorasOcupadasQuery";


export default function MisCitasPage() {
  const { data, isLoading, isError } = useMisCitasQuery();
  const solicitudActiva = data?.solicitudActiva ?? null;
  const adopcionEstado = data?.adopcionEstado ?? null;
  const perfil = data?.perfil ?? null;

  const citaProgramada = data?.citaProgramada ?? null;
  const nuevaCita = citaProgramada;


  const confirmarCitaMutation = useConfirmarCitaMutation();
  const cancelarCitaMutation = useCancelarCitaMutation();
  const cancelarSolicitudMutation = useCancelarSolicitudAdopcionMutation();




  const [loadingForm, setLoadingForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [citaAEliminar, setCitaAEliminar] = useState<string | null>(null);
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState<string | null>(
    null
  );

  const [paso, setPaso] = useState<"inicio" | "formulario" | "confirmacion">(
    "inicio"
  );
  const [fecha, setFecha] = useState("");

  const [fechaDate, setFechaDate] = useState<Date | undefined>(undefined);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const { data: horasOcupadas = [] } = useHorasOcupadasQuery(fecha);


  function showSoftToast(message: string) {
    const alerta = document.createElement("div");

    alerta.textContent = message;

    alerta.className = `
    fixed bottom-6 left-1/2 -translate-x-1/2
    bg-[#fffaf4] text-[#8b4513]
    border border-[#e8c9b8]
    font-semibold px-6 py-3
    rounded-xl shadow-lg
    z-[99999] animate-fadeIn
  `;

    document.body.appendChild(alerta);

    setTimeout(() => {
      alerta.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => alerta.remove(), 600);
    }, 2500);
  }

  function horaEsPasada(hora: string, fechaSeleccionada?: Date) {
    if (!fechaSeleccionada) return false;

    const hoy = new Date();
    const esHoy =
      fechaSeleccionada.getFullYear() === hoy.getFullYear() &&
      fechaSeleccionada.getMonth() === hoy.getMonth() &&
      fechaSeleccionada.getDate() === hoy.getDate();

    if (!esHoy) return false;

    // Convertir "HH:mm" a fecha real
    const [h, m] = hora.split(":").map(Number);
    const fechaHora = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      h,
      m,
      0
    );

    return fechaHora < hoy; // true si ya pasó
  }

  function handleFinalizar() {
    setPaso("inicio");
  }


  async function confirmarCita() {
    if (!fecha || !horaSeleccionada || !solicitudActiva || !perfil) {
      showSoftToast("Selecciona fecha y hora");
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


  async function cancelarCita(id: string) {
    await cancelarCitaMutation.mutateAsync(id);

    try {
      await fetch("/api/email/cita-cancelada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: perfil.email,
          nombre: perfil.nombres,
          mascota: solicitudActiva?.mascota?.nombre,
          motivo: "Cancelada por el adoptante",
        }),
      });
    } catch { }
  }

  async function cancelarSolicitud(id: string) {
    await cancelarSolicitudMutation.mutateAsync(id);
    showSoftToast("Solicitud cancelada correctamente 🐾");
  }




  // ------------------------------------------------------------
  // 🧱 Render principal
  // ------------------------------------------------------------
  if (isLoading) {
    return (
      <p className="text-center py-10 text-[#7a5c49]">
        Cargando...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-600">
        Error al cargar tus citas.
      </p>
    );
  }


  return (
    <div className="space-y-8">
      <PageHead
        title="Mis citas de adopción"
        subtitle="Consulta o agenda tu cita para conocer a tu futura mascota 🐾"
      />

      {/* PASO 1 */}
      {paso === "inicio" && (
        <>
          {citaProgramada ? (            // 🗓️ Si ya hay una cita programada
            <div className="rounded-2xl border border-[#eadacb] bg-[#fffaf4] p-8 shadow-md text-[#2b1b12]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* 🐶 Imagen de mascota */}
                <img
                  src={citaProgramada.mascota?.imagen_url || "/placeholder.jpg"}
                  alt={citaProgramada.mascota?.nombre || "Mascota"}
                  className="h-48 w-48 rounded-xl object-cover border border-[#e8c9b8] shadow-sm"
                />

                {/* 📅 Información de la cita */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-extrabold text-[#8b4513] flex items-center justify-center md:justify-start gap-2">
                    <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                    ¡Tienes una cita programada!
                  </h3>
                  <p className="mt-2 text-sm text-[#7a5c49]">
                    Te esperamos en el{" "}
                    <strong className="text-[#BC5F36]">CAAM</strong> para
                    conocer a{" "}
                    <span className="font-semibold">
                      {citaProgramada.mascota?.nombre}
                    </span>
                    .
                  </p>

                  {/* Fecha y hora */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <div className="rounded-xl bg-[#fffdfb] border border-[#f0d9c9] px-5 py-3 shadow-sm">
                      <p className="text-sm text-[#5a4b3f]">
                        <strong>📅 Fecha:</strong>{" "}
                        <span className="font-semibold text-[#BC5F36]">
                          {(() => {
                            const [y, m, d] = citaProgramada.fecha_cita
                              .split("-")
                              .map(Number);
                            const fechaOK = new Date(y, m - 1, d);

                            return fechaOK.toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          })()}
                        </span>
                      </p>
                      <p className="text-sm text-[#5a4b3f] mt-1">
                        <strong>🕒 Hora:</strong>{" "}
                        <span className="font-semibold text-[#BC5F36]">
                          {citaProgramada.hora_cita.slice(0, 5)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Cancelar cita */}
                  <div className="mt-6">
                    <Button
                      className="bg-[#fff5f3] border border-[#e8c9b8] text-[#BC5F36] hover:bg-[#ffe7e2] transition-all duration-200 cursor-pointer rounded-lg"
                      onClick={() => {
                        setCitaAEliminar(citaProgramada.id);
                        setShowCancelModal(true);
                      }}
                    >
                      Cancelar cita
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : solicitudActiva && adopcionEstado === "pendiente" ? (
            // 🟡 YA MANDÓ EL FORMULARIO → MENSAJE DE REVISIÓN
            <div
              className="
          mt-8
          rounded-2xl 
          border border-[#f2d4b7] 
          bg-gradient-to-br from-[#fff7f1] via-white to-[#ffe9d6]
          p-8 
          shadow-[0_4px_18px_rgba(188,95,54,0.15)]
          animate-fade-in
        "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
              h-14 w-14 
              rounded-full 
              bg-[#BC5F36] 
              text-white 
              flex items-center justify-center 
              shadow-md
            "
                >
                  <FileText className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#8b4513]">
                    Tu formulario está en revisión
                  </h3>
                  <p className="text-sm text-[#7a5c49] mt-1">
                    Ya completaste el formulario de adopción. El equipo del CAAM
                    está revisando tu información. Por favor espera la
                    confirmación final.
                  </p>
                </div>
              </div>

              <div className="mt-5 text-sm text-[#7a5c49] leading-relaxed">
                Te avisaremos cuando tu proceso avance al siguiente paso.
              </div>
            </div>
          ) : solicitudActiva && adopcionEstado === "aprobada" ? (
            // 💚 ADOPCIÓN APROBADA
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-green-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                ¡Adopción aprobada! 🎉
              </h3>
              <p className="mt-2 text-sm text-green-700">
                ¡Felicidades! El proceso de adopción ha sido aprobado. El CAAM
                se pondrá en contacto contigo para coordinar los pasos finales.
              </p>
            </div>
          ) : solicitudActiva && adopcionEstado === "rechazada" ? (
            // 🔴 ADOPCIÓN RECHAZADA
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-red-800 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Adopción no aprobada
              </h3>
              <p className="mt-2 text-sm text-red-700">
                En esta ocasión tu proceso de adopción no fue aprobado. Puedes
                iniciar una nueva solicitud con otra mascota cuando lo desees.
              </p>
            </div>
          ) : solicitudActiva ? (
            solicitudActiva.estado === "en_proceso" ? (
              // ⭐ YA NO SE PUEDE AGENDAR CITA: TIENE QUE LLENAR FORMULARIO FINAL
              <div
                className="
    mt-8
    rounded-2xl 
    border border-[#eadacb] 
    bg-gradient-to-br from-[#fff7f1] via-white to-[#fff2e3]
    p-8 
    shadow-[0_4px_18px_rgba(188,95,54,0.15)]
    animate-fade-in
  "
              >
                {/* Encabezado */}
                <div className="flex items-center gap-4">
                  <div
                    className="
        h-14 w-14 
        rounded-full 
        bg-[#BC5F36] 
        text-white 
        flex items-center justify-center 
        shadow-md
      "
                  >
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#8b4513]">
                      ¡Estás a un paso de adoptar! 🐾
                    </h3>
                    <p className="text-sm text-[#7a5c49] mt-1">
                      Ya realizaste tu cita y tu solicitud está en proceso.
                    </p>
                  </div>
                </div>

                {/* Cuerpo */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm sm:text-base text-[#5d4636] leading-relaxed">
                    Solo falta completar el
                    <strong className="text-[#BC5F36]">
                      {" "}
                      formulario final de adopción
                    </strong>
                    . Esto permitirá al equipo del CAAM continuar con la
                    evaluación.
                  </p>

                  <p className="text-sm text-[#a4836b] italic">
                    “Un paso más para darle un hogar lleno de cariño.”
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => {
                      setLoadingForm(true);
                      window.location.href = `/dashboards/usuario/form-adopcion/${solicitudActiva.id}`;
                    }}
                    disabled={loadingForm}
                    className="
    bg-[#BC5F36] 
    text-white 
    px-6 py-3 
    rounded-xl 
    shadow-md 
    transition-all 
    cursor-pointer
    flex items-center gap-2
    hover:bg-[#a64d2e] hover:shadow-lg hover:shadow-[#bc5f36]/40
    active:scale-95
    disabled:opacity-70 disabled:cursor-not-allowed
  "
                  >
                    {loadingForm ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <FileText className="h-5 w-5" />
                        Completar formulario
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              // 🐾 SOLICITUD PENDIENTE → SÍ PUEDE AGENDAR CITA
              <div className="rounded-2xl border border-[#eadacb] bg-[#fffdf9] shadow-md p-8 space-y-6">
                {/* Encabezado */}
                <div className="text-center">
                  <h3 className="text-xl font-extrabold text-[#8b4513]">
                    Agenda tu visita 🐾
                  </h3>

                  <p className="mt-2 text-sm text-[#7a5c49] max-w-md mx-auto leading-relaxed">
                    Estás a un paso de convivir con{" "}
                    <span className="font-semibold text-[#BC5F36]">
                      {solicitudActiva.mascota?.nombre}
                    </span>
                    . Elige un día y horario para tu visita al CAAM.
                  </p>

                  <p className="mt-3 text-xs text-[#a4836b] italic">
                    “La conexión empieza con un primer encuentro.”
                  </p>
                </div>

                {/* BARRA DECORATIVA */}
                <div
                  className="
      h-2 w-full rounded-full 
      bg-gradient-to-r from-[#BC5F36] to-[#d9a48f]
      lg:hidden
    "
                />
                <div
                  className="
      hidden lg:block 
      w-2 
      rounded-full 
      bg-gradient-to-b 
      from-[#BC5F36] 
      to-[#d9a48f]
      opacity-80
      shadow-sm
    "
                />

                {/* CONTENIDO PRINCIPAL */}
                {/* 🏢 Información del CAAM — CARD MÁS ESTRECHO */}
                <div
                  className="
    w-full 
    max-w-[820px]           /* 🔥 límite máximo de ancho */
    mx-auto                 /* centrar */
    rounded-2xl 
    border border-[#eadacb] 
    bg-[#fffaf4] 
    shadow-md 
    p-4 sm:p-5
    flex flex-col lg:flex-row
    gap-5
    scale-[0.92] sm:scale-[0.94] lg:scale-[0.88]   /* más compacto */
    origin-top
  "
                >
                  {/* BARRA DECORATIVA */}
                  <div
                    className="
      h-1.5 w-full rounded-full
      bg-gradient-to-r from-[#BC5F36] to-[#d9a48f]
      lg:hidden
    "
                  />

                  <div
                    className="
      hidden lg:block 
      w-1.5
      rounded-full 
      bg-gradient-to-b 
      from-[#BC5F36] 
      to-[#d9a48f]
      opacity-80
      shadow-sm
    "
                  />

                  {/* 🏢 CARD COMPACTO — DIRECCIÓN + MAPA */}
                  <div
                    className="
    w-full 
    max-w-[760px]        /* ancho controlado */
    mx-auto
    rounded-2xl 
    border border-[#eadacb] 
    bg-[#fffaf4] 
    shadow-md 
    p-4 sm:p-5
    flex flex-col lg:flex-row
    gap-4
  "
                  >
                    {/* COLUMNA IZQUIERDA — INFORMACIÓN */}
                    <div className="flex-1 text-center lg:text-left space-y-2">
                      <h4 className="text-base sm:text-lg font-extrabold text-[#8b4513] flex items-center justify-center lg:justify-start gap-2">
                        <MapPin className="h-4 w-4 text-[#BC5F36]" />
                        Centro de Atención Animal de Morelia (CAAM)
                      </h4>

                      <p className="text-xs sm:text-sm text-[#7a5c49] leading-relaxed max-w-[360px] mx-auto lg:mx-0">
                        Elige una fecha y horario para tu visita.
                      </p>

                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-start lg:items-center gap-2 justify-center lg:justify-start">
                          <span className="text-base">📍</span>
                          <p className="font-semibold leading-tight">
                            Álamos No. 395, Col. Centenario,
                            <br />
                            C.P. 58128, Morelia, Mich.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                          <span className="text-base">📞</span>
                          <p className="font-semibold">
                            443 321 4731 / 443 321 1392
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                          🕒{" "}
                          <p>
                            <strong>Horario:</strong> 8:30 AM – 2:00 PM
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                          📅{" "}
                          <p>
                            <strong>Días hábiles:</strong> Lunes a Viernes
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* COLUMNA DERECHA — MAPA */}
                    <div
                      className="
      w-full 
      lg:w-56 xl:w-52        /* estrecho */
      rounded-xl 
      bg-[#fffaf4]
      border border-[#eadacb]
      shadow-md 
      overflow-hidden
      flex flex-col
    "
                    >
                      <div className="w-full h-32 sm:h-36 relative">
                        <iframe
                          title="CAAM Mapa"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.2406524803994!2d-101.1734343!3d19.7266529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86a28e98ea321735%3A0x191bd93c0bd16085!2sCentro%20de%20Atenci%C3%B3n%20Animal!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                        />

                        {/* CLIC EN TODO EL MAPA → ABRIR GOOGLE MAPS */}
                        <a
                          href="https://www.google.com/maps/place/Centro+de+Atenci%C3%B3n+Animal/@19.7266529,-101.1734343,17z/data=!3m1!4b1!4m6!3m5!1s0x86a28e98ea321735:0x191bd93c0bd16085!8m2!3d19.7266479!4d-101.1708594!16s%2Fg%2F1td65n44"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 cursor-pointer bg-transparent"
                          title="Abrir en Google Maps"
                        />
                      </div>

                      <div className="p-3 text-center">
                        <h5 className="text-xs font-bold text-[#8b4513]">
                          Ubicación del CAAM
                        </h5>
                        <p className="text-[11px] text-[#7a5c49] mt-1 leading-relaxed">
                          Haz clic en el mapa para abrir la ubicación en Google
                          Maps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {/* BOTÓN PRINCIPAL */}
                  <Button
                    className="
        w-full sm:w-auto
        bg-[#BC5F36]
        hover:bg-[#a64d2e]
        text-white font-semibold
        px-8 py-4 
        rounded-xl
        shadow-md shadow-[#d9b19d]/40
        transition-all duration-200
        cursor-pointer
        hover:-translate-y-[2px]
        active:scale-95
        flex items-center justify-center gap-2
      "
                    onClick={() => setPaso("formulario")}
                  >
                    <CalendarCheck className="h-5 w-5" />
                    Agendar cita
                  </Button>

                  {/* BOTÓN CANCELAR */}
                  <Button
                    className="
        w-full sm:w-auto
        bg-[#fff5f3]
        border border-[#e8c9b8]
        text-[#BC5F36]
        hover:bg-[#ffe7e2]
        px-8 py-4 
        rounded-xl
        font-semibold
        transition-all duration-200
        cursor-pointer
        hover:-translate-y-[2px]
        active:scale-95
      "
                    onClick={() => {
                      setSolicitudAEliminar(solicitudActiva.id);
                      setShowCancelSolicitudModal(true);
                    }}
                  >
                    Cancelar solicitud
                  </Button>
                </div>

                {/* Días restantes */}
                {(() => {
                  if (!solicitudActiva?.created_at) return null;

                  const fechaCreacion = new Date(solicitudActiva.created_at);
                  const diferenciaMs =
                    new Date().getTime() - fechaCreacion.getTime();
                  const diasTranscurridos = Math.floor(
                    diferenciaMs / (1000 * 60 * 60 * 24)
                  );
                  const diasRestantes = 3 - diasTranscurridos;

                  return (
                    <p className="text-center text-xs font-semibold text-[#BC5F36]">
                      ⏳ Tu solicitud expira en{" "}
                      {diasRestantes > 0
                        ? `${diasRestantes} días`
                        : "0 días (expirada)"}
                    </p>
                  );
                })()}
              </div>
            )
          ) : (
            // 💤 Si no hay ni cita ni solicitud
            <p className="text-center text-[#7a5c49] py-10">
              No tienes solicitudes activas ni citas pendientes.
            </p>
          )}
        </>
      )}

      {/* PASO 2: Formulario para agendar cita */}
      {paso === "formulario" && solicitudActiva && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-5 sm:p-8 shadow-sm text-[#2b1b12]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-[#8b4513]">
              <PawPrint className="h-5 w-5 text-[#BC5F36]" />
              Cita para {solicitudActiva.mascota?.nombre}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-[#7a5c49] max-w-xl leading-relaxed">
              Estás a un paso de convivir con {solicitudActiva.mascota?.nombre}.
              Elige un día y horario para tu visita al CAAM.
              <br />
              <span className="italic text-[#BC5F36] text-sm sm:text-base">
                “La conexión empieza con un primer encuentro.”
              </span>
            </p>
            <Button
              variant="ghost"
              onClick={() => setPaso("inicio")}
              className="
    text-[#BC5F36] 
    hover:text-[#8b4513] 
    hover:bg-[#fff3ee] 
    transition-all 
    duration-200 
    cursor-pointer
  "
            >
              ← Regresar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* 🐶 Información de la mascota */}
            <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-5 sm:p-6 flex flex-col items-center text-center shadow-sm">
              <img
                src={solicitudActiva.mascota?.imagen_url || "/placeholder.jpg"}
                alt={solicitudActiva.mascota?.nombre}
                className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg object-cover border border-[#eadacb] mb-4 shadow-md"
              />
              <h4 className="text-lg font-bold text-[#8b4513] mb-1">
                {solicitudActiva.mascota?.nombre}
              </h4>
              <p className="text-sm text-[#7a5c49] mb-2">
                Estado actual:{" "}
                <span className="font-semibold text-[#BC5F36] capitalize">
                  {solicitudActiva.mascota?.estado === "en_proceso"
                    ? "Esperando por ti"
                    : solicitudActiva.mascota?.estado}
                </span>
              </p>
              <div className="mt-2">
                <p className="text-sm text-[#7a5c49] flex items-center justify-center gap-1">
                  <MapPin className="h-4 w-4 text-[#BC5F36]" />
                  <strong>CAAM - Centro de Atención Animal de Morelia</strong>
                </p>
                <p className="text-xs text-[#a4836b] mt-1">
                  Av. Acueducto 1234, Morelia, Michoacán
                </p>
              </div>
            </div>

            {/* 🗓️ Formulario de selección */}
            <div className="space-y-6">
              {/* FECHA */}
              <div>
                <label className="block text-sm font-extrabold mb-3 text-[#2b1b12]">
                  Selecciona la fecha de tu visita
                </label>
                <div className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-3 sm:p-4 overflow-x-auto flex justify-start sm:justify-center scrollbar-thin scrollbar-thumb-[#d6bba8] scrollbar-track-transparent">
                  <div className="min-w-[320px] sm:min-w-[380px]">
                    <Calendar
                      mode="single"
                      selected={fechaDate}
                      onSelect={async (day: Date | undefined) => {
                        setFechaDate(day || undefined);

                        if (!day) {
                          setFecha("");
                          return;
                        }

                        const hoy = new Date();
                        const limite = new Date();
                        limite.setMonth(limite.getMonth() + 1);

                        if (day > limite) {
                          showSoftToast(
                            "Solo puedes agendar dentro del próximo mes 📅"
                          );
                          setFecha("");
                          return;
                        }

                        const year = day.getFullYear();
                        const month = String(day.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const dayNum = String(day.getDate()).padStart(2, "0");

                        const fechaStr = `${year}-${month}-${dayNum}`;
                        setFecha(fechaStr);

                        // Cargar horas ocupadas
                        console.log("🟠 fecha seleccionada:", fechaStr);
                      }}
                      disabled={(date: Date) => {
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);

                        const dia = new Date(date);
                        dia.setHours(0, 0, 0, 0);

                        return isWeekend(dia) || dia < hoy;
                      }}
                      className="rounded-md border-0 shadow-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#a4836b] text-center mt-2">
                  (Solo se pueden agendar citas de lunes a viernes)
                </p>
              </div>

              {/* HORAS */}
              <div>
                <label className="block text-sm font-extrabold mb-2 text-[#2b1b12]">
                  Hora disponible
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    "08:30",
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "11:30",
                    "12:00",
                    "12:30",
                    "13:00",
                    "13:30",
                    "14:00",
                  ].map((hora) => {
                    const noHayFecha = !fecha;

                    const esPasada = horaEsPasada(hora, fechaDate);

                    const ocupada = horasOcupadas.includes(hora);

                    const deshabilitada = noHayFecha || esPasada || ocupada;

                    console.log(
                      "🔶 hora:",
                      hora,
                      " | ocupada?:",
                      horasOcupadas.includes(hora),
                      " | horasOcupadas:",
                      horasOcupadas
                    );

                    return (
                      <div key={hora} className="relative group">
                        <button
                          disabled={deshabilitada}
                          onClick={() => {
                            if (noHayFecha) {
                              showSoftToast("Selecciona una fecha primero 📅");
                              return;
                            }
                            if (!deshabilitada) {
                              setHoraSeleccionada(hora);
                            }
                          }}
                          className={`
          rounded-lg border px-3 py-2 text-sm font-semibold 
          text-center select-none w-full transition-all
          ${deshabilitada
                              ? "cursor-not-allowed opacity-40 bg-[#f5e9e4] border-[#e0cfc5]"
                              : horaSeleccionada === hora
                                ? "bg-[#BC5F36] border-[#BC5F36] text-white shadow-md"
                                : "bg-[#fffaf4] border-[#eadacb] text-[#2b1b12] hover:bg-[#ffe8df] hover:border-[#BC5F36]"
                            }
        `}
                        >
                          {hora}
                        </button>

                        {deshabilitada && (
                          <div
                            className="
            absolute -top-10 left-1/2 -translate-x-1/2
            bg-[#2b1b12] text-[#fffaf4] text-xs
            px-3 py-1 rounded-lg shadow-lg border border-[#eadacb]
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none whitespace-nowrap
          "
                          >
                            {noHayFecha
                              ? "Selecciona una fecha primero 📅"
                              : esPasada
                                ? "Esta hora ya pasó hoy ⏳"
                                : "Ya hay una cita a esta hora 🐾"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONFIRMAR */}
              <div className="pt-6 text-center sticky bottom-4 bg-white/80 backdrop-blur-sm py-3 rounded-xl shadow-md sm:static sm:shadow-none sm:bg-transparent">
                <Button
                  className={`
    px-8 py-3 transition-all duration-200 
    cursor-pointer select-none
    ${!fecha || !horaSeleccionada
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-[#a64d2e] hover:shadow-md"
                    }
  `}
                  disabled={
                    !fecha ||
                    !horaSeleccionada ||
                    confirmarCitaMutation.isPending
                  }
                  onClick={confirmarCita}
                >
                  <CalendarCheck className="h-5 w-5 mr-2" />
                  Confirmar cita
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PASO 3: Confirmación */}
      {paso === "confirmacion" && nuevaCita && (
        <section className="rounded-2xl border border-[#f0e0d6] bg-[#fffdfb] p-10 shadow-md text-[#2b1b12]">
          {/* Encabezado principal */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-full bg-[#BC5F36] text-white flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#2b1b12]">
                ¡Cita confirmada!
              </h3>
              <p className="mt-1 text-base text-[#5a4b3f]">
                Tu visita ha sido agendada exitosamente 🐾. Te esperamos en el{" "}
                <span className="font-semibold text-[#BC5F36]">CAAM</span>; por
                favor llega <strong>10 minutos antes</strong>.
              </p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 🐶 MASCOTA */}
            <div className="rounded-2xl border border-[#f0d9c9] bg-[#fff8f4] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={nuevaCita.mascota?.imagen_url || "/placeholder.jpg"}
                alt={nuevaCita.mascota?.nombre || "Mascota"}
                className="h-56 w-56 rounded-xl object-cover border border-[#e8c9b8] mb-4 shadow-md hover:scale-[1.02] transition-transform"
              />
              <h4 className="text-xl font-bold text-[#8b4513] mb-1">
                {nuevaCita.mascota?.nombre}
              </h4>
              <p className="text-sm text-[#7a5c49] mb-3">
                Estado actual:{" "}
                <span className="font-semibold text-[#BC5F36]">
                  {nuevaCita.mascota?.estado === "en_proceso"
                    ? "Esperando por ti 🧡"
                    : nuevaCita.mascota?.estado}
                </span>
              </p>
              <div className="mt-3 text-sm">
                <p className="flex items-center justify-center gap-1 text-[#5b4032]">
                  <MapPin className="h-4 w-4 text-[#BC5F36]" />
                  <strong>CAAM - Centro de Atención Animal de Morelia</strong>
                </p>
                <p className="text-xs text-[#a4836b] mt-1">
                  Av. Acueducto 1234, Morelia, Michoacán
                </p>
              </div>
            </div>

            {/* 📅 FECHA Y HORA */}
            <div className="rounded-2xl border border-[#f0d9c9] bg-[#fff8f4] p-8 flex flex-col justify-center items-start shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="text-lg font-extrabold text-[#8b4513] mb-4 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                Detalles de tu cita
              </h4>
              <div className="text-base space-y-3 text-[#4b392f]">
                <p className="flex items-center gap-2">
                  📅 <strong>Fecha:</strong>{" "}
                  <span className="text-[#BC5F36] font-semibold">
                    {new Date(
                      nuevaCita.fecha_cita + "T00:00:00"
                    ).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  🕒 <strong>Hora:</strong>{" "}
                  <span className="text-[#BC5F36] font-semibold">
                    {nuevaCita.hora_cita.slice(0, 5)}
                  </span>
                </p>
              </div>

              <div className="mt-6 border-t border-[#eadacb] pt-4 text-sm text-[#7a5c49] leading-relaxed">
                <p>
                  Si necesitas reprogramar tu cita, comunícate con el equipo del{" "}
                  <span className="text-[#BC5F36] font-medium">CAAM</span> o
                  cancélala desde tu panel de usuario.
                </p>
              </div>
            </div>
          </div>

          {/* BOTÓN FINALIZAR */}
          <div className="mt-10 flex justify-center">
            <Button
              className="
    bg-[#BC5F36] 
    hover:bg-[#a64d2e] 
    text-white 
    text-base 
    px-12 
    py-4 
    rounded-xl 
    shadow-md 
    transition-all 
    duration-200 
    cursor-pointer 
    hover:shadow-lg 
    select-none
  "
              onClick={handleFinalizar}
            >
              Finalizar
            </Button>
          </div>
        </section>
      )}
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
