"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageHead from "@/components/layout/PageHead";
import { ArrowLeft } from "lucide-react";

import { useSeguimientoPageQuery } from "@/features/seguimiento/queries/useSeguimientoPageQuery";
import MascotaInfoCard from "@/features/seguimiento/components/client/MascotaInfoCard";
import SeguimientoCard from "@/features/seguimiento/components/client/SeguimientoCard";
import ZoomImageModal from "@/features/seguimiento/components/client/ZoomImageModal";

export default function SeguimientoPorMascotaPage() {
  const router = useRouter();
  const params = useParams();
  const mascotaId = params?.id as string;

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const { mascota, seguimientos, isLoading, isError } =
    useSeguimientoPageQuery(mascotaId);

  if (isLoading)
    return (
      <div className="text-center py-20 text-[#8B4513]">
        Cargando seguimiento...
      </div>
    );

  if (isError || !mascota)
    return (
      <div className="text-center py-20 text-red-600">
        Mascota no encontrada.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">

      <button
        onClick={() => router.push("/dashboards/administrador/seguimiento")}
        className="group flex items-center gap-2 text-[#8B4513] mb-4 font-medium cursor-pointer"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
        <span className="relative">
          Volver a Seguimiento
          <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#8B4513] 
                     group-hover:w-full transition-all"></span>
        </span>
      </button>

      <PageHead
        title={`Seguimiento: ${mascota.nombre}`}
        subtitle="Revisión de seguimientos registrados por el adoptante"
      />

      <MascotaInfoCard mascota={mascota} onImageClick={setZoomImage} />

      <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
        Seguimientos registrados
      </h3>

      {seguimientos.length === 0 ? (
        <p className="text-gray-600 text-center py-10">
          Aún no hay seguimientos registrados para esta mascota.
        </p>
      ) : (
        <div className="grid gap-6">
          {seguimientos.map((s, i) => (
            <SeguimientoCard
              key={s.id}
              seguimiento={s}
              index={i}
              onImageClick={setZoomImage}
            />
          ))}
        </div>
      )}

      <ZoomImageModal
        image={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
