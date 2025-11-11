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
  const [estado, setEstado] = useState<Estado>("sin_documentos");
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
                    mascota:mascotas (nombre, imagen_url)
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
        const { data: adopcionExistente, error: adopError } = await supabase
          .from("adopciones")
          .select("id")
          .eq("solicitud_id", solicitud.id)
          .maybeSingle();

        if (!adopError && adopcionExistente) {
          setYaTieneAdopcion(true);
          console.log("✅ Ya existe un formulario de adopción enviado.");
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

  if (loadingDocs) {
    return (
      <div className="rounded-2xl border border-[#eadacb] bg-white p-8 text-center text-[#7a5c49] shadow-sm">
        <p className="animate-pulse text-sm font-medium">
          Cargando tus documentos...
        </p>
      </div>
    );
  }

  // --------------------------------------------------------
  // 💡 Render principal
  // --------------------------------------------------------
  return (
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
          {/* 🟢 Panel principal */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="text-sm font-extrabold text-green-800">
                ¡Tus documentos fueron aprobados!
              </h3>
            </div>
            <p className="mt-1 text-sm text-green-700">
              Todo está en orden. Ya puedes continuar con el proceso de
              adopción.
            </p>
          </div>

          {/* 🔹 Stepper dinámico */}
          <StepperAdopcion
            activeStep={citaActiva ? 3 : solicitudActiva ? 2 : 1}
          />

          {/* 🔸 Bloque según estado */}
          {citaActiva && !yaTieneAdopcion ? (
            /* ✅ CASO 3: Ya tiene cita activa */
            <div className="rounded-xl bg-white p-5 mb-4 mt-5">
              <h3 className="text-sm font-extrabold text-green-700 flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" /> ¡Tienes una cita programada!
              </h3>
              <div className="mt-2 text-sm text-[#497a49]">
                <p>
                  <strong>Mascota:</strong>{" "}
                  {citaActiva.mascota?.nombre || "Sin nombre"}
                </p>
                <p>
                  <strong>Fecha:</strong> {citaActiva.fecha_cita} —{" "}
                  <strong>Hora:</strong> {citaActiva.hora_cita}
                </p>
                <p className="mt-2">
                  Te esperamos en el CAAM 🐾 Recuerda llegar 10 minutos antes.
                </p>
              </div>

              {/* 🔽 Botón solo si aún no envió el formulario */}
              {!yaTieneAdopcion && (
                <div className="mt-4 text-right">
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboards/usuario/form-adopcion/${citaActiva.solicitud_id}`
                      )
                    }
                    className="bg-[#16A34A] hover:bg-[#15803D]"
                  >
                    <FileText className="h-4 w-4 mr-1" /> Llenar formulario de adopción
                  </Button>
                </div>
              )}
            </div>
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

              {solicitudActiva?.mascota_id && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#eadacb] bg-white/60 p-3">
                  <img
                    src={
                      solicitudActiva.mascota?.imagen_url ||
                      "/img/placeholder-mascota.jpg"
                    }
                    alt={
                      solicitudActiva.mascota?.nombre || "Mascota seleccionada"
                    }
                    className="h-14 w-14 rounded-full object-cover border border-[#eadacb]"
                  />
                  <div>
                    <p className="font-semibold text-[#2b1b12] text-sm">
                      {solicitudActiva.mascota?.nombre || "Mascota sin nombre"}
                    </p>
                    <p className="text-xs text-[#7a5c49]">
                      Esta es la mascota que seleccionaste para adoptar 💕
                    </p>
                    <button
                      onClick={async () => {
                        if (
                          confirm(
                            "¿Estás seguro de que deseas cancelar tu solicitud de adopción? Esta acción no se puede deshacer."
                          )
                        ) {
                          try {
                            const supabase = createClient();

                            // 1️⃣ Eliminar la solicitud
                            const { error: deleteError } = await supabase
                              .from("solicitudes_adopcion")
                              .delete()
                              .eq("id", solicitudActiva.id);

                            if (deleteError) {
                              console.error(
                                "❌ Error al eliminar solicitud:",
                                deleteError
                              );
                              alert("Hubo un error al cancelar la solicitud.");
                              return;
                            }

                            // 2️⃣ Volver a poner la mascota como disponible
                            if (solicitudActiva.mascota_id) {
                              const { error: updateError } = await supabase
                                .from("mascotas")
                                .update({
                                  estado: "disponible",
                                  disponible_adopcion: true,
                                })
                                .eq("id", solicitudActiva.mascota_id);

                              if (updateError) {
                                console.error(
                                  "⚠️ Error al actualizar mascota:",
                                  updateError
                                );
                              } else {
                                console.log(
                                  "✅ Mascota actualizada a disponible"
                                );
                              }
                            }

                            alert("Solicitud cancelada correctamente.");
                            window.location.reload();
                          } catch (e) {
                            console.error(e);
                          }
                        }
                      }}
                      className="text-xs text-red-700 hover:text-red-800 underline mt-1"
                    >
                      Cancelar solicitud
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 text-right">
                <Button
                  className="bg-[#BC5F36] hover:bg-[#a64d2e]"
                  onClick={() => router.push("/dashboards/usuario/citas")}
                >
                  <CalendarCheck className="h-4 w-4 mr-1" /> Agendar visita
                </Button>
              </div>
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

                <Button
                  className="mt-3 w-full text-[#BC5F36]"
                  variant={solicitudActiva?.mascota_id ? "default" : "ghost"}
                  disabled={!solicitudActiva?.mascota_id}
                  onClick={() => router.push("/dashboards/usuario/citas")}
                >
                  <CalendarCheck className="h-4 w-4 mr-1" /> Agendar visita
                </Button>

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
            <li>• Si hay observaciones, podrás corregir y volver a enviar.</li>
          </ul>
        </section>
      )}
    </div>
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
