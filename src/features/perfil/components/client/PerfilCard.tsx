"use client";

import { useState } from "react";
import { usePerfilQuery } from "@/features/perfil/hooks/usePerfilQuery";

import { usePerfilForm } from "@/features/perfil/hooks/usePerfilForm";
import { useDireccionForm } from "@/features/perfil/hooks/useDireccionForm";
import PerfilSkeleton from "./PerfilSkeleton";
import PerfilDatosCard from "./PerfilDatosCard";
import PerfilDireccionCard from "./PerfilDireccionCard";
import PerfilSolicitudesCard from "./PerfilSolicitudesCard";
import PerfilMascotasCard from "./PerfilMascotasCard";
import PerfilDocumentosCard from "./PerfilDocumentosCard";

import ModalEditarPerfil from "./ModalEditarPerfil";
import ModalEditarDireccion from "./ModalEditarDireccion";

export default function PerfilCard() {
  const { data, isLoading, isError } = usePerfilQuery();

  const [editPerfil, setEditPerfil] = useState(false);
  const [editDir, setEditDir] = useState(false);

  const perfilForm = usePerfilForm(data?.perfil, () =>
    setEditPerfil(false)
  );

  const direccionForm = useDireccionForm(
    data?.direccion,
    data?.perfil?.id,
    () => setEditDir(false)
  );

  if (isLoading) {
    return <PerfilSkeleton />;
  }

  if (isError || !data?.perfil) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/60 p-8 text-center">
        <p className="text-base font-bold text-rose-900">
          No pudimos cargar tu perfil
        </p>
        <p className="text-sm text-rose-800/90 mt-1">
          Recarga la página o intenta más tarde.
        </p>
      </div>
    );
  }

  const {
    perfil,
    direccion,
    solicitudes,
    documentos,
    mascotasAdoptadas,
  } = data;
  

  return (
    <div className="space-y-6">
      <PerfilDatosCard perfil={perfil} onEdit={() => setEditPerfil(true)} />

      <PerfilDireccionCard
        direccion={direccion}
        onEdit={() => setEditDir(true)}
      />

      <PerfilSolicitudesCard solicitudes={solicitudes} />
      <PerfilMascotasCard mascotas={mascotasAdoptadas} />
      <PerfilDocumentosCard documentos={documentos} />

      <ModalEditarPerfil
        open={editPerfil}
        onClose={() => setEditPerfil(false)}
        {...perfilForm}
      />

      <ModalEditarDireccion
        open={editDir}
        onClose={() => setEditDir(false)}
        {...direccionForm}
      />
    </div>
  );
}
