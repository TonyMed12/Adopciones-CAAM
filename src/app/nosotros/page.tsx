"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Navbar */}
      <Header />

      <main className="flex-1">
        {/* ================================================
          ENCABEZADO PRINCIPAL ANIMADO + ICONS + ILUSTRACIÓN
        ================================================= */}
        <section className="pt-20 px-6  text-gray-800">
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Título animado */}
            <motion.h2
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl font-extrabold mb-6 text-orange-600"
            >
              Sobre Nosotros
            </motion.h2>

            {/* Párrafo principal */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 text-lg leading-relaxed max-w-3xl mx-auto relative z-10"
            >
              En el <strong>Centro de Atención Animal de Morelia (CAAM)</strong>{" "}
              trabajamos con pasión y compromiso por la salud pública, el
              bienestar animal y la seguridad ciudadana. Nuestro equipo busca
              que cada perro y gato reciba atención digna, cariño y la
              oportunidad de encontrar un hogar responsable.
            </motion.p>

            {/* TARJETAS PRINCIPALES */}
            <div className="grid md:grid-cols-3 gap-8 my-10">
              {[
                {
                  title: "Salud Pública",
                  text: "Servicios médicos veterinarios, campañas de vacunación y esterilización.",
                  icon: "🩺",
                },
                {
                  title: "Bienestar Animal",
                  text: "Promovemos el trato digno y responsable hacia los animales.",
                  icon: "🐾",
                },
                {
                  title: "Seguridad Ciudadana",
                  text: "Resguardamos animales en riesgo y atendemos reportes ciudadanos.",
                  icon: "🛡️",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  }}
                  className="p-6 bg-white shadow rounded-2xl cursor-default transition-all"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-4xl mb-3"
                  >
                    {item.icon}
                  </motion.div>

                  <h3 className="text-xl font-semibold mb-2 text-orange-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* MISIÓN Y VISIÓN */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-orange-100 p-8 rounded-2xl shadow-inner mb-16"
            >
              <motion.h3
                className="text-2xl font-bold mb-3 text-orange-600 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Nuestra Misión
              </motion.h3>

              <p className="mb-6 text-gray-700">
                Promover la adopción responsable y contribuir a una ciudad
                consciente donde <strong>el amor por los animales</strong> sea
                parte fundamental.
              </p>

              <motion.h3
                className="text-2xl font-bold mb-3 text-orange-600 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Nuestra Visión
              </motion.h3>

              <p className="text-gray-700">
                Convertir a Morelia en un referente nacional en{" "}
                <strong>bienestar animal</strong>
                mediante educación y participación comunitaria.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ================================================
            NUESTRA HISTORIA — CARRUSEL AUTOPLAY INFINITO
        ================================================= */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute left-0 top-10 w-64 h-64 bg-orange-200/40 blur-[100px] rounded-full"></div>
          <div className="absolute right-0 bottom-10 w-72 h-72 bg-orange-300/30 blur-[120px] rounded-full"></div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold text-orange-600 text-center mb-14"
            >
              Nuestra Historia
            </motion.h3>

            <div className="relative overflow-hidden pb-6">
              <motion.div
                className="flex gap-10"
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                  duration: 18,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {[...Array(2)].flatMap(() =>
                  [
                    {
                      year: "2015",
                      title: "Inicio de operaciones",
                      desc: "Comenzamos atendiendo animales en situación vulnerable.",
                      img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&q=70&w=1200",
                    },
                    {
                      year: "2018",
                      title: "Nuevas campañas",
                      desc: "Programas de esterilización masiva y educación.",
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
                      desc: "Modernización y adopciones en línea.",
                      img: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&q=70&w=1200",
                    },
                  ].map((ev, i) => (
                    <div key={i} className="min-w-[330px] sm:min-w-[360px]">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <motion.img
                            src={ev.img}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/25 to-transparent"></div>
                        </div>

                        <div className="p-6">
                          <p className="text-orange-600 font-bold">{ev.year}</p>
                          <h4 className="text-xl font-semibold mt-1">
                            {ev.title}
                          </h4>
                          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                            {ev.desc}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================
            UBICACIÓN — PING
        ================================================= */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute -left-32 top-16 w-[250px] h-[250px] bg-orange-200/40 blur-[120px] rounded-full"></div>
          <div className="absolute -right-32 bottom-16 w-[260px] h-[260px] bg-orange-300/40 blur-[130px] rounded-full"></div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-extrabold text-orange-600 mb-4">
              Estamos en Morelia, Michoacán
            </h3>

            <p className="text-gray-700 max-w-xl mx-auto mb-4">
              Nuestra ubicación nos permite responder rápidamente a animales en
              situación vulnerable y coordinar esfuerzos de bienestar animal.
            </p>

            <p className="text-gray-600 mb-1">
              Álamos No. 395, Col. Centenario, C.P. 58128, Morelia, Mich.
            </p>

            <p className="text-gray-600 font-medium mb-12">
              443 321 4731 / 443 321 1392
            </p>

            <div className="relative flex justify-center mt-6">
              <div className="absolute w-10 h-10 bg-orange-500/20 rounded-full blur-md animate-ping-smooth"></div>

              <div className="relative pb-15 z-10 flex items-center justify-center w-12 h-12 bg-white/95 backdrop-blur rounded-full shadow-lg">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
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

      <footer className="border-t border-[#e3c8b4] bg-[#BC5F36] text-[#fffaf4] shadow-inner">
        <div className="container mx-auto px-4 py-6 text-sm text-center">
          © 2025{" "}
          <span className="font-semibold">
            Centro de Atención Animal Morelia
          </span>
          . Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
