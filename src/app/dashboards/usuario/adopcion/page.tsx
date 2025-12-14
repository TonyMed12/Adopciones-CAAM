"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Info,
  XCircle,
  CalendarCheck,
  FileText,
  PawPrint,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import { showSoftToast } from "@/lib/showSoftToast";
import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";
import MascotaSeleccionadaCard from "@/features/adopciones/components/client/MascotaSeleccionadaCard";

import { useProcesoAdopcionQuery } from "@/features/adopciones/hooks/useProcesoAdopcionQuery";
import { useDocumentosParaAdopcionQuery } from "@/features/adopciones/hooks/useDocumentosParaAdopcionQuery";
import { useSubirDocumentoAdopcionMutation } from "@/features/adopciones/hooks/useSubirDocumentoAdopcionMutation";
import { useCancelarSolicitudAdopcionMutation } from
  "@/features/adopciones/hooks/useCancelarSolicitudAdopcionMutation";
import DocumentosSection from
  "@/features/adopciones/components/client/DocumentosSection";
import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import SolicitudPendienteSection from
  "@/features/adopciones/components/client/SolicitudPendienteSection";
import CitaProgramadaSection from "@/features/adopciones/components/client/CitaProgramadaSection";
import { mapCitaToCitaProgramadaUI } from
  "@/features/adopciones/mappers/mapCitaAdopcionToProgramadaUI";
import CitaAprobadaSection from "@/features/adopciones/components/client/CitaAprobadaSection";






const StepperAdopcion = dynamic(() => import("../../../../features/adopciones/components/client/StepperAdopcion"), {
  ssr: false,
});


export default function ProcesoAdopcionPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const from = qs.get("from");




  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useProcesoAdopcionQuery();

  const {
    data: documentosData,
    isLoading: isLoadingDocs,
    isError: isDocsError,
  } = useDocumentosParaAdopcionQuery();


  function capitalize(value?: string | null) {
    if (!value || typeof value !== "string") return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  function formateaFechaBonita(isoDate: string) {
    if (!isoDate) return "";

    const [year, month, day] = isoDate.split("-").map(Number);

    const fecha = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(fecha);
  }

  const cancelarSolicitudMutation = useCancelarSolicitudAdopcionMutation();

  async function handleConfirmCancelar() {
    if (!solicitudActiva?.id) return;

    await cancelarSolicitudMutation.mutateAsync(solicitudActiva.id);

    showSoftToast("Solicitud cancelada correctamente 🐾");
    setShowCancelSolicitudModal(false);
  }


  const [mostrarAgendar, setMostrarAgendar] = useState(false);
  const nombreMascota = qs.get("nombre");
  function BotonesProceso({ paso }: { paso: string | null }) {
    const router = useRouter();

    // Si viene del flujo automático (paso=2), mostramos solo el botón de agendar cita
    if (paso === "2") {
      return (
        <div className="mt-5 flex justify-center">
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboards/usuario/adopcion?paso=2")}
          >
            <CalendarCheck className="h-4 w-4" /> Agendar cita
          </Button>
        </div>
      );
    }

    // De lo contrario, flujo normal (ver mascotas disponibles)
    return (
      <div className="mt-5 flex justify-center">
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push("/dashboards/usuario/mascotas")}
        >
          <PawPrint className="h-4 w-4" /> Ver mascotas disponibles
        </Button>
      </div>
    );
  }


  const docs = documentosData?.documentos ?? [];

  const subirDocumentoMutation = useSubirDocumentoAdopcionMutation();

  const estado = documentosData?.estado ?? "sin_documentos";


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


  const [archivos, setArchivos] = useState<Record<string, File | undefined>>({
    identificacion: undefined,
    comprobante: undefined,
    curp: undefined,
  });


  const completos = useMemo(
    () => Object.values(archivos).every((f) => !!f),
    [archivos]
  );

  if (isLoading) {
    return (
      <div className="animate-pulse mt-4 rounded-xl border border-[#eadacb] bg-[#fff9f3] p-5 shadow-sm">
        <div className="h-4 w-32 bg-[#eadacb]/50 rounded mb-3"></div>
        <div className="h-3 w-full bg-[#eadacb]/40 rounded mb-2"></div>
        <div className="h-3 w-5/6 bg-[#eadacb]/40 rounded"></div>
      </div>
    );
  }

  if (isLoadingDocs) {
    return (
      <div className="animate-pulse mt-4 rounded-xl border border-[#eadacb] bg-[#fff9f3] p-5 shadow-sm">
        <div className="h-4 w-32 bg-[#eadacb]/50 rounded mb-3"></div>
        <div className="h-3 w-full bg-[#eadacb]/40 rounded mb-2"></div>
        <div className="h-3 w-5/6 bg-[#eadacb]/40 rounded"></div>
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

  const solicitudActiva = data?.solicitudActiva ?? null;
  const citaActiva = data?.citaActiva ?? null;
  const citaProgramadaUI = citaActiva
    ? mapCitaToCitaProgramadaUI(citaActiva)
    : null;
  const yaTieneAdopcion = data?.yaTieneAdopcion ?? false;
  const adopcionEstado = data?.adopcionEstado ?? null;

  const handlePickDocumento = (id: string, file?: File) => {
    setArchivos((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const deshabilitarEnviar =
    subirDocumentoMutation.isPending ||
    (estado === "sin_documentos"
      ? !Object.values(archivos).every(Boolean)
      : docs
        .filter((d) => d.estado === "rechazado")
        .some((d) => !archivos[d.tipo]));


  // --------------------------------------------------------
  // 💡 Render principal
  // --------------------------------------------------------
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


        {/* -------- Vista Aprobado -------- */}
        {estado === "aprobado" && (
          <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm text-[#2b1b12]">
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 border-b-2 border-b-green-300 bg-green-50 p-3 mb-4 shadow-sm animate-fade-in">
              {/* Ícono redondo */}
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-green-100 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              {/* Texto */}
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-green-800">
                  Documentos validados
                </span>
                <span className="text-xs text-green-700 mt-0.5">
                  Todo está en orden. Puedes continuar con tu proceso de
                  adopción.
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <StepperAdopcion
                activeStep={
                  adopcionEstado === "aprobada" ||
                    adopcionEstado === "rechazada"
                    ? 5 // ✅ Paso final: adopción aprobada
                    : adopcionEstado === "pendiente"
                      ? 4 // ✅ Paso de evaluación / revisión del formulario
                      : citaActiva
                        ? 3 // Cita realizada / aprobada
                        : solicitudActiva
                          ? 2 // Solicitud creada
                          : 1 // Documentos
                }
                solicitudId={citaActiva?.solicitud_id ?? null}
                blockedSteps={{
                  3: !(
                    citaActiva &&
                    citaActiva.estado === "completada" &&
                    citaActiva.asistencia === "asistio" &&
                    citaActiva.interaccion === "buena_aprobada"
                  ),
                  4: true,
                  5: true,
                }}
                onStepClick={(step) => {
                  if (step === 1) {
                    router.push("/dashboards/usuario/mascotas");
                    return;
                  }

                  if (step === 2) {
                    router.push("/dashboards/usuario/citas");
                    return;
                  }

                  if (step === 3) {
                    if (
                      citaActiva &&
                      citaActiva.estado === "completada" &&
                      citaActiva.asistencia === "asistio" &&
                      citaActiva.interaccion === "buena_aprobada"
                    ) {
                      router.push(
                        `/dashboards/usuario/form-adopcion/${citaActiva.solicitud_id}`
                      );
                    }
                    return;
                  }

                  if (step === 4) {
                    router.push("/dashboards/usuario/citas");
                    return;
                  }

                  // Por ahora los pasos 4 y 5 son solo informativos,
                  // no navegan a ningún lado.
                }}
              />
            </div>

            {/* 🔸 Bloque según estado */}
            {citaActiva ? (
              /* 🔐 NUEVA REGLA — SI YA EXISTE FORMULARIO DE ADOPCIÓN */
              adopcionEstado === "pendiente" ? (
                /* 🟡 Caso: Formulario ya enviado, en revisión */
                <div
                  className="
  mt-6 mb-6
  rounded-2xl 
  border border-[#f2d4b7] 
  bg-gradient-to-br from-[#fff7f1] via-white to-[#ffe9d6]
  p-6 sm:p-8 
  shadow-[0_4px_18px_rgba(188,95,54,0.18)]
  animate-fade-in
"
                >
                  {/* Icono */}
                  <div className="flex items-center gap-3">
                    <div
                      className="
      h-12 w-12 
      rounded-full 
      bg-[#BC5F36] 
      text-white 
      flex items-center justify-center 
      shadow-md
    "
                    >
                      <Info className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#8b4513]">
                        Tu formulario está en revisión
                      </h3>

                      <p className="text-sm sm:text-base text-[#7a5c49] mt-1">
                        Ya completaste el formulario de adopción. El equipo del
                        CAAM está revisando tu información.
                      </p>
                    </div>
                  </div>

                  {/* Mensaje adicional */}
                  <div className="mt-5 text-sm text-[#7a5c49] leading-relaxed">
                    Por favor espera la confirmación final. Te avisaremos cuando
                    tu proceso continúe al siguiente paso.
                  </div>

                  {/* Línea decorativa */}
                  <div className="mt-5 h-1 w-full bg-gradient-to-r from-[#BC5F36] to-[#e4a07e] rounded-full opacity-60"></div>
                </div>
              ) : adopcionEstado === "aprobada" ? (
                /* 💚 Caso: Adopción aprobada */
                <div className="rounded-xl border border-green-300 bg-green-50 p-5 mb-4 mt-5">
                  <h3 className="text-sm font-extrabold text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    ¡Adopción aprobada! 🎉
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    ¡Felicidades! El proceso de adopción ha sido aprobado. El
                    CAAM se pondrá en contacto contigo para los siguientes
                    pasos.
                  </p>
                </div>
              ) : adopcionEstado === "rechazada" ? (
                /* 🔴 Caso: Adopción rechazada */
                <div className="rounded-xl border border-red-300 bg-red-50 p-5 mb-4 mt-5">
                  <h3 className="text-sm font-extrabold text-red-800 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Adopción no aprobada
                  </h3>
                  <p className="mt-2 text-sm text-red-700">
                    En esta ocasión tu solicitud de adopción no fue aprobada.
                    Puedes volver a intentar más adelante o iniciar un nuevo
                    proceso con otra mascota cuando lo desees.
                  </p>
                </div>
              ) : citaProgramadaUI?.estado === "programada" ? (
                <CitaProgramadaSection
                  citaActiva={citaProgramadaUI}
                  estado={estado}
                  onVerCita={() => router.push("/dashboards/usuario/citas")}
                />

              ) : citaActiva.estado === "completada" &&
                citaActiva.asistencia === "asistio" &&
                citaActiva.interaccion === "buena_aprobada" ? (
                <CitaAprobadaSection
                  mascota={{
                    nombre: citaActiva.mascota?.nombre ?? "Mascota",
                    imagen_url: citaActiva.mascota?.imagen_url ?? null,
                  }}
                  onIrFormulario={() =>
                    router.push(
                      `/dashboards/usuario/form-adopcion/${citaActiva.solicitud_id}`
                    )
                  }
                />
              )
                : null
            ) : solicitudActiva ? (
              <SolicitudPendienteSection
                solicitudActiva={solicitudActiva}
                citaActiva={citaActiva}
                estado={estado}
                onCancelar={() => setShowCancelSolicitudModal(true)}
              />
            )
              : (
                /* ⚪ CASO 1: Aún sin solicitud ni cita */
                <div className="grid gap-3 sm:grid-cols-2 mt-5">
                  {/* 🐾 Paso 1: Mascota seleccionada */}
                  <div className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <PawPrint className="h-5 w-5 text-[#BC5F36]" />
                      <p className="text-sm font-extrabold text-[#2b1b12]">
                        1) Mascota seleccionada
                      </p>
                    </div>

                    {solicitudActiva?.mascota_id ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            solicitudActiva.mascota?.imagen_url ||
                            "/img/placeholder-mascota.jpg"
                          }
                          alt={solicitudActiva.mascota?.nombre || "Mascota"}
                          className="h-16 w-16 rounded-full object-cover border border-[#eadacb]"
                        />
                        <div>
                          <p className="font-semibold text-[#2b1b12]">
                            {solicitudActiva.mascota?.nombre ||
                              "Mascota sin nombre"}
                          </p>
                          <p className="text-xs text-[#7a5c49]">
                            Ya seleccionaste tu mascota favorita 💕
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 text-[#BC5F36]"
                            onClick={() =>
                              router.push("/dashboards/usuario/mascotas")
                            }
                          >
                            Cambiar mascota
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-1 text-sm text-[#7a5c49]">
                          Aún no has seleccionado una mascota.
                        </p>
                        <Button
                          className="mt-3 w-full"
                          onClick={() =>
                            router.push("/dashboards/usuario/mascotas")
                          }
                        >
                          Ver mascotas disponibles
                        </Button>
                      </>
                    )}
                  </div>

                  {/* 📅 Paso 2: Agendar visita */}
                  <div className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                      <p className="text-sm font-extrabold text-[#2b1b12]">
                        2) Agendar visita
                      </p>
                    </div>
                    <p className="text-sm text-[#7a5c49]">
                      Programa una cita para conocer a tu mascota seleccionada.
                    </p>

                    {!(
                      estado === "aprobado" &&
                      solicitudActiva &&
                      !citaActiva
                    ) && (
                        <Button
                          className="mt-3 w-full text-[#BC5F36]"
                          variant={
                            solicitudActiva?.mascota_id ? "default" : "ghost"
                          }
                          disabled={!solicitudActiva?.mascota_id}
                          onClick={() => router.push("/dashboards/usuario/citas")}
                        >
                          <CalendarCheck className="h-4 w-4 mr-1" /> Agendar visita
                        </Button>
                      )}

                    {!solicitudActiva?.mascota_id && (
                      <p className="text-xs text-[#a88b77] mt-2 italic">
                        Primero selecciona una mascota antes de agendar tu cita.
                      </p>
                    )}
                  </div>
                </div>
              )}
          </section>
        )}

        {/* FAQs */}
        {/* FAQs: solo visibles si aún no ha subido nada */}
        {estado === "sin_documentos" && (
          <section className="rounded-2xl border border-[#eadacb] bg-white p-5 text-[#2b1b12] shadow-sm">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[#BC5F36]" />
              <h3 className="text-sm font-extrabold">Preguntas frecuentes</h3>
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
              <li>• Formatos aceptados: PDF, JPG, PNG. Tamaño máx. 5 MB.</li>
              <li>• La revisión la realiza un administrador.</li>
              <li>
                • Si hay observaciones, podrás corregir y volver a enviar.
              </li>
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

/* ---------------- COMPONENTES ---------------- */
function BotonesProceso() {
  const [tieneSolicitudes, setTieneSolicitudes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSolicitudes() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("solicitudes_adopcion")
        .select("id, estado")
        .eq("perfil_id", user.id)
        .in("estado", ["pendiente", "aprobada"]);

      setTieneSolicitudes(!!data?.length);
    }

    fetchSolicitudes();
  }, []);

  return (
    <div className="mt-5 flex justify-center">
      {tieneSolicitudes ? (
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/dashboards/usuario/citas")}
        >
          <CalendarCheck className="h-5 w-5 mr-2" /> Agendar visita
        </Button>
      ) : (
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/dashboards/usuario/mascotas")}
        >
          <PawPrint className="h-5 w-5 mr-2" /> Ver mascotas disponibles
        </Button>
      )}
    </div>
  );
}

function CardAgendar({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-sm text-[#2b1b12]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
          Agendar visita
        </h3>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Regresar
        </Button>
      </div>

      <p className="text-sm text-[#7a5c49] mb-4">
        Aquí puedes revisar tus solicitudes activas o crear una nueva cita para
        conocer a una mascota antes de continuar con el proceso.
      </p>

      <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
        <p className="text-sm font-extrabold mb-2">Solicitudes activas</p>
        <Button
          className="w-full"
          onClick={() => router.push("/dashboards/usuario/citas")}
        >
          Ver mis solicitudes
        </Button>
      </div>

      <div className="mt-5 text-right">
        <Button
          variant="ghost"
          onClick={() => router.push("/usuario/citas")}
          className="px-5"
        >
          Crear nueva cita
        </Button>
      </div>
    </section>
  );
}

function StepCard({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#BC5F36]/15 text-[#BC5F36]">
          {icon}
        </span>
        <p className="text-sm font-extrabold text-[#2b1b12]">{title}</p>
      </div>
      <p className="mt-1 text-sm text-[#7a5c49]">{desc}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

function Stepper({ estado }: { estado: EstadoDocumentos }) {
  const steps = [
    { key: "sin_documentos", label: "1. Sube tus documentos" },
    { key: "en_revision", label: "2. Revisión del administrador" },
    { key: "aprobado", label: "3. Aprobado" },
  ] as const;
  const current =
    estado === "sin_documentos" ? 0 : estado === "en_revision" ? 1 : 2;
  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {steps.map((s, i) => (
        <li
          key={s.key}
          className={`rounded-xl border p-4 shadow-sm ${i === current
            ? "border-[#BC5F36] bg-[#fff4e7]"
            : "border-[#eadacb] bg-white"
            }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${i < current
                ? "bg-[#BC5F36] text-white"
                : i === current
                  ? "bg-[#BC5F36]/15 text-[#BC5F36]"
                  : "bg-[#f5ebe1] text-[#7a5c49]"
                }`}
            >
              {i < current ? "✓" : i + 1}
            </span>
            <p className="text-sm font-extrabold text-[#2b1b12]">{s.label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
