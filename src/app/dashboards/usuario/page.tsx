"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import {
  PawPrint,
  ShieldCheck,
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Protected from "@/components/Protected";
import PageHead from "@/components/layout/PageHead";
import { getUserRole } from "@/lib/supabase/getRole";
import { useRouter } from "next/navigation";

/* ===========================================================
   PARALLAX MARCADO (SEGURO)
=========================================================== */
function useParallax(multiplier: number) {
  const coords = useRef({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    coords.current.x = (e.clientX - rect.left - rect.width / 2) / multiplier;
    coords.current.y = (e.clientY - rect.top - rect.height / 2) / multiplier;
  }

  return { coords, handleMouseMove };
}

export default function DashboardUsuarioPage() {
  const router = useRouter();

  // TODOS LOS HOOKS VAN ARRIBA (importante)
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const parallax = useParallax(10); // <-- SE LLAMA SIEMPRE
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserName(data?.user?.user_metadata?.nombre || "Usuario");
    });
  }, []);

  useEffect(() => {
    const verifyRole = async () => {
      const rol = await getUserRole();
      if (rol === 2) setAllowed(true);
      else router.push("/dashboards/administrador");
      setChecking(false);
    };
    verifyRole();
  }, [router]);

  return (
    <Protected>
      <div className="space-y-20">
        {/* LOADER SIN ROMPER HOOKS */}
        {checking && (
          <p className="text-center text-sm text-gray-500">Cargando...</p>
        )}

        {!checking && !allowed && null}

        {/* CONTENIDO DEL DASHBOARD */}
        {!checking && allowed && (
          <>
            {/* HERO PRINCIPAL */}
            <section
              onMouseMove={parallax.handleMouseMove}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF1E5] to-[#FFDCC0] border border-[#e8c8b0] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-10 md:p-16"
            >
              {/* BLOB PRINCIPAL ANIMADO (ESQUINA DERECHA) */}
              <motion.div
                animate={{
                  x: parallax.coords.current.x * 1.2,
                  y: parallax.coords.current.y * 1.2,
                  scale: [1, 1.08, 1],
                  opacity: [0.6, 0.75, 0.6],
                }}
                transition={{
                  x: { type: "spring", stiffness: 40, damping: 15 },
                  y: { type: "spring", stiffness: 40, damping: 15 },
                  scale: { duration: 6, repeat: Infinity },
                  opacity: { duration: 6, repeat: Infinity },
                }}
                className="absolute top-12 right-10 w-[440px] h-[440px] bg-[#d48458]/30 blur-[110px] rounded-full"
              />

              {/* BLOB SECUNDARIO SUPER SUAVE */}
              <motion.div
                animate={{
                  x: parallax.coords.current.x * -0.6,
                  y: parallax.coords.current.y * -0.6,
                  scale: [1, 1.04, 1],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                  scale: { duration: 7, repeat: Infinity },
                  opacity: { duration: 7, repeat: Infinity },
                }}
                className="absolute bottom-[-50px] left-[-60px] w-[330px] h-[330px] bg-[#3c1d14]/10 blur-[90px] rounded-full"
              />

              {/* TEXTO PRINCIPAL */}
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                {/* TEXTO IZQUIERDA */}
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-6xl font-extrabold text-[#2b1b12] leading-tight">
                    Tu adopción cambia{" "}
                    <span className="text-[#BC5F36]">toda una vida.</span>
                  </h1>
                  <p className="mt-3 text-lg font-semibold text-[#BC5F36]">
                    Bienvenido, {userName}
                  </p>

                  <p className="mt-6 text-lg text-[#6b4a3b] max-w-xl">
                    Conoce mascotas, revisa compatibilidad y completa tu proceso
                    con acompañamiento del CAAM.
                  </p>

                  {/* BOTÓN ANIMADO */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-10 cursor-pointer inline-block"
                  >
                    <Link href="/dashboards/usuario/mascotas">
                      <Button className="px-7 py-4 text-lg rounded-xl shadow hover:shadow-lg transition cursor-pointer">
                        Explorar mascotas
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* IMAGEN DERECHA ANIMADA */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative flex justify-center"
                >
                  <motion.img
                    src="https://img.freepik.com/fotos-premium/lindo-jack-russel-terrier-sobre-fondo-naranja-palido-espacio-texto_495423-46244.jpg"
                    alt="Mascota"
                    className="w-[320px] md:w-[380px] rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.18)] object-cover"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </section>

            {/* BENEFICIOS*/}

            <section className="space-y-10">
              {/* TÍTULO ARRIBA */}
              <h2 className="text-3xl font-extrabold text-[#2b1b12] text-center">
                Beneficios de adoptar con CAAM
              </h2>

              {/* FEATURES ABAJO, ANCHOS */}
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Feature
                  icon={<ShieldCheck className="text-[#BC5F36]" />}
                  title="Acompañamiento real"
                  desc="Te guiamos desde tu primera elección hasta tu seguimiento final con tu mascota."
                />
                <Feature
                  icon={<Sparkles className="text-[#BC5F36]" />}
                  title="Perfiles completos"
                  desc="Conoce energía, cuidados, compatibilidad y recomendaciones personalizadas."
                />
                <Feature
                  icon={<Heart className="text-[#BC5F36]" />}
                  title="Adopción responsable"
                  desc="Prioridad total al bienestar y adaptación saludable de tu nueva mascota."
                />
              </div>
            </section>

            {/* =======================================================
                PROCESO DE ADOPCIÓN
            ======================================================== */}
            <section className="space-y-10">
              <h2 className="text-3xl font-extrabold text-[#2b1b12] text-center">
                ¿Cómo funciona mi proceso de adopción?
              </h2>

              <div className="grid md:grid-cols-5 gap-6">
                {[
                  "Explora mascotas disponibles.",
                  "Agenda tu cita presencial y conoce a tu mascota.",
                  "Llena tu formulario final.",
                  "Adopta y realiza seguimiento.",
                  "Disfruta de tu nueva compañía.",
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-2xl p-6 bg-white/90 border border-[#eadacb] shadow hover:shadow-lg transition"
                  >
                    <CheckCircle2 className="h-8 w-8 text-[#BC5F36]" />
                    <p className="mt-3 text-sm font-semibold text-[#2b1b12]">
                      Paso {i + 1}
                    </p>
                    <p className="text-sm text-[#7a5c49]">{step}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* =======================================================
                TESTIMONIALES NUEVOS
            ======================================================== */}
            <section className="rounded-3xl p-10 bg-white/70 backdrop-blur-xl border border-[#efddca] shadow">
              <h3 className="text-2xl font-bold text-[#2b1b12] mb-6">
                Historias reales de adopción
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Testimonial
                  name="Laura & 'Toby'"
                  text="Nunca pensé que adoptar sería tan transformador. Toby llegó a llenar nuestro hogar de energía y amor."
                />
                <Testimonial
                  name="Jorge & 'Mish'"
                  text="El proceso fue claro de inicio a fin. Mish ahora es parte esencial de nuestra familia."
                />
              </div>
            </section>
          </>
        )}
      </div>
    </Protected>
  );
}

/* =======================================================
    COMPONENTES VISUALES
======================================================= */

function Feature({ icon, title, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-[#eadacb] bg-white p-6 shadow hover:shadow-xl hover:-translate-y-1 transition"
    >
      <div className="mb-2">{icon}</div>
      <p className="text-lg font-extrabold text-[#2b1b12]">{title}</p>
      <p className="text-sm text-[#7a5c49] mt-1">{desc}</p>
    </motion.div>
  );
}

function Testimonial({ name, text }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-6 shadow"
    >
      <p className="text-[#2b1b12] text-base leading-relaxed">“{text}”</p>
      <p className="mt-3 text-xs font-semibold text-[#7a5c49]">{name}</p>
    </motion.div>
  );
}
