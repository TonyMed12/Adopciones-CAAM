"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  PawPrint,
  ShieldCheck,
  Heart,
  Target,
  Eye,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import Header from "@/components/layout/Header";

const milestones = [
  {
    year: "2015",
    title: "Inicio de operaciones",
    desc: "Comenzamos atendiendo animales en situación vulnerable en Morelia.",
    img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&q=70&w=1200",
  },
  {
    year: "2018",
    title: "Nuevas campañas",
    desc: "Programas de esterilización masiva y educación ciudadana.",
    img: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&q=70&w=1200",
  },
  {
    year: "2022",
    title: "Más de 100 adopciones",
    desc: "Miles de mascotas encontraron un nuevo hogar.",
    img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&q=70&w=1200",
  },
  {
    year: "2025",
    title: "Plataforma digital",
    desc: "Modernización del proceso y adopciones en línea.",
    img: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&q=70&w=1200",
  },
];

const valores = [
  {
    title: "Salud Pública",
    text: "Servicios médicos veterinarios, campañas de vacunación y esterilización para toda la comunidad.",
    icon: Stethoscope,
    tone: "from-sky-500 to-sky-400",
  },
  {
    title: "Bienestar Animal",
    text: "Promovemos el trato digno y responsable hacia cada uno de los animales.",
    icon: PawPrint,
    tone: "from-[#BC5F36] to-[#D97706]",
  },
  {
    title: "Seguridad Ciudadana",
    text: "Resguardamos animales en riesgo y atendemos reportes ciudadanos.",
    icon: ShieldCheck,
    tone: "from-emerald-500 to-emerald-400",
  },
];

export default function SobreNosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-[#2b1b12]">
      <Header />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 px-6">
          {/* Glow decorativo */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute -top-20 -left-32 w-[36rem] h-[36rem] rounded-full bg-orange-200/40 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[36rem] h-[36rem] rounded-full bg-amber-200/30 blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#BC5F36] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ring-[#f3d6bb]"
            >
              <Sparkles size={14} />
              Sobre nosotros
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]"
            >
              Por un Morelia donde{" "}
              <span className="text-[#BC5F36]">cada animal</span>
              <br className="hidden sm:block" /> tenga un hogar digno.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto text-[#6c5241]"
            >
              En el{" "}
              <strong className="text-[#8B4513]">
                Centro de Atención Animal de Morelia (CAAM)
              </strong>{" "}
              trabajamos con pasión y compromiso por la salud pública, el
              bienestar animal y la seguridad ciudadana.
            </motion.p>
          </div>

          {/* ============ VALORES ============ */}
          <div className="max-w-6xl mx-auto mt-12 sm:mt-16 grid sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {valores.map((item, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white border border-[#eadacb] p-6 sm:p-7 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div
                  className={`grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-md mb-4`}
                >
                  <item.icon size={22} />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6c5241] leading-relaxed">
                  {item.text}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ============ MISIÓN Y VISIÓN ============ */}
        <section className="px-6 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-gradient-to-br from-[#BC5F36] to-[#8B4513] text-[#FFF8F0] p-7 sm:p-9 shadow-xl relative overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
              <div className="relative">
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm text-white mb-4">
                  <Target size={22} />
                </div>
                <h3 className="text-xs uppercase tracking-widest font-bold opacity-80">
                  Nuestra
                </h3>
                <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Misión
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#FFF8F0]/90">
                  Promover la adopción responsable y contribuir a una ciudad
                  consciente donde{" "}
                  <strong className="text-white">
                    el amor por los animales
                  </strong>{" "}
                  sea parte fundamental de cada hogar y comunidad.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-3xl bg-white border border-[#eadacb] p-7 sm:p-9 shadow-sm relative overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full bg-orange-100/40 blur-3xl" />
              <div className="relative">
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-[#FFF1E6] text-[#BC5F36] mb-4 ring-1 ring-[#f3d6bb]">
                  <Eye size={22} />
                </div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#BC5F36]">
                  Nuestra
                </h3>
                <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2b1b12]">
                  Visión
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#6c5241]">
                  Convertir a Morelia en un referente nacional en{" "}
                  <strong className="text-[#8B4513]">
                    bienestar animal
                  </strong>{" "}
                  mediante educación, prevención y participación comunitaria
                  activa.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ HISTORIA / CARRUSEL ============ */}
        <section className="relative py-16 sm:py-24 overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-10 w-64 h-64 bg-orange-200/40 blur-[100px] rounded-full" />
            <div className="absolute right-0 bottom-10 w-72 h-72 bg-orange-300/30 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] text-[#BC5F36] px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb]">
                <Heart size={12} fill="currentColor" />
                Nuestro recorrido
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2b1b12]">
                Una década transformando vidas
              </h2>
              <p className="mt-3 text-base text-[#6c5241] max-w-2xl mx-auto leading-relaxed">
                Desde nuestros inicios hasta hoy, cada paso nos ha acercado a un
                Morelia más empático con los animales.
              </p>
            </motion.div>

            <div className="relative overflow-hidden pb-6">
              <motion.div
                className="flex gap-6 sm:gap-8"
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                  duration: 22,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {[...Array(2)].flatMap((_, dup) =>
                  milestones.map((ev, i) => (
                    <motion.article
                      key={`${dup}-${i}`}
                      whileHover={{ y: -4 }}
                      className="min-w-[290px] sm:min-w-[340px] rounded-3xl overflow-hidden bg-white border border-[#eadacb] shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <motion.img
                          src={ev.img}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2b1b12]/40 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm text-[#BC5F36] px-2.5 py-1 text-xs font-extrabold shadow-sm">
                          {ev.year}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-extrabold text-[#2b1b12] tracking-tight">
                          {ev.title}
                        </h4>
                        <p className="text-sm text-[#6c5241] mt-1.5 leading-relaxed">
                          {ev.desc}
                        </p>
                      </div>
                    </motion.article>
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ UBICACIÓN ============ */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-16 w-[250px] h-[250px] bg-orange-200/40 blur-[120px] rounded-full" />
            <div className="absolute -right-32 bottom-16 w-[260px] h-[260px] bg-orange-300/40 blur-[130px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#BC5F36] px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb] shadow-sm"
            >
              <MapPin size={14} />
              Visítanos
            </motion.div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2b1b12]">
              Estamos en Morelia, Michoacán
            </h2>

            <p className="mt-3 text-base text-[#6c5241] max-w-xl mx-auto leading-relaxed">
              Nuestra ubicación nos permite responder rápidamente a animales en
              situación vulnerable y coordinar esfuerzos de bienestar animal.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="rounded-2xl bg-white border border-[#eadacb] p-5 text-left shadow-sm">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] mb-3">
                  <MapPin size={18} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a78d7b] mb-1">
                  Dirección
                </p>
                <p className="text-sm font-bold text-[#2b1b12] leading-relaxed">
                  Álamos No. 395, Col. Centenario, C.P. 58128, Morelia, Mich.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-[#eadacb] p-5 text-left shadow-sm">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] mb-3">
                  <Phone size={18} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a78d7b] mb-1">
                  Teléfonos
                </p>
                <p className="text-sm font-bold text-[#2b1b12] leading-relaxed">
                  443 321 4731
                  <br />
                  443 321 1392
                </p>
              </div>
            </div>

            {/* Ping animado */}
            <div className="relative flex justify-center mt-10">
              <div className="absolute w-14 h-14 bg-orange-500/20 rounded-full blur-md animate-ping-smooth" />
              <div className="relative z-10 grid place-items-center w-14 h-14 bg-white/95 backdrop-blur rounded-full shadow-lg ring-1 ring-[#f3d6bb]">
                <MapPin size={26} className="text-[#BC5F36]" />
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          @keyframes pingSmooth {
            0% {
              transform: scale(0.9);
              opacity: 0.32;
            }
            50% {
              transform: scale(1.35);
              opacity: 0.12;
            }
            100% {
              transform: scale(1.6);
              opacity: 0;
            }
          }
          .animate-ping-smooth {
            animation: pingSmooth 2.6s ease-out infinite;
          }
        `}</style>
      </main>

      <footer className="border-t border-[#e3c8b4] bg-[#BC5F36] text-[#fffaf4]">
        <div className="container mx-auto px-4 py-6 text-sm text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">
            Centro de Atención Animal Morelia
          </span>
          . Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
