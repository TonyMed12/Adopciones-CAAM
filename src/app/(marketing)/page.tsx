"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PawPrint,
  Heart,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Quote,
  Star,
  CheckCircle2,
  Search,
  Calendar,
  FileText,
  Home,
} from "lucide-react";

export default function LandingPage() {
  const IMAGES = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&q=70&w=1000",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&q=70&w=1000",
    "https://baluka.es/cdn/shop/articles/razas-de-perros-mas-comunes.jpg?v=1695689090&width=1000",
  ];

  const TypewriterWords = () => {
    const words = [
      "amor",
      "sonrisas",
      "alegría",
      "amistad",
      "una vida",
      "ilusión",
      "lealtad",
      "felicidad",
      "cariño",
      "ternura",
    ];
    const [index, setIndex] = React.useState(0);
    const [subIndex, setSubIndex] = React.useState(0);
    const [deleting, setDeleting] = React.useState(false);

    React.useEffect(() => {
      const timeout = setTimeout(
        () => {
          if (!deleting && subIndex < words[index].length) {
            setSubIndex(subIndex + 1);
          } else if (deleting && subIndex > 0) {
            setSubIndex(subIndex - 1);
          } else if (!deleting && subIndex === words[index].length) {
            setTimeout(() => setDeleting(true), 900);
          } else if (deleting && subIndex === 0) {
            setDeleting(false);
            setIndex((prev) => (prev + 1) % words.length);
          }
        },
        deleting ? 60 : 90
      );

      return () => clearTimeout(timeout);
    }, [subIndex, deleting, index]);

    return (
      <span className="border-r-4 border-white pr-1 inline-flex items-center h-[1.25em] leading-[1.05] text-inherit">
        {words[index].substring(0, subIndex)}
      </span>
    );
  };

  const stats = [
    { value: "+850", label: "Mascotas adoptadas", icon: Heart },
    { value: "+1.2k", label: "Familias felices", icon: Home },
    { value: "100%", label: "Salud verificada", icon: ShieldCheck },
    { value: "24/7", label: "Acompañamiento", icon: Stethoscope },
  ];

  const steps = [
    {
      n: "01",
      title: "Explora",
      desc: "Conoce las mascotas disponibles y encuentra la que conecte contigo.",
      icon: Search,
    },
    {
      n: "02",
      title: "Agenda",
      desc: "Programa una visita al CAAM para convivir con tu posible compañero.",
      icon: Calendar,
    },
    {
      n: "03",
      title: "Formaliza",
      desc: "Completa documentos y formulario; nuestro equipo valida cada paso.",
      icon: FileText,
    },
    {
      n: "04",
      title: "Llévalo a casa",
      desc: "Una vez aprobada la adopción, tu nuevo amigo se va contigo.",
      icon: Home,
    },
  ];

  const features = [
    {
      title: "Salud garantizada",
      desc: "Vacunación, desparasitación y revisión veterinaria al día.",
      icon: Stethoscope,
    },
    {
      title: "Proceso transparente",
      desc: "Sigue cada etapa desde tu panel, sin sorpresas ni trámites ocultos.",
      icon: ShieldCheck,
    },
    {
      title: "Acompañamiento real",
      desc: "Te asesoramos antes, durante y después de la adopción.",
      icon: Heart,
    },
    {
      title: "Compromiso CAAM",
      desc: "Cada mascota es evaluada para garantizar una convivencia feliz.",
      icon: Sparkles,
    },
  ];

  const testimonios = [
    {
      nombre: "Andrea G.",
      mascota: "con Luna",
      texto:
        "El proceso fue increíblemente claro y humano. Luna llegó a casa siendo parte de la familia desde el primer día.",
      img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&q=70&w=400",
    },
    {
      nombre: "Carlos R.",
      mascota: "con Bruno",
      texto:
        "Me acompañaron en cada paso. Bruno estaba sanito y muy sociable. Hoy es nuestro mejor amigo.",
      img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&q=70&w=400",
    },
    {
      nombre: "Sofía M.",
      mascota: "con Mía",
      texto:
        "Adopté a Mía hace dos meses. Me encantó que todo se hace por la app y que cuidan tanto a los animales.",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&q=70&w=400",
    },
  ];

  return (
    <main className="bg-[#FFF8F0] relative overflow-hidden w-full">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* BACKGROUND */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://jivnxysdyziojckvslqp.supabase.co/storage/v1/object/public/logos/bg-green.jpeg')",
          }}
          animate={{
            backgroundPosition: ["50% 50%", "48% 52%", "52% 48%", "50% 50%"],
            scale: [1, 1.012, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Overlay para mejorar lectura */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-[#8B4513]/30" />

        {/* Glow */}
        <motion.div
          className="absolute right-0 top-10 w-[200px] md:w-[350px] h-[200px] md:h-[350px] rounded-full bg-[#D97706]/25 blur-[100px] md:blur-[140px]"
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* HERO CONTENT */}
        <div className="relative z-20 pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 md:pb-28">
          <div className="container mx-auto px-5 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
              className="relative z-50 w-full md:max-w-3xl text-left md:pl-6 lg:pl-10"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 mb-6 ring-1 ring-white/30"
              >
                <PawPrint className="h-3.5 w-3.5 text-[#FDE68A]" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">
                  Centro de Atención Animal Morelia
                </span>
              </motion.div>

              {/* Título */}
              <div className="font-extrabold text-white leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 select-none">
                <div className="flex items-center gap-3 h-[1.25em]">
                  <span className="whitespace-nowrap">Adopta</span>
                  <span className="inline-flex items-center h-[1.25em] overflow-hidden min-w-[150px]">
                    <TypewriterWords />
                  </span>
                </div>
                <div className="mt-2 sm:mt-3 whitespace-nowrap h-[1.25em] flex items-center">
                  en su forma
                </div>
                <div className="mt-2 sm:mt-3 whitespace-nowrap h-[1.25em] flex items-center">
                  más pura
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <p className="text-base sm:text-lg md:text-xl text-[#FFF8F0]/95 leading-relaxed max-w-lg">
                Encuentra a tu compañero de vida. Animales rescatados, evaluados
                y listos para llenar tu hogar de cariño.
              </p>

              {/* BOTONES */}
              <div className="mt-8 sm:mt-10 flex gap-3 sm:gap-4 flex-wrap">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/dashboards/mascotas"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#8B4513] font-semibold shadow-lg shadow-black/20 hover:bg-[#FFF8F0] transition"
                  >
                    Ver mascotas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B4513]/90 backdrop-blur text-white font-semibold shadow-lg shadow-black/20 hover:bg-[#A0522D] transition ring-1 ring-white/20"
                  >
                    Inicia Sesión
                  </Link>
                </motion.div>
              </div>

              {/* Mini trust row */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FDE68A]" />
                  Salud verificada
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FDE68A]" />
                  Acompañamiento del equipo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FDE68A]" />
                  Adopción 100% gratuita
                </span>
              </div>
            </motion.div>

            {/* BLOBS - RESPONSIVE + FIXED LAYOUT */}
            <div className="relative w-full h-[280px] md:h-[460px] flex items-center justify-center md:block">
              {/* MOBILE */}
              <div className="md:hidden relative flex gap-4 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[110px] h-[110px] rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl"
                    style={{
                      backgroundImage: `url(${IMAGES[i]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    animate={{
                      borderRadius: [
                        "60% 40% 70% 30%",
                        "50% 50% 40% 60%",
                        "70% 30% 60% 40%",
                        "60% 40% 70% 30%",
                      ],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 8 + i * 2,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  />
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden md:block relative w-full h-full">
                <motion.div
                  className="absolute overflow-hidden ring-4 ring-white/20 shadow-2xl"
                  style={{
                    width: "240px",
                    height: "240px",
                    backgroundImage: `url(${IMAGES[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  animate={{
                    borderRadius: [
                      "60% 40% 70% 30%",
                      "55% 45% 40% 60%",
                      "70% 30% 60% 40%",
                      "60% 40% 70% 30%",
                    ],
                    x: [0, 25, -10, 0],
                    y: [0, -18, 15, 0],
                  }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />

                <motion.div
                  className="absolute left-[32%] top-[22%] overflow-hidden ring-4 ring-white/20 shadow-2xl"
                  style={{
                    width: "270px",
                    height: "270px",
                    backgroundImage: `url(${IMAGES[1]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  animate={{
                    borderRadius: [
                      "45% 55% 60% 40%",
                      "55% 45% 48% 52%",
                      "65% 35% 55% 45%",
                      "45% 55% 60% 40%",
                    ],
                    x: [0, -20, 18, 0],
                    y: [0, 15, -18, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 16,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.4,
                  }}
                />

                <motion.div
                  className="absolute right-0 bottom-4 overflow-hidden ring-4 ring-white/20 shadow-2xl"
                  style={{
                    width: "220px",
                    height: "220px",
                    backgroundImage: `url(${IMAGES[2]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  animate={{
                    borderRadius: [
                      "55% 45% 50% 50%",
                      "50% 50% 60% 40%",
                      "65% 35% 45% 55%",
                      "55% 45% 50% 50%",
                    ],
                    x: [0, -15, 12, 0],
                    y: [0, -10, 20, 0],
                    scale: [1, 1.07, 1],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative z-10 -mb-px">
          <svg
            viewBox="0 0 1440 80"
            className="block w-full h-[40px] sm:h-[60px] md:h-[80px] text-[#FFF8F0]"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,40C1120,37,1280,43,1360,45.3L1440,48L1440,80L0,80Z"
            />
          </svg>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="relative z-10 -mt-10 sm:-mt-14 pb-2 md:pb-6">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 rounded-3xl border border-[#eadacb] bg-white/95 backdrop-blur-md p-4 sm:p-6 shadow-[0_20px_60px_-15px_rgba(43,27,18,0.18)]"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 sm:gap-4 rounded-2xl bg-gradient-to-br from-[#FFF7EF] to-white p-4 ring-1 ring-[#f3d6bb] hover:ring-[#BC5F36]/40 transition"
              >
                <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] group-hover:scale-105 transition">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#8B4513] leading-none tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#7a5c49] mt-1 leading-tight">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== ¿CÓMO FUNCIONA? ==================== */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-12 sm:mb-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E6] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#BC5F36] ring-1 ring-[#f3d6bb]">
              <Sparkles className="h-3 w-3" />
              Cómo funciona
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#8B4513] leading-[1.05]">
              Adoptar es más simple<br className="hidden sm:block" /> de lo que imaginas
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#7a5c49] leading-relaxed">
              Un proceso claro, transparente y guiado en cada etapa. Tú eliges,
              nosotros nos encargamos del resto.
            </p>
          </motion.div>

          {/* Timeline desktop / cards mobile */}
          <div className="relative">
            {/* Línea conectora desktop */}
            <div
              className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-transparent via-[#f3d6bb] to-transparent"
              aria-hidden="true"
            />

            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative group"
                >
                  <div className="relative h-full rounded-3xl bg-white border border-[#eadacb] p-6 sm:p-7 shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(43,27,18,0.18)] hover:-translate-y-1 transition-all duration-300">
                    {/* Numerito */}
                    <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[#BC5F36] text-white text-[11px] font-extrabold px-2.5 py-1 shadow-md">
                      {step.n}
                    </span>

                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] text-[#BC5F36] ring-1 ring-[#f3d6bb] mb-4 group-hover:scale-105 transition">
                      <step.icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#6c5241] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== POR QUÉ ADOPTAR EN CAAM ==================== */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#FFF8F0] via-[#fff4e7] to-[#FFF8F0]">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                <Heart className="h-3 w-3" />
                Por qué CAAM
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#8B4513] leading-[1.05]">
                Hacemos que la adopción se sienta segura y humana
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#6c5241] leading-relaxed">
                En el Centro de Atención Animal Morelia cada mascota recibe
                atención veterinaria, evaluación de comportamiento y mucho
                cariño antes de encontrar su familia.
              </p>

              {/* Mini checklist */}
              <ul className="mt-6 space-y-3">
                {[
                  "Mascotas rescatadas y rehabilitadas",
                  "Equipo veterinario profesional",
                  "Proceso transparente paso a paso",
                  "Seguimiento post-adopción",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#2b1b12]">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/nosotros"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B4513] text-white font-semibold text-sm hover:bg-[#A0522D] transition shadow-md"
                >
                  Conoce más sobre nosotros
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`relative rounded-3xl bg-white border border-[#eadacb] p-5 sm:p-6 shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(43,27,18,0.18)] hover:-translate-y-1 transition-all duration-300 ${
                    i % 2 === 1 ? "sm:translate-y-6" : ""
                  }`}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] text-[#BC5F36] ring-1 ring-[#f3d6bb] mb-3">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-[#2b1b12] text-base sm:text-lg leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[#6c5241] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E6] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#BC5F36] ring-1 ring-[#f3d6bb]">
              <Quote className="h-3 w-3" />
              Historias reales
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#8B4513] leading-[1.05]">
              Familias que ya viven
              <br className="hidden sm:block" /> con un nuevo amigo
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#7a5c49] leading-relaxed">
              Cada historia de adopción es única. Estas son algunas de las
              experiencias de quienes ya pasaron por el proceso.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {testimonios.map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative rounded-3xl bg-white border border-[#eadacb] p-6 sm:p-7 shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(43,27,18,0.18)] hover:-translate-y-1 transition-all duration-300"
              >
                <Quote className="absolute top-5 right-5 h-7 w-7 text-[#f3d6bb]" />

                <div className="flex items-center gap-1 mb-4 text-[#F59E0B]">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <blockquote className="text-sm sm:text-base text-[#2b1b12] leading-relaxed">
                  "{t.texto}"
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3">
                  <img
                    src={t.img}
                    alt={t.nombre}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#f3d6bb]"
                  />
                  <div>
                    <p className="text-sm font-extrabold text-[#2b1b12] leading-tight">
                      {t.nombre}
                    </p>
                    <p className="text-xs text-[#BC5F36] font-semibold mt-0.5">
                      {t.mascota}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#BC5F36] via-[#A0522D] to-[#8B4513] px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 shadow-[0_30px_60px_-20px_rgba(139,69,19,0.5)]"
          >
            {/* Glow decorativo */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#FDE68A]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-[#FFF1E6]/15 blur-3xl" />

            {/* Patrón de patitas decorativo */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
              {[...Array(10)].map((_, i) => (
                <PawPrint
                  key={i}
                  className="absolute text-white"
                  style={{
                    top: `${(i * 13) % 100}%`,
                    left: `${(i * 23) % 100}%`,
                    transform: `rotate(${i * 36}deg)`,
                    height: `${24 + (i % 3) * 8}px`,
                    width: `${24 + (i % 3) * 8}px`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/30">
                <Heart className="h-3 w-3 fill-current" />
                Cambia una vida hoy
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
                Hay un compañero esperando por ti
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#FFF8F0]/90 leading-relaxed max-w-xl">
                Adoptar transforma dos vidas: la tuya y la suya. Empieza tu
                proceso de adopción ahora, es rápido, gratuito y guiado por
                nuestro equipo.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dashboards/mascotas"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#8B4513] font-bold shadow-xl hover:bg-[#FFF8F0] hover:scale-[1.03] transition"
                >
                  Ver mascotas disponibles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2b1b12]/30 backdrop-blur text-white font-bold ring-1 ring-white/30 hover:bg-[#2b1b12]/40 transition"
                >
                  Inicia sesión
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
