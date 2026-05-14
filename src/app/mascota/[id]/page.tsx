import Link from "next/link";
import {
  ArrowLeft,
  PawPrint,
  Cake,
  Ruler,
  Weight,
  Stethoscope,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { obtenerMascotaPorId } from "@/features/mascotas/actions/mascotas-actions";
import HeaderSmart from "@/components/layout/HeaderSmart";
import MascotaPublicAdoptButton from "@/features/mascotas/components/client/MascotaPublicAdoptButton";

const COLORES_DISPONIBLES = [
  { nombre: "blanco", hex: "#FFFFFF" },
  { nombre: "negro", hex: "#000000" },
  { nombre: "gris", hex: "#808080" },
  { nombre: "gris oscuro", hex: "#4B4B4B" },
  { nombre: "café", hex: "#8B4513" },
  { nombre: "café claro", hex: "#B97A57" },
  { nombre: "beige", hex: "#D6B591" },
  { nombre: "crema", hex: "#F5E8C7" },
  { nombre: "canela", hex: "#C68642" },
  { nombre: "dorado", hex: "#DAA520" },
  { nombre: "miel", hex: "#E2B66C" },
  { nombre: "rojizo", hex: "#B55239" },
  { nombre: "atigrado", hex: "#9C661F" },
  { nombre: "tricolor", hex: "#C19A6B" },
  { nombre: "bicolor", hex: "#C0C0C0" },
  { nombre: "manchado", hex: "#B5A89F" },
  { nombre: "naranja", hex: "#FFA500" },
  { nombre: "gris azulado", hex: "#6E7F80" },
  { nombre: "verde", hex: "#32CD32" },
  { nombre: "verde oscuro", hex: "#228B22" },
  { nombre: "amarillo", hex: "#FFD700" },
  { nombre: "azul", hex: "#1E90FF" },
  { nombre: "celeste", hex: "#87CEEB" },
  { nombre: "rojo", hex: "#DC143C" },
];

export default async function MascotaPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mascota = await obtenerMascotaPorId(id);

  if (!mascota) {
    return (
      <>
        <HeaderSmart />
        <main className="min-h-screen bg-[#FFF8F0] grid place-items-center px-6 pt-32 pb-16">
          <div className="text-center max-w-md">
            <div className="grid place-items-center h-20 w-20 mx-auto rounded-3xl bg-white text-[#BC5F36] shadow-lg mb-4">
              <PawPrint size={36} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#2b1b12] mb-2">
              Mascota no encontrada
            </h1>
            <p className="text-[#7a5c49] mb-6">
              No pudimos localizar esta mascota. Es posible que ya haya sido
              adoptada.
            </p>
            <Link
              href="/dashboards/mascotas"
              className="inline-flex items-center gap-2 rounded-xl bg-[#BC5F36] text-white px-5 py-3 font-semibold hover:bg-[#A0522D] transition"
            >
              <ArrowLeft size={16} />
              Volver al catálogo
            </Link>
          </div>
        </main>
      </>
    );
  }

  const fotoSrc = mascota.imagen_url || "/no-image.png";

  const coloresSeleccionados: string[] = Array.isArray(mascota.colores)
    ? (mascota.colores as string[])
    : [];

  const coloresEnriquecidos = coloresSeleccionados.map((nombre) => {
    const base = COLORES_DISPONIBLES.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
    );
    return {
      nombre,
      hex: base?.hex ?? "#D1D5DB",
    };
  });

  const sexoEsHembra = mascota.sexo?.toLowerCase().startsWith("h");

  const capitalizar = (s?: string | null) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "—";

  const fechaIngreso = new Date(mascota.fecha_ingreso).toLocaleDateString(
    "es-MX",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <>
      <HeaderSmart />

      <main className="min-h-screen bg-[#FFF8F0] pt-24 sm:pt-28 pb-32 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Volver */}
          <Link
            href="/dashboards/mascotas"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B4513] hover:text-[#BC5F36] mb-5 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
            {/* ============ Columna izquierda: HERO Imagen ============ */}
            <section className="relative">
              <div className="sticky top-24">
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-[#eadacb]">
                  {/* Fondo blur con la misma imagen */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-50"
                    style={{ backgroundImage: `url(${fotoSrc})` }}
                  />

                  <div className="relative aspect-[4/5] w-full">
                    <img
                      src={fotoSrc}
                      alt={mascota.nombre}
                      className="relative z-10 w-full h-full object-contain drop-shadow-2xl p-4"
                    />

                    {/* Chip de disponibilidad arriba derecha */}
                    <div className="absolute top-4 right-4 z-20">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                          mascota.disponible_adopcion
                            ? "bg-emerald-500/95 text-white"
                            : "bg-rose-500/95 text-white"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            mascota.disponible_adopcion
                              ? "bg-emerald-200 animate-pulse"
                              : "bg-rose-200"
                          }`}
                        />
                        {mascota.disponible_adopcion
                          ? "Disponible para adopción"
                          : "No disponible"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============ Columna derecha: INFO ============ */}
            <section className="space-y-6">
              {/* Nombre + raza */}
              <header>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                      sexoEsHembra
                        ? "bg-gradient-to-r from-pink-500 to-rose-500"
                        : "bg-gradient-to-r from-sky-500 to-blue-600"
                    }`}
                  >
                    <span>{sexoEsHembra ? "♀" : "♂"}</span>
                    {capitalizar(mascota.sexo)}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] text-[#8B4513] px-3 py-1 text-xs font-bold ring-1 ring-[#f3d6bb]">
                    <PawPrint size={12} />
                    {capitalizar(mascota.raza?.especie) || "Otro"}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2b1b12] tracking-tight capitalize leading-tight">
                  {mascota.nombre}
                </h1>
                <p className="mt-2 text-base text-[#7a5c49]">
                  <span className="font-semibold capitalize">
                    {mascota.raza?.nombre || "Mestizo"}
                  </span>{" "}
                  • Buscando un hogar amoroso
                </p>
              </header>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FactCard
                  icon={<Cake size={18} />}
                  label="Edad"
                  value={capitalizar(mascota.edad) || "—"}
                />
                <FactCard
                  icon={<Ruler size={18} />}
                  label="Tamaño"
                  value={capitalizar(mascota.tamano) || "—"}
                />
                <FactCard
                  icon={<Weight size={18} />}
                  label="Peso"
                  value={mascota.peso_kg ? `${mascota.peso_kg} kg` : "—"}
                />
                <FactCard
                  icon={<ShieldCheck size={18} />}
                  label="Esterilizado"
                  value={mascota.esterilizado ? "Sí" : "No"}
                  tone={mascota.esterilizado ? "success" : "neutral"}
                />
              </div>

              {/* Personalidad destacada */}
              {mascota.personalidad && (
                <Section
                  icon={<Sparkles size={18} />}
                  title="Personalidad"
                  tone="brand"
                >
                  <p className="capitalize text-sm sm:text-base leading-relaxed text-[#4a2c1e]">
                    {mascota.personalidad}
                  </p>
                </Section>
              )}

              {/* Descripción física */}
              {mascota.descripcion_fisica && (
                <Section
                  icon={<PawPrint size={18} />}
                  title="Descripción física"
                >
                  <p className="text-sm sm:text-base leading-relaxed text-[#4a2c1e]">
                    {mascota.descripcion_fisica}
                  </p>
                </Section>
              )}

              {/* Colores */}
              {coloresEnriquecidos.length > 0 && (
                <Section icon={<Palette size={18} />} title="Colores">
                  <div className="flex flex-wrap gap-2">
                    {coloresEnriquecidos.map(({ nombre, hex }) => (
                      <div
                        key={nombre}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#eadacb] bg-white text-[#2B1B12] text-sm shadow-sm"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-[#2b1b12]/15"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="capitalize font-medium">{nombre}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Datos médicos y de rescate */}
              {(mascota.lugar_rescate ||
                mascota.condicion_ingreso ||
                mascota.observaciones_medicas) && (
                <Section
                  icon={<Stethoscope size={18} />}
                  title="Historia médica y rescate"
                  tone="info"
                >
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    {mascota.lugar_rescate && (
                      <div>
                        <dt className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-wide text-[#7a5c49] mb-0.5">
                          <MapPin size={12} /> Lugar de rescate
                        </dt>
                        <dd className="capitalize text-[#2b1b12] font-medium">
                          {mascota.lugar_rescate}
                        </dd>
                      </div>
                    )}
                    {mascota.condicion_ingreso && (
                      <div>
                        <dt className="text-[11px] uppercase font-bold tracking-wide text-[#7a5c49] mb-0.5">
                          Condición de ingreso
                        </dt>
                        <dd className="capitalize text-[#2b1b12] font-medium">
                          {mascota.condicion_ingreso}
                        </dd>
                      </div>
                    )}
                    {mascota.altura_cm && (
                      <div>
                        <dt className="text-[11px] uppercase font-bold tracking-wide text-[#7a5c49] mb-0.5">
                          Altura
                        </dt>
                        <dd className="text-[#2b1b12] font-medium">
                          {mascota.altura_cm} cm
                        </dd>
                      </div>
                    )}
                  </dl>

                  {mascota.observaciones_medicas && (
                    <div className="mt-4 pt-4 border-t border-[#eadacb]">
                      <p className="text-[11px] uppercase font-bold tracking-wide text-[#7a5c49] mb-1">
                        Observaciones médicas
                      </p>
                      <p className="text-sm text-[#2B1B12] leading-relaxed">
                        {mascota.observaciones_medicas}
                      </p>
                    </div>
                  )}
                </Section>
              )}

              {/* Fecha de ingreso */}
              <div className="flex items-center gap-2 text-xs text-[#7a5c49] pt-2">
                <Calendar size={14} />
                <span>
                  Llegó al CAAM el{" "}
                  <span className="font-semibold capitalize">
                    {fechaIngreso}
                  </span>
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Adoptar – sticky bottom en móvil, integrado en desktop */}
        {mascota.disponible_adopcion && (
          <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eadacb] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:relative lg:bg-transparent lg:border-0 lg:shadow-none lg:mt-12">
            <div className="mx-auto max-w-6xl px-4 py-4 lg:py-0 flex items-center justify-between lg:justify-center gap-4">
              <div className="lg:hidden flex items-center gap-3 min-w-0">
                <div className="grid place-items-center h-12 w-12 rounded-xl bg-[#FFF1E6] text-[#BC5F36] shrink-0">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#BC5F36]">
                    Listo para adoptar
                  </p>
                  <p className="text-sm font-extrabold text-[#2b1b12] truncate capitalize">
                    Llévate a {mascota.nombre} a casa
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <MascotaPublicAdoptButton mascota={mascota} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* =================== Componentes auxiliares =================== */

function FactCard({
  icon,
  label,
  value,
  tone = "brand",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: "brand" | "success" | "neutral";
}) {
  const colors =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "neutral"
      ? "bg-slate-50 text-slate-700 ring-slate-200"
      : "bg-[#FFF1E6] text-[#BC5F36] ring-[#f3d6bb]";

  return (
    <div className="rounded-2xl bg-white border border-[#eadacb] p-3.5 shadow-sm">
      <div
        className={`inline-grid place-items-center h-9 w-9 rounded-xl ring-1 ring-inset mb-2 ${colors}`}
      >
        {icon}
      </div>
      <p className="text-[10px] uppercase font-bold tracking-wider text-[#a78d7b]">
        {label}
      </p>
      <p className="text-sm font-extrabold text-[#2b1b12] capitalize">
        {value}
      </p>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  tone = "neutral",
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "brand" | "info" | "neutral";
}) {
  const bg =
    tone === "brand"
      ? "bg-gradient-to-br from-[#FFF7EF] to-white border-[#f3d6bb]"
      : tone === "info"
      ? "bg-sky-50/40 border-sky-100"
      : "bg-white border-[#eadacb]";

  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm ${bg}`}
      aria-labelledby={`section-${title}`}
    >
      <header className="flex items-center gap-2 mb-3">
        {icon && (
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-white text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
            {icon}
          </div>
        )}
        <h2
          id={`section-${title}`}
          className="text-base sm:text-lg font-extrabold text-[#2b1b12] tracking-tight"
        >
          {title}
        </h2>
      </header>
      <div className="text-[#4a2c1e]">{children}</div>
    </section>
  );
}
