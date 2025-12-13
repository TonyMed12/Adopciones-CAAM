"use client";

import React, { useState } from "react";
import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotasFeed from "@/features/mascotas/components/client/MascotasFeed";
import MascotaInfoModal from "@/features/mascotas/components/client/MascotaInfoModal";
import ModalLoginRequired from "@/components/auth/ModalLoginRequired";

import { ESPECIES } from "@/features/mascotas/data/constants";
import type { Mascota } from "@/features/mascotas/types/mascotas";

export default function MascotasPublicPage() {
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");

  const [openCard, setOpenCard] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);

  const [loginModal, setLoginModal] = useState(false);

  return (
    <>
      <PageHead
        title="Mascotas"
        subtitle="Explora a nuestros adorables compañeros 🐾"
      />

      <div className="mb-6">        
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
        onAdopt={() => {
          setLoginModal(true);
        }}
      />

      <MascotaInfoModal
        open={openCard}
        mascota={selectedMascota}
        onClose={() => setOpenCard(false)}
        onAdopt={() => setLoginModal(true)}
      />

      <ModalLoginRequired
        open={loginModal}
        onClose={() => setLoginModal(false)}
      />
    </>
  );
}
