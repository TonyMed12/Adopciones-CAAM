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
    iniciarAdopcion(mascota);
  }

  /* ---------------- render ---------------- */
  return (
    <>
      <PageHead
        title="Mascotas"
        subtitle="Encuentra a tu nuevo mejor amigo 🐾"
      />

      {/* Filtros */}
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
        className="
          fixed bottom-5 right-5 z-50
          bg-[#BC5F36] text-white p-3 rounded-full
          shadow-lg hover:bg-[#a24f2d] hover:shadow-xl
          transition-all duration-200
        "
        aria-label="Volver arriba"
      >
        ↑
      </button>
    </>
  );
}
