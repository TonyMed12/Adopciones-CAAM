"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotasFeed from "@/features/mascotas/components/client/MascotasFeed";
import MascotaInfoModal from "@/features/mascotas/components/client/MascotaInfoModal";

import ModalValidacionDocumentos from "@/features/usuarios/components/client/ModalValidacionDocumentos";
import AdopcionEnProgresoOverlay from "@/features/usuarios/components/client/AdopcionEnProgresoOverlay";

import { ESPECIES } from "@/features/mascotas/data/constants";
import type { Mascota } from "@/features/mascotas/types/mascotas";

import { useIniciarAdopcionMascota } from "@/features/usuarios/hooks/useIniciarAdopcionMascota";
import { useCrearSolicitudAdopcion } from "@/features/solicitudes/hooks/useCrearSolicitudAdopcion";

export default function MascotasPage() {
  const [handledResult, setHandledResult] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();

  /* ---------------- filtros ---------------- */
  const especieQS = searchParams.get("especie");
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState<string>(() => {
    const val = (especieQS || "").trim();
    if (
      val &&
      (val === "Todas" || (ESPECIES as readonly string[]).includes(val))
    ) {
      return val;
    }
    return "Todas";
  });
  const [sexo, setSexo] = useState<string>("Todos");

  /* ---------------- selección / modales ---------------- */
  const [openCard, setOpenCard] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);

  const [gateOpen, setGateOpen] = useState(false);

  /* ---------------- overlay ---------------- */
  const [adopcionEnProgreso, setAdopcionEnProgreso] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  /* ---------------- hooks ---------------- */
  const {
    iniciarAdopcion,
    data: adopcionResult,
    error: adopcionError,
  } = useIniciarAdopcionMascota();

  const { crearSolicitud } = useCrearSolicitudAdopcion();

  /* ---------------- efectos ---------------- */
  useEffect(() => {
    if (!adopcionResult || handledResult) return;

    setHandledResult(true);

    if (adopcionResult.ok) {
      setAdopcionEnProgreso(true);
      setMensajeExito(
        `Procesando solicitud para ${adopcionResult.mascotaNombre}...`
      );

      crearSolicitud(adopcionResult.mascotaId);

      router.push(
        `/dashboards/usuario/adopcion?paso=2&from=${adopcionResult.mascotaId}`
      );
      return;
    }

    switch (adopcionResult.reason) {
      case "DOCS_INCOMPLETOS":
        setSelectedMascota(adopcionResult.mascota);
        setGateOpen(true);
        break;

      case "SOLICITUD_ACTIVA":
        show("Ya tienes una adopción activa.", "warning");
        router.push("/dashboards/usuario/adopcion");
        break;

      case "CITA_ACTIVA":
        show("Ya tienes una cita programada.", "warning");
        break;

      default:
        show("No se pudo iniciar la adopción.", "error");
    }
  }, [adopcionResult, handledResult, crearSolicitud, router, show]);


  useEffect(() => {
    if (!adopcionError) return;

    show("Ocurrió un error inesperado. Intenta nuevamente.", "error");
  }, [adopcionError, show]);

  useEffect(() => {
    if (adopcionEnProgreso) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [adopcionEnProgreso]);

  /* ---------------- handlers ---------------- */
  function handleAdopt(mascota: Mascota) {
    setHandledResult(false);
    iniciarAdopcion(mascota);
  }

  /* ---------------- render ---------------- */
  return (
    <>
      <PageHead
        title="Adopta a tu próximo amigo"
        subtitle="Cada mascota merece un hogar lleno de amor. Filtra y conoce a quien encajará perfecto contigo 🐾"
        eyebrow={
          <>
            <span>•</span> <span>Mascotas disponibles</span>
          </>
        }
      />

      {/* Filtros */}
      <div className="mb-6 sm:mb-8">
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

      {/* Feed */}
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

      {/* Modal documentos */}
      <ModalValidacionDocumentos
        open={gateOpen}
        mascota={selectedMascota}
        onClose={() => setGateOpen(false)}
      />

      {/* Overlay progreso */}
      <AdopcionEnProgresoOverlay
        visible={adopcionEnProgreso}
        mensaje={mensajeExito}
      />

      {/* Modal info mascota */}
      <MascotaInfoModal
        open={openCard}
        mascota={selectedMascota}
        onClose={() => setOpenCard(false)}
        onAdopt={handleAdopt}
      />

      {/* Scroll top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-50 grid place-items-center h-12 w-12 rounded-full bg-[#BC5F36] text-white shadow-lg hover:bg-[#a24f2d] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        aria-label="Volver arriba"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
