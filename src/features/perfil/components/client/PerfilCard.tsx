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
      <p className="text-center py-10 text-red-600">
        Error cargando el perfil.
      </p>
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
