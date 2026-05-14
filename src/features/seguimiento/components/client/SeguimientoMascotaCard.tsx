"use client";

import dayjs from "dayjs";
import { Info, PawPrint, CalendarHeart, Upload, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Timeline, type TimelineItem } from "@/components/ui/Timeline";

export default function SeguimientoMascotaCard({
  mascota,
  onInfo,
  onSubirSeguimiento,
}: {
  mascota: any;
  onInfo: () => void;
  onSubirSeguimiento: (seguimiento: any) => void;
}) {
  const seguimientos = mascota.seguimientos ?? [];
  const completados = seguimientos.filter(
    (s: any) => s.estado === "Completado"
  ).length;
  const total = seguimientos.length;

  const items: TimelineItem[] = seguimientos.map((s: any, i: number) => {
    const isCompletado = s.estado === "Completado";
    const isActivo = s.estado === "Activo";
    const tone = isCompletado ? "success" : isActivo ? "brand" : "neutral";

    return {
      id: `${mascota.id}-${i}`,
      tone,
      icon: isCompletado ? (
        <CheckCircle2 size={16} />
      ) : isActivo ? (
        <CalendarHeart size={16} />
      ) : (
        <Clock size={16} />
      ),
      title: s.nombre,
      meta: (
        <span className="inline-flex items-center gap-1 font-medium">
          <CalendarHeart size={12} />
          {dayjs(s.fecha).format("DD MMM YYYY")}
        </span>
      ),
      badge: (
        <Badge
          tone={
            isCompletado ? "success" : isActivo ? "warning" : "neutral"
          }
          size="sm"
        >
          {s.estado}
        </Badge>
      ),
      description: isActivo ? (
        <Button
          size="sm"
          onClick={() => onSubirSeguimiento(s)}
          className="mt-2 gap-1.5"
        >
          <Upload size={14} />
          Subir evidencia
        </Button>
      ) : null,
    };
  });

  return (
    <article className="rounded-3xl bg-white border border-[#eadacb] shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-fade-up">
      {/* ============ HEADER ============ */}
      <header className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-6 p-5 sm:p-6 bg-gradient-to-br from-[#FFF7EF] to-[#FFEAD2] border-b border-[#eadacb]">
        <div className="flex justify-center sm:justify-start">
          <img
            src={
              mascota.imagen?.startsWith("http")
                ? mascota.imagen
                : "/placeholder.png"
            }
            alt={mascota.nombre}
            className="rounded-2xl object-cover w-28 h-28 sm:w-36 sm:h-36 ring-4 ring-white shadow-md"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
          <Badge tone="brand" size="md" icon={<PawPrint size={12} />}>
            Mi adopción
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b12] tracking-tight capitalize">
            {mascota.nombre}
          </h2>
          <p className="text-sm text-[#7a5c49]">
            <span className="font-semibold">Adoptada el</span>{" "}
            {mascota.fechaAdopcion}
          </p>

          {/* Progress chip */}
          <div className="mt-2 flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#8B4513] px-3 py-1 text-xs font-bold ring-1 ring-[#f3d6bb]">
              <CheckCircle2 size={12} />
              {completados} / {total} seguimientos completados
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={onInfo}
              className="gap-1.5"
            >
              <Info size={14} />
              Cómo funciona
            </Button>
          </div>
        </div>
      </header>

      {/* ============ TIMELINE DE SEGUIMIENTOS ============ */}
      <div className="p-5 sm:p-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-[#7a5c49] py-6">
            Aún no hay seguimientos programados.
          </p>
        ) : (
          <Timeline items={items} />
        )}
      </div>
    </article>
  );
}
