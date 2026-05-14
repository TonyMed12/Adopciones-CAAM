"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Heart,
  ArrowRight,
  Compass,
  FileText,
  CalendarCheck,
  ClipboardCheck,
  PawPrint,
  PartyPopper,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Stepper, type Step } from "@/components/ui/Stepper";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

import { obtenerNombreUsuarioActual } from "@/features/perfil/actions/usuario-actions";
import { useProcesoAdopcionQuery } from "@/features/adopciones/hooks/useProcesoAdopcionQuery";

/* =================== Cálculo de etapa actual =================== */
type Stage =
  | "explorar"
  | "documentos"
  | "cita"
  | "form"
  | "esperando"
  | "aprobada";

function computeStage(args: {
  solicitudActiva: any;
  citaActiva: any;
  adopcionEstado: any;
}): Stage {
  const { solicitudActiva, citaActiva, adopcionEstado } = args;
  if (adopcionEstado === "aprobada") return "aprobada";
  if (adopcionEstado === "pendiente") return "esperando";
  if (!solicitudActiva) return "explorar";
  if (solicitudActiva.estado === "en_proceso") return "form";
  if (citaActiva) return "cita";
  return "documentos";
}

const STAGE_INDEX: Record<Stage, number> = {
  explorar: 0,
  documentos: 1,
  cita: 2,
  form: 3,
  esperando: 4,
  aprobada: 5,
};

const STAGE_LABEL: Record<Stage, string> = {
  explorar: "Explorando",
  documentos: "Validando documentos",
  cita: "Cita agendada",
  form: "Completar formulario",
  esperando: "Esperando aprobación",
  aprobada: "Adopción aprobada",
};

/* =================== Página =================== */
export default function DashboardUsuarioPage() {
  const [userName, setUserName] = useState("Usuario");
  const [loadingName, setLoadingName] = useState(true);

  const { data: proceso, isLoading: loadingProceso } = useProcesoAdopcionQuery();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const nombre = await obtenerNombreUsuarioActual();
        if (!cancelled) setUserName(nombre || "Usuario");
      } catch {
        if (!cancelled) setUserName("Usuario");
      } finally {
        if (!cancelled) setLoadingName(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stage = computeStage({
    solicitudActiva: proceso?.solicitudActiva,
    citaActiva: proceso?.citaActiva,
    adopcionEstado: proceso?.adopcionEstado,
  });

  const stageIdx = STAGE_INDEX[stage];
  const totalSteps = 6;
  const progressValue = Math.round(((stageIdx + (stage === "explorar" ? 0 : 1)) / totalSteps) * 100);

  /* =================== Steps del stepper =================== */
  const steps: Step[] = [
    {
      id: "explorar",
      title: "Explora",
      description: "Conoce mascotas",
      state:
        stageIdx > 0 ? "completed" : stage === "explorar" ? "current" : "upcoming",
    },
    {
      id: "documentos",
      title: "Documentos",
      description: "Identificación y comprobante",
      state:
        stageIdx > 1 ? "completed" : stage === "documentos" ? "current" : "upcoming",
    },
    {
      id: "cita",
      title: "Cita",
      description: "Conoce a tu mascota",
      state:
        stageIdx > 2 ? "completed" : stage === "cita" ? "current" : "upcoming",
    },
    {
      id: "form",
      title: "Formulario",
      description: "Detalles del hogar",
      state:
        stageIdx > 3 ? "completed" : stage === "form" ? "current" : "upcoming",
    },
    {
      id: "esperando",
      title: "Revisión",
      description: "Aprobación final",
      state:
        stageIdx > 4 ? "completed" : stage === "esperando" ? "current" : "upcoming",
    },
    {
      id: "aprobada",
      title: "Adopción",
      description: "Bienvenido a casa",
      state: stage === "aprobada" ? "completed" : "upcoming",
    },
  ];

  /* =================== Card de acción siguiente =================== */
  const nextAction = getNextAction(stage, proceso);

  return (
    <div className="space-y-12 md:space-y-16">
      {/* =================== HERO PERSONALIZADO =================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF7EF] via-[#FFEAD2] to-[#FFDCC0] border border-[#f3d6bb] shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#d48458]/30 blur-[110px] rounded-full pointer-events-none"
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-[320px] h-[320px] bg-[#3c1d14]/10 blur-[90px] rounded-full pointer-events-none"
        />

        <div className="relative z-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-center p-6 sm:p-10 lg:p-14">
          <div className="space-y-5">
            <Badge tone="brand" size="lg" icon={<Sparkles size={14} />}>
              Tu Centro de Adopción
            </Badge>

            <div>
              {loadingName ? (
                <Skeleton className="h-10 w-64 mb-2" />
              ) : (
                <p className="text-base sm:text-lg text-[#BC5F36] font-semibold">
                  Hola, {userName} 👋
                </p>
              )}
              <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2b1b12] leading-[1.05] tracking-tight">
                {stage === "explorar" &&
                  <>Tu próxima mejor amiga<br/><span className="text-[#BC5F36]">te está esperando.</span></>}
                {stage === "documentos" &&
                  <>Estamos preparando<br/><span className="text-[#BC5F36]">tu adopción.</span></>}
                {stage === "cita" &&
                  <>Tu cita está<br/><span className="text-[#BC5F36]">programada.</span></>}
                {stage === "form" &&
                  <>Un paso más<br/><span className="text-[#BC5F36]">para llegar a casa.</span></>}
                {stage === "esperando" &&
                  <>Estamos revisando<br/><span className="text-[#BC5F36]">tu adopción.</span></>}
                {stage === "aprobada" &&
                  <>¡Bienvenidos a<br/><span className="text-[#BC5F36]">su nuevo hogar!</span></>}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#6b4a3b] max-w-xl leading-relaxed">
              {stage === "explorar" &&
                "Explora mascotas disponibles, conócelas y empieza tu proceso con el acompañamiento del CAAM."}
              {stage === "documentos" &&
                "Sube tus documentos para que podamos validarlos. Cuando estén listos, podrás agendar tu cita."}
              {stage === "cita" &&
                "Pronto conocerás a tu posible nueva mascota. Revisa los detalles de tu cita."}
              {stage === "form" &&
                "Completa el formulario de adopción con los detalles de tu hogar para finalizar el proceso."}
              {stage === "esperando" &&
                "Nuestro equipo está revisando tu solicitud. Te avisaremos cuando esté lista."}
              {stage === "aprobada" &&
                "Tu adopción fue aprobada. ¡Disfruta cada momento con tu nueva compañía!"}
            </p>

            {/* Progreso del proceso */}
            {!loadingProceso && (
              <div className="max-w-md">
                <ProgressBar
                  value={progressValue}
                  showValue
                  label={`Etapa: ${STAGE_LABEL[stage]}`}
                  tone="brand"
                />
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              {nextAction.href && (
                <Link href={nextAction.href}>
                  <Button size="lg" className="!px-6 !py-3.5 text-base gap-2">
                    {nextAction.label}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              )}

              {stage !== "explorar" && (
                <Link href="/dashboards/usuario/mascotas">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="!px-6 !py-3.5 text-base"
                  >
                    Ver más mascotas
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Visual hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative">
              <motion.img
                src="https://img.freepik.com/fotos-premium/lindo-jack-russel-terrier-sobre-fondo-naranja-palido-espacio-texto_495423-46244.jpg"
                alt="Mascota disponible"
                className="w-[300px] xl:w-[360px] h-[380px] xl:h-[440px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] object-cover ring-8 ring-white/60"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              {/* Badge flotante */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 ring-1 ring-[#eadacb]"
              >
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#FFF1E6] text-[#BC5F36]">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                    Mascotas disponibles
                  </p>
                  <p className="text-sm font-extrabold text-[#2b1b12]">
                    Esperando hogar
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =================== STEPPER DEL PROCESO =================== */}
      <section>
        <SectionHeader
          eyebrow="Tu progreso"
          title="Mi viaje de adopción"
          description="Sigue tu proceso paso a paso. Te indicamos qué hacer después en cada etapa."
        />

        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 sm:p-8">
          {loadingProceso ? (
            <div className="flex justify-between gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton variant="circle" className="h-10 w-10" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <Stepper steps={steps} orientation="horizontal" />
          )}

          {/* Next action callout debajo del stepper */}
          {!loadingProceso && nextAction.href && (
            <div className="mt-6 sm:mt-8 rounded-2xl bg-gradient-to-br from-[#FFF7EF] to-[#FFE8D2] border border-[#f3d6bb] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-[#BC5F36] shadow-sm ring-1 ring-[#f3d6bb] shrink-0">
                  {nextAction.icon}
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-[#BC5F36]">
                    Siguiente paso
                  </p>
                  <p className="text-base sm:text-lg font-extrabold text-[#2b1b12] mt-0.5">
                    {nextAction.title}
                  </p>
                  <p className="text-sm text-[#7a5c49] mt-1">
                    {nextAction.description}
                  </p>
                </div>
              </div>
              <Link href={nextAction.href} className="w-full sm:w-auto">
                <Button size="md" className="w-full sm:w-auto gap-2">
                  {nextAction.label}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =================== ACCIONES RÁPIDAS =================== */}
      <section>
        <SectionHeader
          eyebrow="Accesos rápidos"
          title="Acciones rápidas"
          description="Lo más usado, siempre a un clic."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <QuickAction
            icon={<PawPrint size={22} />}
            label="Ver adoptables"
            description="Catálogo de mascotas"
            href="/dashboards/usuario/mascotas"
          />
          <QuickAction
            icon={<Heart size={22} />}
            label="Mi proceso"
            description="Estado de adopción"
            href="/dashboards/usuario/adopcion"
          />
          <QuickAction
            icon={<CalendarCheck size={22} />}
            label="Mis citas"
            description="Próximas y pasadas"
            href="/dashboards/usuario/citas"
          />
          <QuickAction
            icon={<Stethoscope size={22} />}
            label="Mis mascotas"
            description="Tus compañeros"
            href="/dashboards/usuario/mis-mascotas"
          />
        </div>
      </section>

      {/* =================== BENEFICIOS =================== */}
      <section>
        <SectionHeader
          eyebrow="Por qué adoptar con nosotros"
          title="Beneficios CAAM"
          description="Te acompañamos antes, durante y después del proceso."
          size="lg"
        />

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          <Feature
            icon={<ShieldCheck size={22} />}
            title="Acompañamiento real"
            desc="Te guiamos desde tu primera elección hasta el seguimiento final con tu mascota."
          />
          <Feature
            icon={<Sparkles size={22} />}
            title="Perfiles completos"
            desc="Conoce energía, cuidados, compatibilidad y recomendaciones personalizadas."
          />
          <Feature
            icon={<Heart size={22} />}
            title="Adopción responsable"
            desc="Prioridad total al bienestar y adaptación saludable de tu nueva mascota."
          />
        </div>
      </section>

      {/* =================== TESTIMONIOS =================== */}
      <section className="rounded-3xl p-6 sm:p-10 bg-white/80 backdrop-blur-md border border-[#efddca] shadow-sm">
        <SectionHeader
          eyebrow="Historias reales"
          title="Familias que ya adoptaron"
          description="El antes y después de las personas que confiaron en nosotros."
        />

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          <Testimonial
            name="Laura & Toby"
            text="Nunca pensé que adoptar sería tan transformador. Toby llegó a llenar nuestro hogar de energía y amor."
          />
          <Testimonial
            name="Jorge & Mish"
            text="El proceso fue claro de inicio a fin. Mish ahora es parte esencial de nuestra familia."
          />
        </div>
      </section>
    </div>
  );
}

/* =================== Componentes auxiliares =================== */

function QuickAction({
  icon,
  label,
  description,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#f3d6bb] transition-all"
    >
      <div className="grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-[#FFF1E6] text-[#BC5F36] mb-3 group-hover:bg-[#BC5F36] group-hover:text-white transition-colors">
        {icon}
      </div>
      <p className="text-sm sm:text-base font-extrabold text-[#2b1b12] leading-tight">
        {label}
      </p>
      <p className="mt-1 text-xs sm:text-sm text-[#7a5c49] leading-relaxed">
        {description}
      </p>
      <ArrowRight
        size={16}
        className="absolute top-4 right-4 text-[#a78d7b] group-hover:text-[#BC5F36] group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-[#eadacb] bg-white p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div className="grid place-items-center h-11 w-11 rounded-xl bg-[#FFF1E6] text-[#BC5F36] mb-3 ring-1 ring-[#f3d6bb]">
        {icon}
      </div>
      <p className="text-lg font-extrabold text-[#2b1b12] tracking-tight">
        {title}
      </p>
      <p className="text-sm text-[#7a5c49] mt-1.5 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-[#eadacb] bg-gradient-to-br from-[#fffaf4] to-[#FFF1E6] p-5 sm:p-6"
    >
      <span className="text-3xl text-[#BC5F36] leading-none">"</span>
      <blockquote className="text-[#2b1b12] text-sm sm:text-base leading-relaxed -mt-2">
        {text}
      </blockquote>
      <figcaption className="mt-3 text-xs font-bold uppercase tracking-wide text-[#BC5F36]">
        — {name}
      </figcaption>
    </motion.figure>
  );
}

/* =================== Lógica next action =================== */
function getNextAction(stage: Stage, _proceso: any) {
  switch (stage) {
    case "explorar":
      return {
        title: "Explora las mascotas disponibles",
        description:
          "Encuentra a tu compañera o compañero ideal según tus preferencias.",
        label: "Ver mascotas",
        icon: <Compass size={22} />,
        href: "/dashboards/usuario/mascotas",
      };
    case "documentos":
      return {
        title: "Sube y valida tus documentos",
        description:
          "Necesitamos verificar tu identificación, comprobante de domicilio y CURP.",
        label: "Ir a documentos",
        icon: <FileText size={22} />,
        href: "/dashboards/usuario/adopcion",
      };
    case "cita":
      return {
        title: "Revisa tu cita agendada",
        description:
          "Confirma fecha, hora y lo que necesitas llevar a tu cita presencial.",
        label: "Ver mi cita",
        icon: <CalendarCheck size={22} />,
        href: "/dashboards/usuario/citas",
      };
    case "form":
      return {
        title: "Completa el formulario de adopción",
        description:
          "Cuéntanos sobre tu hogar para validar la compatibilidad con la mascota.",
        label: "Llenar formulario",
        icon: <ClipboardCheck size={22} />,
        href: "/dashboards/usuario/adopcion",
      };
    case "esperando":
      return {
        title: "Tu adopción está en revisión",
        description:
          "Te notificaremos en cuanto el equipo termine de revisar tu solicitud.",
        label: "Ver detalles",
        icon: <FileText size={22} />,
        href: "/dashboards/usuario/adopcion",
      };
    case "aprobada":
      return {
        title: "¡Tu adopción fue aprobada!",
        description:
          "Lleva el seguimiento de tu mascota desde tu nuevo panel personalizado.",
        label: "Ver mi mascota",
        icon: <PartyPopper size={22} />,
        href: "/dashboards/usuario/mis-mascotas",
      };
    default:
      return {
        title: "Explora las mascotas disponibles",
        description: "Encuentra tu compañero ideal.",
        label: "Ver mascotas",
        icon: <Compass size={22} />,
        href: "/dashboards/usuario/mascotas",
      };
  }
}
