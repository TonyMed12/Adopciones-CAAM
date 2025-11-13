"use client";

import { motion } from "framer-motion";

export default function LandingPage() {
  const IMAGES = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&q=70&w=1000",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&q=70&w=1000",
    "https://baluka.es/cdn/shop/articles/razas-de-perros-mas-comunes.jpg?v=1695689090&width=1000",
  ];

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
        className="absolute right-10 top-20 w-[350px] h-[350px] rounded-full bg-[#D97706]/25 blur-[140px]"
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* HERO */}
      <section className="relative z-20 py-24 md:py-32">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="max-w-xl relative z-40"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
              Adopta amor
            </h1>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mt-2">
              en su forma más pura
            </h1>

            <p className="mt-6 text-lg md:text-xl text-[#FFF8F0] leading-relaxed">
              Encuentra a tu compañero de vida, animales que buscan un hogar
              lleno de amor.
            </p>

            {/* BOTONES */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <motion.a
                href="/nosotros"
                className="px-6 py-3 rounded-xl bg-white text-[#D97706] font-semibold shadow-md hover:bg-gray-100 transition cursor-pointer"
                whileHover={{ scale: 1.06 }}
              >
                ¿Quién Somos?
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

          {/* BLOBCITOS*/}
          <div className="relative w-full max-w-lg h-[320px] md:h-[420px]">
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
                delay: 0.5,
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
      </section>
    </main>
  );
}
