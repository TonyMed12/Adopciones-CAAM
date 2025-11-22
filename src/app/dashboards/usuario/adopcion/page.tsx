"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  FileUp,
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
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { showSoftToast } from "@/lib/showSoftToast";
import ConfirmCancelSolicitudModal from "@/features/adopciones/components/client/ConfirmCancelSolicitudModal";
import MascotaSeleccionadaCard from "@/features/adopciones/components/client/MascotaSeleccionadaCard";
const StepperAdopcion = dynamic(() => import("./StepperAdopcion"), {
  ssr: false,
});
const PanelEstado = dynamic(() => import("./PanelEstado"), { ssr: false });
const SeccionCarga = dynamic(() => import("./SeccionCarga"), {
  ssr: false,
  loading: () => <p className="text-sm text-[#7a5c49]">Cargando sección...</p>,
});

type Estado = "sin_documentos" | "en_revision" | "aprobado" | "rechazado";

export default function ProcesoAdopcionPage() {
  const [loadingDocs, setLoadingDocs] = useState(true);
  const router = useRouter();
  const qs = useSearchParams();
  const from = qs.get("from");
  const [solicitudActiva, setSolicitudActiva] = useState<any | null>(null);
  const [yaTieneAdopcion, setYaTieneAdopcion] = useState(false);
  const [estado, setEstado] = useState<Estado | "cargando">("cargando");
  const [docs, setDocs] = useState<
    {
      id: string;
      tipo: string;
      estado: string;
      motivo_rechazo?: string;
      url?: string;
    }[]
  >([]);
  const [citaActiva, setCitaActiva] = useState<any | null>(null);
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);
  const [adopcionEstado, setAdopcionEstado] = useState<string | null>(null);

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

  useEffect(() => {
    const supabase = createClient();

    const log = (...args: any[]) => {
      if (process.env.NODE_ENV === "development") console.log(...args);
    };

    async function cargarDatos() {
      // 1️⃣ Obtener usuario
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("❌ Error obteniendo sesión:", userError);
        return;
      }

      // 2️⃣ Obtener perfil
      const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("id, email, nombres")
        .eq("email", user.email)
        .maybeSingle();

      if (perfilError || !perfil) {
        console.error("❌ Error obteniendo perfil:", perfilError);
        return;
      }

      // 3️⃣ Consultas paralelas 🚀
      const [solicitudRes, citasRes] = await Promise.all([
        supabase
          .from("solicitudes_adopcion")
          .select(
            `
    id,
    estado,
    mascota_id,
    mascota:mascotas (
      nombre,
      imagen_url,
      edad,
      tamano,
      personalidad,
      sexo,
      peso_kg,
      altura_cm,
      descripcion_fisica,
      raza_id,
      raza:raza_id (nombre)
    )
  `
          )
          .eq("usuario_id", perfil.id)
          .in("estado", ["pendiente", "en_proceso"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("citas_adopcion")
          .select(
            `
                    id,
                    solicitud_id,
                    usuario_id,
                    mascota_id,
                    fecha_cita,
                    hora_cita,
                    estado,
                    asistencia,
                    interaccion,
                    mascota:mascotas (nombre, imagen_url)
                `
          )
          .eq("usuario_id", perfil.id)
          .order("creada_en", { ascending: false }),
      ]);

      // 4️⃣ Solicitud activa
      const { data: solicitud, error: solError } = solicitudRes;
      if (solError && !solError.message?.includes("Multiple")) {
        console.error("❌ Error buscando solicitud activa:", solError);
      }
      setSolicitudActiva(solicitud || null);

      // 🔍 Verificar si ya existe una adopción enviada por el usuario
      if (solicitud?.id) {
        const { data: adopcionExistente } = await supabase
          .from("adopciones")
          .select("id, estado")
          .eq("solicitud_id", solicitud.id)
          .maybeSingle();

        if (adopcionExistente) {
          setYaTieneAdopcion(true);
          setAdopcionEstado(adopcionExistente.estado); // ⭐ NUEVO
        } else {
          setYaTieneAdopcion(false);
          setAdopcionEstado(null);
        }
      }

      // 5️⃣ Filtrar citas
      const { data: citas, error: citaError } = citasRes;
      if (citaError) {
        console.error("❌ Error buscando citas:", citaError);
        setCitaActiva(null);
        return;
      }

      // ✅ Solo consideramos citas NO completadas
      // ✅ Primero, buscar la cita más reciente que esté completada con asistencia positiva
      const citaCompletada = (citas || []).find(
        (c) =>
          c.estado === "completada" &&
          c.asistencia === "asistio" &&
          c.interaccion === "buena_aprobada"
      );

      // 🟢 Si hay una cita completada y válida → se mostrará el botón de “formulario”
      if (citaCompletada) {
        setCitaActiva(citaCompletada);
        log("📋 Cita completada válida encontrada:", citaCompletada);
        return; // ✅ No seguimos buscando otras citas activas
      }

      // 🟠 Si no hay completada válida, buscamos una cita activa normal
      const citaValida = (citas || []).find(
        (c) =>
          c.estado &&
          ["pendiente", "programada", "confirmada"].includes(c.estado)
      );

      if (citaValida) {
        setCitaActiva(citaValida);
        log("📅 Cita activa encontrada:", citaValida);
      } else {
        setCitaActiva(null);
        log("ℹ️ Sin citas activas (solo completadas o canceladas)");
      }
    }

    cargarDatos();
  }, []);

  async function handleConfirmCancelar() {
    const supabase = createClient();
    const mascotaId = solicitudActiva?.mascota_id;

    await supabase
      .from("solicitudes_adopcion")
      .update({ estado: "rechazada" })
      .eq("id", solicitudActiva?.id);

    if (mascotaId) {
      await supabase
        .from("mascotas")
        .update({
          estado: "disponible",
          disponible_adopcion: true,
        })
        .eq("id", mascotaId);
    }

    showSoftToast("Solicitud cancelada correctamente 🐾");
    window.location.reload();
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

  // --------------------------------------------------------
  // 🔍 Obtener estado actual de documentos del usuario (solo si aplica)
  // --------------------------------------------------------
  useEffect(() => {
    if (estado === "aprobado") return;

    const supabase = createClient();

    async function fetchEstado() {
      setLoadingDocs(true); // 👈 empieza el loading
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) return;

        const { data: docs, error } = await supabase
          .from("documentos")
          .select("id, tipo, status, observacion_admin, url")
          .eq("perfil_id", user.id);

        if (error) throw error;

        if (!docs?.length) {
          setEstado("sin_documentos");
        } else {
          const estados = docs.map((d) => d.status);
          if (estados.every((s) => s === "aprobado")) setEstado("aprobado");
          else if (estados.some((s) => s === "rechazado"))
            setEstado("rechazado");
          else setEstado("en_revision");

          setDocs(
            docs.map((d) => ({
              id: d.id,
              tipo: d.tipo,
              estado: d.status,
              motivo_rechazo: d.observacion_admin,
              url: d.url,
            }))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDocs(false); // 👈 termina el loading
      }
    }

    fetchEstado();
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function verificarAdopcion() {
      // Solo ejecuta si hay cita activa y tiene solicitud asociada
      if (!citaActiva?.solicitud_id) return;

      const { data: adopcionExistente, error } = await supabase
        .from("adopciones")
        .select("id, estado")
        .eq("solicitud_id", citaActiva.solicitud_id)
        .maybeSingle();

      if (!error && adopcionExistente) {
        console.log("✅ Ya existe una adopción registrada:", adopcionExistente);
        setYaTieneAdopcion(true);
      } else {
        setYaTieneAdopcion(false);
      }
    }

    verificarAdopcion();
  }, [citaActiva]);

  // --------------------------------------------------------
  // 📂 Estado de archivos cargados
  // --------------------------------------------------------
  const [archivos, setArchivos] = useState<Record<string, File | null>>({
    identificacion: null,
    comprobante: null,
    curp: null,
  });

  const completos = useMemo(
    () => Object.values(archivos).every((f) => !!f),
    [archivos]
  );

  // --------------------------------------------------------
  // ⬆️ Subir documento individual
  // --------------------------------------------------------
  const uploadDocumento = useCallback(async (file: File, tipo: string) => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("No hay sesión activa");

    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${user.id}/${tipo}-${Date.now()}-${safe}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documentos_adopcion")
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = await supabase.storage
      .from("documentos_adopcion")
      .getPublicUrl(path);

    const publicUrl =
      publicUrlData?.publicUrl ||
      `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/documentos_adopcion/${path}`;

    const { error: dbError } = await supabase.from("documentos").upsert(
      {
        perfil_id: user.id,
        tipo,
        url: publicUrl,
        status: "pendiente",
        created_at: new Date().toISOString(),
      },
      { onConflict: "perfil_id,tipo" }
    );

    if (dbError) throw dbError;
  }, []); // 👈 no depende de nada fuera

  // --------------------------------------------------------
  // 📨 Enviar documentos
  // --------------------------------------------------------
  const enviar = useCallback(async () => {
    try {
      const tipos = Object.keys(archivos) as Array<keyof typeof archivos>;
      await Promise.all(
        tipos
          .filter((tipo) => archivos[tipo])
          .map((tipo) => uploadDocumento(archivos[tipo]!, tipo))
      );

      setEstado("en_revision");
      console.log("✅ Documentos reenviados correctamente.");
    } catch (err) {
      console.error("Error subiendo documentos:", err);
    }
  }, [archivos, uploadDocumento]);

  {
    /* ====== Placeholder mientras carga estado de documentos ====== */
  }
  {
    estado === "cargando" && (
      <div className="animate-pulse mt-4 rounded-xl border border-[#eadacb] bg-[#fff9f3] p-5 shadow-sm">
        <div className="h-4 w-32 bg-[#eadacb]/50 rounded mb-3"></div>
        <div className="h-3 w-full bg-[#eadacb]/40 rounded mb-2"></div>
        <div className="h-3 w-5/6 bg-[#eadacb]/40 rounded"></div>
      </div>
    );
  }

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

        {estado === "rechazado" && (
          <PanelEstado
            tone="danger"
            icon={<XCircle className="h-6 w-6" />}
            title="Documentos rechazados"
            desc="Por favor corrige lo indicado y vuelve a enviarlos."
          />
        )}
        {/* -------- Bloques por estado -------- */}
        {(estado === "sin_documentos" || estado === "rechazado") && (
          <SeccionCarga
            archivos={archivos}
            docs={docs}
            onPick={(id, file) =>
              setArchivos({ ...archivos, [id]: file ?? null })
            }
            onEnviar={enviar}
            deshabilitarEnviar={
              estado === "sin_documentos"
                ? !completos
                : docs
                    .filter((d) => d.estado === "rechazado")
                    .some((d) => !archivos[d.tipo])
            }
          />
        )}

        {estado === "en_revision" && (
          <section className="rounded-2xl border border-[#eadacb] bg-[#fff9f3] p-10 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#BC5F36]/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-[#BC5F36]/10"
                >
                  <Clock className="h-10 w-10 text-[#BC5F36]" />
                </motion.div>{" "}
              </div>
              <h2 className="text-xl font-extrabold text-[#2b1b12]">
                Tus documentos están en revisión
              </h2>
              <p className="max-w-md text-sm text-[#7a5c49] leading-relaxed">
                Un administrador revisará que todo esté correcto. <br />
                Te avisaremos por correo o al iniciar sesión cuando hayan sido
                aprobados.
              </p>
              <div className="mt-6">
                <div className="animate-pulse text-[#BC5F36] font-medium"></div>
              </div>
            </div>
          </section>
        )}

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
              ) : citaActiva.estado === "programada" ||
                citaActiva.estado === "pendiente" ||
                citaActiva.estado === "confirmada" ? (
                /* 🟠 Caso: Cita programada — NO mostrar formulario */
                <div
                  className="
      mt-6 mb-4
      rounded-2xl border border-[#c7ddff]
      bg-gradient-to-br from-[#eef4ff] via-[#e3f0ff] to-[#d6e7ff]
      p-6 shadow-md
    "
                >
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    {/* Columna izquierda: mensaje principal */}
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#1d4ed8] border border-[#c7ddff]">
                        <CalendarCheck className="h-3 w-3" />
                        Cita en proceso de evaluación
                      </div>

                      <h3 className="mt-3 text-base md:text-lg font-extrabold text-[#1e3a8a] flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1d4ed8]/10">
                          <CalendarCheck className="h-4 w-4 text-[#1d4ed8]" />
                        </span>
                        ¡Ya tienes una cita programada!
                      </h3>

                      <p className="mt-2 text-sm text-[#1e40af] leading-relaxed">
                        Estamos esperando la evaluación de tu visita. Por favor
                        espera a que el CAAM valore tu cita antes de continuar
                        con el siguiente paso del proceso.
                      </p>

                      {/* Datos de la cita */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-white/70 border border-[#d4e3ff] px-4 py-3 text-xs text-[#1e3a8a]">
                          <p className="font-semibold text-[11px] uppercase tracking-wide text-[#2563eb]/90">
                            Mascota
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {citaActiva.mascota?.nombre || "Sin nombre"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/70 border border-[#d4e3ff] px-4 py-3 text-xs text-[#1e3a8a]">
                          <p className="font-semibold text-[11px] uppercase tracking-wide text-[#2563eb]/90">
                            Fecha
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {formateaFechaBonita(citaActiva.fecha_cita)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/70 border border-[#d4e3ff] px-4 py-3 text-xs text-[#1e3a8a]">
                          <p className="font-semibold text-[11px] uppercase tracking-wide text-[#2563eb]/90">
                            Hora
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {citaActiva.hora_cita}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Columna derecha: mini timeline / siguiente paso */}
                    <div className="w-full md:w-56 rounded-2xl bg-white/80 border border-[#d4e3ff] px-4 py-4 text-xs text-[#1e3a8a] shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2563eb] mb-2 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        ¿Qué sigue?
                      </p>

                      <ol className="space-y-2">
                        <li className="flex gap-2">
                          <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                          <p>
                            Acude a tu cita en el{" "}
                            <span className="font-semibold">CAAM</span> en la
                            fecha y hora indicadas.
                          </p>
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                          <p>
                            El equipo del CAAM registrará la interacción con la
                            mascota y evaluará la visita.
                          </p>
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                          <p>
                            Si la visita es aprobada, el paso{" "}
                            <span className="font-semibold">“Formulario”</span>{" "}
                            del proceso se desbloqueará automáticamente.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Pie: nota + botón ver cita */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <p className="text-[11px] text-[#1e3a8a] italic flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Mientras tanto, puedes revisar tus documentos o tu perfil,
                      pero no podrás avanzar al siguiente paso hasta que se
                      registre la evaluación de la cita.
                    </p>

                    <Button
                      onClick={() => router.push("/dashboards/usuario/citas")}
                      className="
          self-stretch sm:self-auto
          bg-white/90 text-[#1d4ed8]
          border border-[#bfdbfe]
          hover:bg-[#eff6ff] hover:border-[#2563eb]
          text-xs sm:text-sm font-semibold
          px-4 py-2 rounded-xl shadow-sm
          cursor-pointer transition-all duration-200
        "
                    >
                      Ver detalles de mi cita
                    </Button>
                  </div>
                </div>
              ) : citaActiva.estado === "completada" &&
                citaActiva.asistencia === "asistio" &&
                citaActiva.interaccion === "buena_aprobada" ? (
                /* 🟢 Cita aprobada — Mostrar formulario (solo si NO existe adopción previa) */
                <div
                  className="
  mt-6 mb-6
  rounded-2xl 
  border border-blue-200 
  bg-gradient-to-br from-blue-50 via-white to-blue-100
  p-6 sm:p-8 
  shadow-[0_4px_15px_rgba(0,0,0,0.07)]
  animate-fade-in
"
                >
                  {/* Encabezado */}
                  <div className="flex items-center gap-3">
                    <div
                      className="
      h-12 w-12 
      rounded-full 
      bg-blue-600 
      text-white 
      flex items-center justify-center 
      shadow-md
    "
                    >
                      <CheckCircle2 className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-blue-900">
                        ¡Tu cita fue aprobada! 🎉
                      </h3>
                      <p className="text-sm sm:text-base text-blue-700 mt-1">
                        El CAAM confirmó que la interacción con tu mascota fue
                        positiva.
                      </p>
                    </div>
                  </div>

                  {/* Mascota + Texto */}
                  <div className="mt-6 grid sm:grid-cols-[140px_1fr] gap-6 items-center">
                    {/* Foto mascota */}
                    <div
                      className="
      w-full 
      rounded-2xl 
      overflow-hidden 
      border border-blue-200 
      shadow-sm bg-white
    "
                    >
                      <img
                        src={
                          citaActiva.mascota?.imagen_url || "/placeholder.jpg"
                        }
                        alt={citaActiva.mascota?.nombre}
                        className="w-full h-36 object-cover"
                      />
                    </div>

                    {/* Texto */}
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base text-blue-900 leading-relaxed">
                        ¡Felicidades! La convivencia fue{" "}
                        <strong className="text-blue-700">aprobada</strong>, lo
                        que significa que avanzaste al último paso del proceso
                        de adopción.
                      </p>

                      <div className="text-sm text-blue-800">
                        <p>
                          <strong>Mascota:</strong> {citaActiva.mascota?.nombre}
                        </p>
                      </div>

                      <p className="text-sm text-blue-700 italic mt-2">
                        “Un último paso para darle un hogar lleno de amor.”
                      </p>
                    </div>
                  </div>

                  {/* Botón */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => router.push(`/dashboards/usuario/citas`)}
                      className="
    bg-blue-600 
    text-white 
    px-6 py-3 
    rounded-xl 
    shadow-md 
    transition-all 
    flex items-center gap-2
    cursor-pointer
    hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300
    active:scale-95
  "
                    >
                      <FileText className="h-5 w-5" />
                      Llenar formulario de adopción
                    </Button>
                  </div>
                </div>
              ) : null
            ) : solicitudActiva ? (
              /* 🟠 CASO 2: Tiene solicitud activa pero sin cita */
              <div className="rounded-xl border border-[#ffedd5] bg-[#fffaf4] p-5 mb-4 mt-5">
                <h3 className="text-sm font-extrabold text-[#BC5F36] flex items-center gap-2">
                  <PawPrint className="h-4 w-4" /> Solicitud pendiente
                </h3>
                <p className="mt-2 text-sm text-[#7a5c49]">
                  Ya tienes una solicitud activa. Ahora puedes continuar con el
                  proceso y agendar tu cita para conocer a{" "}
                  <strong>tu mascota seleccionada</strong>.
                </p>

                {/* Bloque: ¿Qué sigue después? */}

                {solicitudActiva?.mascota_id && (
                  <div
                    className="
      mt-10 
      grid grid-cols-1 
      lg:grid-cols-[500px_1fr] 
      gap-6 
      lg:gap-10
      items-start
    "
                  >
                    <div className="hidden lg:block lg:col-span-2 mb-0">
                      <button
                        onClick={() => router.push("/dashboards/usuario/citas")}
                        className="
          w-full 
          bg-[#BC5F36] text-white 
          py-3.5 
          rounded-xl 
          text-base font-semibold 
          shadow-md shadow-[#bc5f36]/30
          hover:bg-[#a64f2b]
          hover:shadow-lg hover:shadow-[#bc5f36]/40
          hover:-translate-y-[2px]
          active:scale-95
          transition-all duration-200
        "
                      >
                        <span className="text-lg mr-2">📅</span>
                        Agendar visita
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div
                        className="
          rounded-xl 
          bg-white/80 
          backdrop-blur-md 
          border border-[#eadacb] 
          p-5 
          shadow-lg shadow-[#c7b39b]/30
          w-full
        "
                      >
                        <MascotaSeleccionadaCard
                          mascota={solicitudActiva.mascota}
                          onCancelar={() => setShowCancelSolicitudModal(true)}
                        />
                      </div>

                      {/* ======== BOTÓN MÓVIL ======== */}
                      <div className="lg:hidden mt-4">
                        <button
                          onClick={() => setMostrarAgendar(!mostrarAgendar)}
                          className="
            w-full 
            bg-[#BC5F36] text-white 
            py-3 rounded-xl 
            shadow-md 
            font-semibold 
            text-sm
            hover:bg-[#a64f2b]
            hover:-translate-y-[2px]
            active:scale-95
            transition-all duration-200
          "
                        >
                          {mostrarAgendar
                            ? "Ocultar detalles"
                            : "Ver información de la visita"}
                        </button>
                      </div>
                    </div>

                    <div className="relative space-y-6">
                      {/* Línea separadora (solo PC) */}
                      <div className="hidden lg:block absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-[#e5d8c9] to-transparent" />

                      <div className="pl-0 lg:pl-8 space-y-6">
                        {(mostrarAgendar ||
                          typeof window === "undefined" ||
                          window.innerWidth >= 1024) && (
                          <div className="space-y-6">
                            <div className="rounded-xl bg-white/80 backdrop-blur-md border border-[#eadacb] p-5 shadow-lg shadow-[#c7b39b]/30">
                              <h3 className="text-sm font-extrabold text-[#2b1b12] mb-2 flex items-center gap-2">
                                <span className="text-[#BC5F36] text-lg">
                                  📅
                                </span>
                                ¿Qué sigue ahora?
                              </h3>

                              <ul className="text-xs text-[#7a5c49] space-y-2 leading-relaxed">
                                <li>
                                  • Agenda tu visita para convivir con tu
                                  mascota.
                                </li>
                                <li>• El CAAM evaluará cómo interactúan.</li>
                                <li>
                                  • Si es aprobada, llenarás el formulario
                                  final.
                                </li>
                                <li>
                                  • Luego un administrador revisará tu
                                  información.
                                </li>
                              </ul>
                            </div>

                            {/* 2. Estado del proceso */}
                            <div className="rounded-xl bg-white/80 backdrop-blur-md border border-[#eadacb] p-5 shadow-lg shadow-[#c7b39b]/30">
                              <h4 className="text-sm font-extrabold text-[#2b1b12] mb-3 flex items-center gap-2">
                                <span className="text-[#3B82F6] text-lg">
                                  📘
                                </span>
                                Estado de tu proceso
                              </h4>

                              <div className="grid gap-2 text-xs text-[#7a5c49]">
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600">✓</span>{" "}
                                  Mascota seleccionada
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[#BC5F36]">→</span>{" "}
                                  Pendiente agendar visita
                                </div>
                                <div className="flex items-center gap-2 opacity-70">
                                  <span>⏳</span> Formulario (después de la
                                  visita)
                                </div>
                                <div className="flex items-center gap-2 opacity-70">
                                  <span>⏳</span> Aprobación final
                                </div>
                              </div>
                            </div>

                            {/* 3. Consejos */}
                            <div
                              className="
                relative overflow-visible rounded-2xl border border-[#ebd8c7] p-6 
                shadow-xl 
                bg-gradient-to-br from-[#fff4e6] via-[#ffe8cf] to-[#ffd8b0] 
                transition-all 
              "
                            >
                              <h4 className="relative text-sm font-extrabold text-[#2b1b12] mb-4 flex items-center gap-2">
                                <span className="text-[#F59E0B] text-xl">
                                  💡
                                </span>
                                Consejos para tu visita
                              </h4>

                              <ul className="relative text-xs text-[#7a5c49] space-y-3 leading-relaxed">
                                <li className="flex gap-2">
                                  <span className="text-[#F59E0B]">•</span>
                                  Llega 10–15 minutos antes para evitar
                                  retrasos.
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#F59E0B]">•</span>
                                  Puedes traer fotos del hogar donde vivirá.
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#F59E0B]">•</span>
                                  Si tienes mascotas, procura mantener sus
                                  vacunas al día.
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#F59E0B]">•</span>
                                  Sé tú mismo, la convivencia natural es lo más
                                  importante.
                                </li>
                              </ul>
                            </div>

                            {/* BOTÓN MÓVIL */}
                            {estado === "aprobado" && !citaActiva && (
                              <button
                                onClick={() =>
                                  router.push("/dashboards/usuario/citas")
                                }
                                className="
                  lg:hidden 
                  w-full 
                  bg-[#BC5F36] text-white 
                  py-3 rounded-xl 
                  text-sm font-semibold
                  shadow-md shadow-[#bc5f36]/40 
                  hover:bg-[#a64f2b]
                  hover:-translate-y-[2px]
                  active:scale-95
                  transition-all duration-200
                  mt-1
                "
                              >
                                📅 Agendar visita
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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

function Stepper({ estado }: { estado: Estado }) {
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
          className={`rounded-xl border p-4 shadow-sm ${
            i === current
              ? "border-[#BC5F36] bg-[#fff4e7]"
              : "border-[#eadacb] bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                i < current
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
