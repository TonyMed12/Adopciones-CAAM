"use client";

import {
  CheckCircle2,
  PawPrint,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Camera,
  Smile,
  Clock,
} from "lucide-react";
import dayjs from "dayjs";

const ESTADO_META: Record<
  string,
  { label: string; chip: string; ring: string; tone: string }
> = {
  requiere_atencion: {
    label: "Requiere atención",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    ring: "ring-rose-200",
    tone: "border-rose-200",
  },
  regular: {
    label: "Regular",
    chip: "bg-amber-50 text-amber-800 ring-amber-200",
    ring: "ring-amber-200",
    tone: "border-amber-200",
  },
  bueno: {
    label: "Bueno",
    chip: "bg-sky-50 text-sky-700 ring-sky-200",
    ring: "ring-sky-200",
    tone: "border-sky-200",
  },
  excelente: {
    label: "Excelente",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ring: "ring-emerald-200",
    tone: "border-emerald-200",
  },
};

export default function SeguimientoCard({
  seguimiento,
  index,
  onImageClick,
}: {
  seguimiento: any;
  index: number;
  onImageClick?: (url: string) => void;
}) {
  const s = seguimiento;
  const meta =
    ESTADO_META[s.estado_mascota] || {
      label: "No registrado",
      chip: "bg-slate-100 text-slate-600 ring-slate-200",
      ring: "ring-slate-200",
      tone: "border-slate-200",
    };

  const satisfaccion = s.satisfaccion_adoptante ?? 0;

  return (
    <article
      className={`
        relative rounded-3xl bg-white border ${meta.tone} p-5 sm:p-6
        shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)]
        transition hover:shadow-[0_20px_40px_-15px_rgba(43,27,18,0.18)]
      `}
    >
      {/* ============ HEADER ============ */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`
              grid h-11 w-11 place-items-center rounded-2xl shrink-0
              bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2]
              text-[#BC5F36] font-extrabold text-sm ring-1 ring-[#f3d6bb]
            `}
          >
            #{index + 1}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-[#8B4513] tracking-tight">
                Seguimiento #{index + 1}
              </h3>
              {s.completado && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Completado
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {dayjs(s.fecha_seguimiento).format("DD MMM YYYY")}
            </p>
          </div>
        </div>

        {/* Estado */}
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 whitespace-nowrap ${meta.chip}`}
        >
          {s.estado_mascota === "requiere_atencion" && (
            <AlertTriangle className="h-3 w-3" />
          )}
          {s.estado_mascota === "regular" && <Clock className="h-3 w-3" />}
          {s.estado_mascota === "bueno" && <Smile className="h-3 w-3" />}
          {s.estado_mascota === "excelente" && (
            <CheckCircle2 className="h-3 w-3" />
          )}
          {meta.label}
        </span>
      </header>

      <div className="pt-4 grid gap-4">
        {/* Problemas */}
        {Array.isArray(s.problemas_reportados) &&
          s.problemas_reportados.length > 0 && (
            <Block
              Icon={AlertTriangle}
              title="Problemas reportados"
              tone="danger"
            >
              <ul className="grid sm:grid-cols-2 gap-1.5 text-sm text-rose-800">
                {s.problemas_reportados.map((p: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5 leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    {p.replace(/^\w/, (c) => c.toUpperCase())}
                  </li>
                ))}
              </ul>
            </Block>
          )}

        {/* Observaciones */}
        {s.observaciones && (
          <Block Icon={MessageSquare} title="Observaciones del adoptante">
            <p className="text-sm text-slate-700 leading-relaxed">
              {s.observaciones.replace(/^\w/, (c: string) => c.toUpperCase())}
            </p>
          </Block>
        )}

        {/* Recomendaciones */}
        {s.recomendaciones && (
          <Block Icon={Lightbulb} title="Recomendaciones" tone="accent">
            <p className="text-sm text-amber-900 leading-relaxed">
              {s.recomendaciones.replace(/^\w/, (c: string) => c.toUpperCase())}
            </p>
          </Block>
        )}

        {/* Satisfacción */}
        <Block Icon={Smile} title="Satisfacción del adoptante">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <PawPrint
                  key={idx}
                  className={`h-5 w-5 transition ${
                    idx < satisfaccion
                      ? "text-[#BC5F36] fill-current"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#7a5c49]">
              {satisfaccion} / 5
            </span>
          </div>
        </Block>

        {/* Fotos */}
        {Array.isArray(s.fotos_actuales) && s.fotos_actuales.length > 0 && (
          <Block Icon={Camera} title="Evidencias fotográficas">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {s.fotos_actuales.map((url: string, j: number) => (
                <button
                  type="button"
                  key={j}
                  onClick={() => onImageClick?.(url)}
                  className="group block aspect-square overflow-hidden rounded-xl border border-slate-200 ring-1 ring-transparent hover:ring-[#BC5F36]/40 hover:shadow-md transition"
                >
                  <img
                    src={url}
                    alt={`Evidencia ${j + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </button>
              ))}
            </div>
          </Block>
        )}
      </div>
    </article>
  );
}

function Block({
  Icon,
  title,
  tone,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone?: "danger" | "accent";
  children: React.ReactNode;
}) {
  const toneClasses =
    tone === "danger"
      ? "bg-rose-50/40 border-rose-100"
      : tone === "accent"
      ? "bg-amber-50/40 border-amber-100"
      : "bg-slate-50/40 border-slate-100";

  const iconTone =
    tone === "danger"
      ? "bg-rose-100 text-rose-700 ring-rose-200"
      : tone === "accent"
      ? "bg-amber-100 text-amber-700 ring-amber-200"
      : "bg-[#FFF1E6] text-[#BC5F36] ring-[#f3d6bb]";

  return (
    <div className={`rounded-2xl border ${toneClasses} p-3.5 sm:p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`grid h-7 w-7 place-items-center rounded-lg ring-1 ${iconTone}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs sm:text-sm font-extrabold text-[#2b1b12] tracking-tight">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}
