"use client";

import dayjs from "dayjs";
import {
  Heart,
  Award,
  ClipboardList,
  PawPrint,
  Calendar,
  Sparkles,
  Cake,
  Weight,
  Ruler,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { generarFechasSeguimiento } from "@/features/mascotas/utils/generarFechasSeguimiento";

export default function MisMascotasCard({
  mascota,
  onVerCertificado,
}: {
  mascota: any;
  onVerCertificado: (mascota: any) => void;
}) {
  const fechaAdopcion = dayjs(mascota.fecha_adopcion);
  const seguimientos = generarFechasSeguimiento(fechaAdopcion);

  const coloresTexto = Array.isArray(mascota.colores)
    ? mascota.colores.join(", ")
    : mascota.colores || "";

  const esHembra = mascota.sexo?.toLowerCase()?.startsWith("h");

  return (
    <article className="overflow-hidden rounded-3xl border border-[#eadacb] bg-white shadow-sm hover:shadow-lg transition-shadow animate-fade-up">
      <div className="flex flex-col lg:flex-row">
        {/* ============ Imagen + emoji overlay ============ */}
        <div className="relative lg:w-[40%] lg:max-w-[420px] aspect-[4/3] lg:aspect-auto bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] overflow-hidden">
          <img
            src={
              mascota.imagen_url?.startsWith("http")
                ? mascota.imagen_url
                : "/placeholder.png"
            }
            alt={mascota.mascota_nombre || "Mascota adoptada"}
            className="w-full h-full object-cover"
          />

          {/* Overlay con badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <Badge tone="solid" size="md" icon={<Heart size={12} fill="currentColor" />}>
              Mi mascota
            </Badge>
            {mascota.sexo && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md ${
                  esHembra
                    ? "bg-gradient-to-r from-pink-500 to-rose-500"
                    : "bg-gradient-to-r from-sky-500 to-blue-600"
                }`}
              >
                <span>{esHembra ? "♀" : "♂"}</span>
                {mascota.sexo}
              </span>
            )}
          </div>
        </div>

        {/* ============ Info ============ */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col">
          <header className="space-y-1.5 mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b12] tracking-tight capitalize leading-tight">
              {mascota.mascota_nombre || "Sin nombre"}
            </h2>
            <p className="text-sm sm:text-base text-[#7a5c49]">
              {mascota.raza_nombre ? (
                <span className="capitalize">{mascota.raza_nombre}</span>
              ) : (
                "Mestizo"
              )}{" "}
              • Parte de tu familia desde{" "}
              <span className="font-semibold text-[#8B4513]">
                {fechaAdopcion.isValid()
                  ? fechaAdopcion.format("DD MMM YYYY")
                  : "—"}
              </span>
            </p>

            {mascota.personalidad && (
              <p className="mt-2 text-sm italic text-[#6c5241] leading-relaxed">
                "{mascota.personalidad}"
              </p>
            )}
          </header>

          {/* Stats compactos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            <StatPill
              icon={<Cake size={14} />}
              label="Edad"
              value={mascota.edad || "—"}
            />
            <StatPill
              icon={<Ruler size={14} />}
              label="Tamaño"
              value={mascota.tamano || "—"}
            />
            {mascota.peso_kg && (
              <StatPill
                icon={<Weight size={14} />}
                label="Peso"
                value={`${mascota.peso_kg} kg`}
              />
            )}
            {mascota.esterilizado !== null &&
              mascota.esterilizado !== undefined && (
                <StatPill
                  icon={<ShieldCheck size={14} />}
                  label="Esterilizado"
                  value={mascota.esterilizado ? "Sí" : "No"}
                  tone={mascota.esterilizado ? "success" : "neutral"}
                />
              )}
            {coloresTexto && (
              <StatPill
                icon={<Palette size={14} />}
                label="Colores"
                value={coloresTexto}
              />
            )}
          </div>

          {/* Próximos seguimientos */}
          {seguimientos.length > 0 && (
            <div className="rounded-2xl border border-[#eadacb] bg-[#FFF7EF]/50 p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#BC5F36]" />
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#8B4513]">
                  Próximos seguimientos
                </h4>
              </div>
              <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
                {seguimientos.slice(0, 4).map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[#6c5241]"
                  >
                    <Calendar size={12} className="text-[#a78d7b] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
            <ButtonLink
              href={`/dashboards/usuario/seguimiento/${mascota.adopcion_id}`}
              variant="secondary"
              size="md"
              className="w-full sm:w-auto gap-2"
            >
              <ClipboardList size={16} />
              Gestionar seguimiento
            </ButtonLink>

            <Button
              size="md"
              className="w-full sm:w-auto gap-2"
              onClick={() => onVerCertificado(mascota)}
            >
              <Award size={16} />
              Certificado
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatPill({
  icon,
  label,
  value,
  tone = "brand",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "brand" | "success" | "neutral";
}) {
  const colors =
    tone === "success"
      ? "text-emerald-700"
      : tone === "neutral"
      ? "text-slate-600"
      : "text-[#BC5F36]";
  return (
    <div className="rounded-xl bg-white border border-[#eadacb] px-3 py-2">
      <p className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#a78d7b]">
        <span className={colors}>{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-[#2b1b12] capitalize truncate mt-0.5">
        {value}
      </p>
    </div>
  );
}
