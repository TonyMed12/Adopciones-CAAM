"use client";

import PageHead from "@/components/layout/PageHead";
import { BarChart3, FileBarChart, Sparkles } from "lucide-react";

export default function ReportesPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHead
        title="Reportes"
        eyebrow={
          <>
            <BarChart3 size={12} />
            <span>Análisis e indicadores</span>
          </>
        }
        icon={<FileBarChart size={20} />}
        subtitle="Próximamente: métricas detalladas, exportaciones y gráficas del centro."
      />

      <section className="relative overflow-hidden rounded-3xl border border-dashed border-[#eadacb] bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2] p-8 sm:p-12 text-center">
        <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#FDE68A]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#BC5F36]/10 blur-3xl" />

        <div className="relative max-w-md mx-auto">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-[#BC5F36] shadow-lg ring-1 ring-[#f3d6bb] mb-4">
            <BarChart3 className="h-8 w-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] text-[#BC5F36] px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb]">
            <Sparkles className="h-3 w-3" />
            En desarrollo
          </span>

          <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-[#2b1b12] tracking-tight">
            Módulo de reportes
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#6c5241] leading-relaxed">
            Estamos preparando un panel con gráficas, exportaciones y análisis
            del flujo de adopciones y citas para esta sección.
          </p>
        </div>
      </section>
    </div>
  );
}
