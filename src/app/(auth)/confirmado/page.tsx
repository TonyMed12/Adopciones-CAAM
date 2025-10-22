"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Confirmado() {
  const router = useRouter();
  const supabase = createClient();

  // Opcional: verificar si el token de confirmación sigue activo o solo mostrar mensaje
  useEffect(() => {
    // podrías verificar sesión si quieres
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(91,75,182,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(240,79,147,0.08), transparent 45%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-[var(--brand-purple)]/15 p-8 w-full max-w-md text-center">
        <Image
          src="/logo.png"
          alt="Logo CAAM"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-[#9B2E45] mb-2">
          ¡Cuenta verificada!
        </h1>
        <p className="text-gray-700 mb-6">
          Tu correo ha sido confirmado correctamente. Ya puedes iniciar sesión y
          disfrutar del sistema.
        </p>
        <Button
          className="cursor-pointer"
          variant="primary"
          full
          onClick={() => router.push("/login")}
        >
          Ir al inicio de sesión
        </Button>
      </div>
      <p className="text-center text-xs text-[var(--brand-dark)]/60 mt-4">
        Hecho con <span className="text-[var(--brand-pink)]">❤</span> por CAAM
        Morelia
      </p>
    </div>
  );
}
