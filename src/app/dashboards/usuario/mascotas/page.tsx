"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactDOM from "react-dom";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotaCardUsuario from "@/features/mascotas/components/client/MascotaCardUsuario";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ESPECIES } from "@/features/mascotas/data/constants";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import MascotasFeed from "@/features/mascotas/components/client/MascotasFeed";
import { useIniciarAdopcionMascota } from "@/features/usuarios/hooks/useIniciarAdopcionMascota";
import { useCrearSolicitudAdopcion } from "@/features/solicitudes/hooks/useCrearSolicitudAdopcion";

export default function MascotasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const especieQS = searchParams.get("especie");
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

  // Estados de modales
  const [gateOpen, setGateOpen] = useState(false);
  const [selected, setSelected] = useState<Mascota | null>(null);

  // Modal de información
  const [openCard, setOpenCard] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [adopcionEnProgreso, setAdopcionEnProgreso] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const {
    iniciarAdopcion,
    isLoading: isIniciandoAdopcion,
    data: adopcionResult,
    error: adopcionError,
  } = useIniciarAdopcionMascota();

  const {
    crearSolicitud,
    isLoading: isCreandoSolicitud,
    error: crearSolicitudError,
  } = useCrearSolicitudAdopcion();

  // Bloquear scroll del body cuando el visor está abierto
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

  // Estado de documentos del usuario
  useEffect(() => {
    if (!adopcionResult) return;

    if (adopcionResult.ok) {
      setAdopcionEnProgreso(true);
      setMensajeExito(`Procesando solicitud para ${adopcionResult.mascotaNombre}...`);

      crearSolicitud(adopcionResult.mascotaId);

      router.push(
        `/dashboards/usuario/adopcion?paso=2&from=${adopcionResult.mascotaId}`
      );
      return;
    }

    // Casos controlados desde el backend
    switch (adopcionResult.reason) {
      case "DOCS_INCOMPLETOS": setSelected(adopcionResult.mascota);
        setGateOpen(true);
        break;

      case "SOLICITUD_ACTIVA":
        mostrarToast("Ya tienes una adopción en curso.");
        router.push("/dashboards/usuario/adopcion");
        break;

      case "CITA_ACTIVA":
        mostrarToast("Ya tienes una cita de adopción programada.");
        break;

      default:
        mostrarToast("No se pudo iniciar la adopción.");
    }
  }, [adopcionResult]);

  useEffect(() => {
    if (!adopcionError) return;

    mostrarToast(
      "Ocurrió un error inesperado. Intenta nuevamente.",
      "#fff5f5",
      "#7f1d1d",
      "#fecaca"
    );
  }, [adopcionError]);



  // Adopción
  function handleAdopt(m: Mascota) {
    iniciarAdopcion(m);
  }


  // ----------------------------------------------------
  // Helper para mostrar mensajes visuales tipo Toast
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

  // Render principal
  return (
    <>
      <PageHead
        title="Mascotas"
        subtitle="Encuentra a tu nuevo mejor amigo 🐾"
      />
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

      <MascotasFeed
        search={q}
        especie={especie}
        sexo={sexo}
        onView={(m) => {
          setSelectedMascota(m);
          setOpenCard(true);
        }}
        onAdopt={handleAdopt}
      />

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


      {/* Modal info mascota a pantalla completa (portal) */}
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
