"use client";
import React from "react";
import { motion } from "framer-motion";

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

  return (
    <main className="bg-[#FFF8F0] relative overflow-hidden w-full">
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

      {/* Glow */}
      <motion.div
        className="absolute right-0 top-10 w-[200px] md:w-[350px] h-[200px] md:h-[350px] rounded-full bg-[#D97706]/25 blur-[100px] md:blur-[140px]"
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* HERO */}
      <section className="relative z-20 pt-24 md:pt-32 pb-14 md:pb-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-14 md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="
    relative z-50 
    w-full 
    md:max-w-3xl 
    text-left 
    pl-6 md:pl-14 lg:pl-20  
  "
          >
            {/* CONTENEDOR DEL TÍTULO AJUSTADO */}
            <div
              className="
    font-extrabold text-white 
    leading-[1.05] 
    text-3xl md:text-5xl lg:text-6xl xl:text-7xl
    mb-10 
    select-none
  "
            >
              {/* Línea 1 */}
              <div className="flex items-center gap-3 h-[1.25em]">
                <span className="whitespace-nowrap flex items-center">
                  Adopta
                </span>

                <span
                  className="
        inline-flex 
        items-center 
        h-[1.25em] 
        overflow-hidden 
        min-w-[150px]
      "
                >
                  <TypewriterWords />
                </span>
              </div>

              {/* Línea 2 */}
              <div className="mt-3 whitespace-nowrap h-[1.25em] flex items-center">
                en su forma
              </div>
              {/* Línea 2 */}
              <div className="mt-3 whitespace-nowrap h-[1.25em] flex items-center">
                más pura
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <p className="mt-2 text-lg md:text-xl text-[#FFF8F0] leading-relaxed max-w-lg">
              Encuentra a tu compañero de vida, animales que buscan un hogar
              lleno de amor.
            </p>

            {/* BOTONES */}
            <div className="mt-10 flex gap-4 flex-wrap">
              <motion.a
                href="/nosotros"
                className="px-6 py-3 rounded-xl bg-white text-[#D97706] font-semibold shadow-md hover:bg-gray-100 transition cursor-pointer"
                whileHover={{ scale: 1.06 }}
              >
                ¿Quiénes Somos?
              </motion.a>

              <motion.a
                href="/login"
                className="px-6 py-3 rounded-xl bg-[#8B4513] text-white font-semibold shadow-md hover:bg-[#A0522D] transition cursor-pointer"
                whileHover={{ scale: 1.06 }}
              >
                Inicia Sesión
              </motion.a>
            </div>
          </motion.div>

          {/* BLOBS - RESPONSIVE + FIXED LAYOUT */}
          <div className="relative w-full h-[260px] md:h-[420px] flex items-center justify-center md:block">
            {/* MOBILE VERSION (STACKED BLOBS) */}
            <div className="md:hidden relative flex gap-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[120px] h-[120px] rounded-full overflow-hidden"
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

            {/* DESKTOP VERSION */}
            <div className="hidden md:block relative w-full h-full">
              {/* Blob 1 */}
              <motion.div
                className="absolute overflow-hidden"
                style={{
                  width: "230px",
                  height: "230px",
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

              {/* Blob 2 */}
              <motion.div
                className="absolute left-[32%] top-[20%] overflow-hidden"
                style={{
                  width: "260px",
                  height: "260px",
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

              {/* Blob 3 */}
              <motion.div
                className="absolute right-0 bottom-4 overflow-hidden"
                style={{
                  width: "210px",
                  height: "210px",
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
      </section>
    </main>
  );
}
