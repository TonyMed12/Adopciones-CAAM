"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageHead from "@/components/layout/PageHead";
import { ArrowLeft, Loader2, ClipboardList, AlertCircle } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#8B4513] gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-semibold">Cargando seguimiento...</p>
      </div>
    );
  }

  if (isError || !mascota) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
          <AlertCircle className="h-7 w-7" />
        </div>
        <p className="text-base font-extrabold text-rose-700">
          Mascota no encontrada
        </p>
        <button
          onClick={() => router.push("/dashboards/administrador/seguimiento")}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#BC5F36] text-white px-4 py-2 text-sm font-semibold hover:bg-[#a34f2e] transition"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-1 sm:px-2 pb-20">
      {/* ============ Volver ============ */}
      <button
        onClick={() => router.push("/dashboards/administrador/seguimiento")}
        className="group inline-flex items-center gap-2 text-[#8B4513] mb-5 text-sm font-semibold cursor-pointer"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-[#eadacb] shadow-sm group-hover:border-[#f3d6bb] group-hover:bg-[#fffaf4] transition">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition" />
        </span>
        <span className="relative">
          Volver a Seguimiento
          <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#8B4513] group-hover:w-full transition-all" />
        </span>
      </button>

      <PageHead
        title={`Seguimiento: ${mascota.nombre}`}
        eyebrow={
          <>
            <ClipboardList size={12} />
            <span>Historial post-adopción</span>
          </>
        }
        subtitle="Revisión de seguimientos registrados por el adoptante."
      />

      <MascotaInfoCard mascota={mascota} onImageClick={setZoomImage} />

      {/* ============ Header seguimientos ============ */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
            <ClipboardList className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#8B4513] tracking-tight truncate">
              Seguimientos registrados
            </h3>
            <p className="text-xs text-slate-500 truncate">
              Reportes ordenados por fecha.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center justify-center min-w-[2rem] h-7 rounded-full bg-[#BC5F36] text-white text-xs font-bold px-2.5 shrink-0">
          {seguimientos.length}
        </span>
      </div>

      {seguimientos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 mb-3">
            <ClipboardList className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Sin seguimientos
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Aún no hay seguimientos registrados para esta mascota.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5">
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

      <ZoomImageModal image={zoomImage} onClose={() => setZoomImage(null)} />
    </div>
  );
}
