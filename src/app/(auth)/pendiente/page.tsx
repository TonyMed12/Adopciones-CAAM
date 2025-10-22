"use client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Pendiente() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
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
        <h1 className="text-3xl font-bold text-[#9B2E45]">
          Centro de Atención Animal
        </h1>
        <h1 className="text-xl font-bold text-[#9B2E45] mb-8">
          Morelia, Michoacán{" "}
        </h1>

        <h1 className="text-3xl font-bold text-[#9B2E45] mb-8">
          Verifica tu correo
        </h1>
        <p className="text-gray-700 mb-6">
          Te enviamos un enlace a tu correo electrónico para confirmar tu
          cuenta.
          <br />
          Por favor revisa tu bandeja de entrada y spam.
        </p>
        <Button variant="primary" full onClick={() => router.push("/login")}>
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  );
}
