"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactDOM from "react-dom";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotaCard from "@/features/mascotas/components/client/MascotaCard";
import MascotaCardUsuario from "@/features/mascotas/components/client/MascotaCardUsuario";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ESPECIES } from "@/features/mascotas/data/constants";
import type { Mascota } from "@/features/mascotas/data/types";

import { useMascotasPublicasInfiniteQuery } from "@/features/mascotas/hooks/useMascotasPublicasInfiniteQuery";


type DocEstado = "aprobado" | "en_revision" | "rechazado" | "sin_documentos";

export default function MascotasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const especieQS = searchParams.get("especie");
  const supabase = createClient();
  const [showCancelSolicitudModal, setShowCancelSolicitudModal] =
    useState(false);
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState<string>(() => {
    const val = (especieQS || "").trim();
    if (
      val &&
      (val === "Todas" || (ESPECIES as readonly string[]).includes(val))
    )
      return val;
    return "Todas";
  });
  const [sexo, setSexo] = useState<string>("Todos");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMascotasPublicasInfiniteQuery({
    search: q,
    especie,
    sexo,
  });

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });


  // Estado de documentos del usuario
  const [docEstado, setDocEstado] = useState<DocEstado>("sin_documentos");

  // Estados de modales
  const [gateOpen, setGateOpen] = useState(false);
  const [selected, setSelected] = useState<Mascota | null>(null);

  // Modal de información
  const [openCard, setOpenCard] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [adopcionEnProgreso, setAdopcionEnProgreso] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // 🔒 Bloquear scroll del body cuando el visor está abierto
  useEffect(() => {
    if (typeof window === "undefined") return;
    const body = document.body;
    const html = document.documentElement;

    if (openCard) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
    } else {
      const prevY = Number(body.dataset.scrollY || 0);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      delete body.dataset.scrollY;
      html.style.overscrollBehavior = "";
      if (!isNaN(prevY)) window.scrollTo(0, prevY);
    }
  }, [openCard]);

  // 📑 Estado de documentos del usuario
  useEffect(() => {
    async function fetchEstado() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: docs, error } = await supabase
        .from("documentos")
        .select("status")
        .eq("perfil_id", user.id);

      if (error) {
        console.error("Error al obtener estado de documentos:", error);
        return;
      }

      if (!docs || docs.length === 0) {
        setDocEstado("sin_documentos");
        return;
      }

      const estados = docs.map((d) => d.status);
      if (estados.every((s) => s === "aprobado")) setDocEstado("aprobado");
      else if (estados.some((s) => s === "rechazado"))
        setDocEstado("rechazado");
      else setDocEstado("en_revision");
    }

    fetchEstado();
  }, []);

  // --------------------------------------------------------
  // 🐶 Obtener mascotas disponibles
  // --------------------------------------------------------


  // Adopción
  async function handleAdopt(m: Mascota) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        mostrarToast("Debes iniciar sesión para adoptar una mascota.");
        return;
      }

      // 📄 Validar documentos una sola vez
      if (docEstado !== "aprobado") {
        setSelected(m);
        setGateOpen(true);
        return;
      }

      // 🚫 VALIDAR SI YA TIENE UNA SOLICITUD ACTIVA
      const { data: solicitudesActivas, error: solicitudesError } =
        await supabase
          .from("solicitudes_adopcion")
          .select("id, estado")
          .eq("usuario_id", user.id)
          .in("estado", ["pendiente", "en_proceso"])
          .limit(1);

      if (solicitudesError) {
        console.error(
          "Error consultando solicitudes activas:",
          solicitudesError
        );
        mostrarToast(
          "No se pudo verificar tu solicitud actual. Inténtalo de nuevo en unos minutos."
        );
        return;
      }

      if (solicitudesActivas && solicitudesActivas.length > 0) {
        mostrarToast(
          "Ya tienes una adopción en curso. Termina la adopción actual antes de iniciar otra."
        );
        router.push("/dashboards/usuario/adopcion");
        return;
      }

      // 🚫 VALIDAR SI YA TIENE UNA CITA ACTIVA
      const { data: citasActivas, error: citasError } = await supabase
        .from("citas_adopcion")
        .select("id, estado")
        .eq("usuario_id", user.id)
        .in("estado", ["programada"])
        .limit(1);

      if (citasError) {
        console.error("Error consultando citas activas:", citasError);
        mostrarToast(
          "No se pudo verificar tus citas de adopción. Inténtalo de nuevo en unos minutos."
        );
        return;
      }

      if (citasActivas && citasActivas.length > 0) {
        mostrarToast(
          "Ya tienes una cita de adopción programada. Concluye ese proceso antes de iniciar una nueva adopción."
        );
        // Si quieres, también puedes redirigir:
        // router.push("/dashboards/usuario/adopcion?paso=2");
        return;
      }

      // 🧭 Feedback instantáneo
      setAdopcionEnProgreso(true);
      setMensajeExito(`Procesando solicitud para ${m.nombre}...`);

      // 🔁 Redirigir rápido al paso siguiente (sin esperar Supabase)
      setTimeout(() => {
        router.push(
          `/dashboards/usuario/adopcion?paso=2&from=${m.id
          }&nombre=${encodeURIComponent(m.nombre)}`
        );
      }, 1200);

      // 🧱 Crear solicitud y actualizar mascota en paralelo (sin bloquear UI)
      const numero = "SOL-" + Math.floor(100000 + Math.random() * 900000);

      const [insertSolicitud, updateMascota] = await Promise.all([
        supabase.from("solicitudes_adopcion").insert([
          {
            numero_solicitud: numero,
            usuario_id: user.id,
            mascota_id: m.id,
            motivo_adopcion: "Pendiente de llenar",
            estado: "pendiente",
          },
        ]),
        supabase
          .from("mascotas")
          .update({
            estado: "en_proceso",
            disponible_adopcion: false,
          })
          .eq("id", m.id),
      ]);

      if (insertSolicitud.error)
        console.warn("⚠️ Error creando solicitud:", insertSolicitud.error);
      if (updateMascota.error)
        console.warn("⚠️ Error actualizando mascota:", updateMascota.error);
    } catch (err) {
      console.error("Error al procesar adopción:", err);
      mostrarToast(
        "❌ Ocurrió un problema al procesar tu solicitud. Intenta nuevamente."
      );
    }
  }

  // ----------------------------------------------------
  // 🌈 Helper para mostrar mensajes visuales tipo Toast
  // ----------------------------------------------------
  function mostrarToast(
    mensaje: string,
    bgColor = "#fff",
    textColor = "#333",
    borderColor = "#ccc"
  ) {
    const toast = document.createElement("div");
    toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: ${textColor};
      border: 1px solid ${borderColor};
      border-radius: 10px;
      padding: 16px 22px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 14px;
      max-width: 320px;
      z-index: 9999;
    ">
      ${mensaje}
    </div>
  `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // --------------------------------------------------------
  // 🎨 Texto del estado de documentos
  // --------------------------------------------------------
  const estadoText: Record<
    DocEstado,
    { title: string; desc: string; tone: "info" | "warn" | "ok" | "error" }
  > = {
    sin_documentos: {
      title:
        "Necesitas validar tus documentos para poder solicitar una adopción",
      desc: "Sube identificación, domicilio y carta compromiso.",
      tone: "warn",
    },
    en_revision: {
      title: "Documentos en revisión",
      desc: "Un administrador está revisando tus archivos.",
      tone: "info",
    },
    rechazado: {
      title: "Documentos con observaciones",
      desc: "Corrige lo indicado y vuelve a enviar.",
      tone: "error",
    },
    aprobado: {
      title: "Validación completa",
      desc: "Ya puedes iniciar el proceso de adopción.",
      tone: "ok",
    },
  };

  const toneClasses = {
    info: "border-[#eadacb] bg-[#fff4e7]",
    warn: "border-[#eadacb] bg-[#fff4e7]",
    ok: "border-[#dbead3] bg-[#f3fff3]",
    error: "border-[#f2d6d6] bg-[#fff5f5]",
  } as const;

  // --------------------------------------------------------
  // 🔍 Filtrar las mascotas visibles
  // --------------------------------------------------------
  const mascotas = data?.pages.flatMap((page) => page.items) ?? [];

  // 💅 Render principal
  return (
    <>
      <PageHead
        title="Mascotas"
        subtitle="Encuentra a tu nuevo mejor amigo 🐾"
      />
      {docEstado !== "aprobado" && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 ${toneClasses[estadoText[docEstado].tone]
            } text-sm`}
        >
          <p className="font-extrabold text-[#2b1b12]">
            {estadoText[docEstado].title}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[#7a5c49]">
            <span>{estadoText[docEstado].desc}</span>
            <Button
              className="px-3 py-2"
              onClick={() => router.push("/dashboards/usuario/adopcion")}
            >
              Completar verificación
            </Button>
          </div>
        </div>
      )}
      <div className="sticky top-[5.5rem] z-20 bg-white/80 backdrop-blur-md py-2 rounded-xl shadow-sm">
        <Filters
          q={q}
          onQ={setQ}
          especie={especie}
          onEspecie={setEspecie}
          sexo={sexo}
          onSexo={setSexo}
          ESPECIES={ESPECIES}
        />
      </div>
      {/* Filtrado de mascotas */}
      {isLoading ? (
        <div className="py-10 text-center text-[#7a5c49]">
          Cargando mascotas...
        </div>
      ) : (
        <>
          <section
            className="
        grid gap-3
        [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]
        transition-opacity duration-300
      "
          >
            {mascotas.map((m) => (
              <MascotaCard
                key={m.id}
                m={m}
                onView={() => {
                  setSelectedMascota(m);
                  setOpenCard(true);
                }}
                onAdopt={() => handleAdopt(m)}
              />
            ))}

            {mascotas.length === 0 && (
              <div className="col-span-full py-10 text-center text-[#7a5c49]">
                <div className="text-4xl mb-2 opacity-80">🔎</div>
                <p className="font-semibold mb-3">
                  No encontramos mascotas con esos filtros
                </p>
              </div>
            )}
          </section>

          <div
            ref={loadMoreRef}
            className="h-8 pointer-events-none"
          />


          {isFetchingNextPage && (
            <div className="py-8 flex justify-center opacity-40 transition-opacity duration-300">
              <div className="w-4 h-4 border-2 border-[#BC5F36] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}


      {/* Modal bloqueo adopción */}
      <Modal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Antes de adoptar"
      >
        <div className="p-4 text-[#2b1b12]">
          <p className="text-sm">
            Para adoptar a{" "}
            <span className="font-extrabold">{selected?.nombre}</span> primero
            necesitamos validar tus documentos:
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
            <li>• Identificación oficial (INE / Pasaporte)</li>
            <li>• Comprobante de domicilio (≤ 3 meses)</li>
            <li>• Carta compromiso firmada</li>
          </ul>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setGateOpen(false)}>
              Luego
            </Button>
            <Button
              onClick={() => {
                setGateOpen(false);
                router.push(
                  `/dashboards/usuario/adopcion?from=${selected?.id ?? ""}`
                );
              }}
            >
              Completar verificación
            </Button>
          </div>
        </div>
      </Modal>
      {/* Overlay de adopción en progreso */}
      {adopcionEnProgreso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm mx-auto animate-fade-in">
            <div className="animate-bounce text-4xl mb-3">🐶</div>
            <h2 className="text-lg font-extrabold text-[#2b1b12] mb-2">
              {mensajeExito}
            </h2>
            <p className="text-sm text-[#7a5c49]">
              Espera un momento mientras preparamos el siguiente paso...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-4 border-[#BC5F36] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}


      {/* 🧡 Modal info mascota a pantalla completa (portal) */}
      {openCard &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
              {/* Botón cerrar */}
              <button
                onClick={() => setOpenCard(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#BC5F36] transition"
                aria-label="Cerrar"
              >
                ✕
              </button>

              {/* Contenido con scroll interno */}
              <div className="flex-1 overflow-y-auto rounded-2xl">
                <MascotaCardUsuario
                  m={selectedMascota}
                  open={true}
                  onClose={() => setOpenCard(false)}
                  onAdopt={() => {
                    if (selectedMascota) handleAdopt(selectedMascota);
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="
    fixed 
    bottom-5 
    right-5 
    bg-[#BC5F36] 
    text-white 
    p-3 
    rounded-full 
    shadow-lg 
    hover:bg-[#a24f2d] 
    hover:shadow-xl 
    transition-all 
    duration-200 
    cursor-pointer 
    z-50
  "
        aria-label="Volver arriba"
      >
        ↑
      </button>
    </>
  );
}
