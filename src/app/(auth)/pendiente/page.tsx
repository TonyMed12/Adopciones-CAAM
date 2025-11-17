"use client";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Pendiente() {
  const router = useRouter();
  const supabase = createClient();

  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Auto detectar verificación
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user?.email_confirmed_at) {
        router.push("/dashboards/usuario/mascotas");
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const reenviarCorreo = async () => {
    setReenviando(true);
    setReenviado(false);

    const res = await fetch("/api/email/reenviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: localStorage.getItem("registro_email"),
        nombre: localStorage.getItem("registro_nombre"),
        confirmationUrl: localStorage.getItem("registro_confirmationUrl"),
      }),
    });

    setReenviando(false);

    if (res.ok) {
      setReenviado(true);

      // Iniciar cooldown
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(91,75,182,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(240,79,147,0.08), transparent 45%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-2xl shadow-lg border border-[var(--brand-purple)]/15 p-8 w-full max-w-md text-center overflow-hidden"
      >
        {/* Shimmer */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-[#9B2E45] via-transparent to-transparent animate-[pulse_6s_ease-in-out_infinite]" />

        <Image
          src="/logo.png"
          alt="Logo CAAM"
          width={120}
          height={120}
          className="mx-auto mb-4 relative z-10"
        />

        <h1 className="text-3xl font-bold text-[#9B2E45] relative z-10">
          Centro de Atención Animal
        </h1>
        <h1 className="text-xl font-bold text-[#9B2E45] mb-8 relative z-10">
          Morelia, Michoacán
        </h1>

        <h1 className="text-3xl font-bold text-[#9B2E45] mb-8 relative z-10">
          Verifica tu correo
        </h1>

        <p className="text-gray-700 mb-6 relative z-10">
          Te enviamos un enlace a tu correo electrónico para confirmar tu
          cuenta.
          <br />
          Por favor revisa tu bandeja de entrada y también tu carpeta de spam.
          <br />
          <span className="text-[#9B2E45] font-semibold">
            El correo puede tardar hasta 2 minutos en llegar.
          </span>
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={reenviarCorreo}
          disabled={reenviando || cooldown > 0}
          className="mt-4 text-[#9B2E45] font-semibold underline disabled:opacity-40 relative z-10"
        >
          {reenviando ? (
            <span className="inline-flex items-center">
              Reenviando
              <motion.span
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="ml-1"
              >
                ...
              </motion.span>
            </span>
          ) : (
            "Reenviar correo"
          )}
        </motion.button>

        {cooldown > 0 && (
          <p className="text-sm text-gray-500 mt-2 relative z-10">
            Puedes reenviar en {cooldown}s
          </p>
        )}

        {reenviado && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-600 mt-2 relative z-10"
          >
            ✔️ Correo reenviado
          </motion.p>
        )}

        <Button
          variant="primary"
          full
          onClick={() => router.push("/login")}
          className="relative z-10 mt-4"
        >
          Volver al inicio de sesión
        </Button>
      </motion.div>
    </div>
  );
}
