"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={met ? "text-green-600" : "text-red-500"}>
        {met ? "✔" : "✘"}
      </span>
      <span className={met ? "text-green-600" : "text-red-500"}>{text}</span>
    </div>
  );
}

export default function NuevaContrasenaPage() {
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  const router = useRouter();

  // 🟢 1. Capturar el token del hash y crear sesión
  useEffect(() => {
    const supabase = createClient();
    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }
    }
  }, []);

  // 🟢 2. Validar requisitos al escribir contraseña
  useEffect(() => {
    const reqs = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };

    setPasswordRequirements(reqs);
  }, [password]);

  // 🟢 3. Enviar y cambiar contraseña
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (
      !passwordRequirements.minLength ||
      !passwordRequirements.hasUpperCase ||
      !passwordRequirements.hasLowerCase ||
      !passwordRequirements.hasNumber
    ) {
      setError("La contraseña no cumple con los requisitos.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError("Error al cambiar la contraseña: " + error.message);
    } else {
      setMensaje(
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
      );
      setPassword("");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div
      className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(91,75,182,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(240,79,147,0.08), transparent 45%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6 mt-10">
          <Link href="/(marketing)">
            <Image
              src="/logo.png"
              alt="Logo CAAM"
              width={900}
              height={900}
              className="mx-auto mb-4 h-20 w-auto"
              priority
            />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--brand-dark)]">
            Restablecer contraseña
          </h1>
          <p className="text-[var(--brand-dark)]/70 mt-2 text-sm">
            Ingresa una nueva contraseña para recuperar el acceso a tu cuenta.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[var(--brand-purple)]/15 p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200/70 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="mb-4 rounded-lg border border-green-200/70 bg-green-50 px-3 py-2 text-sm text-green-700">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-medium text-[var(--brand-dark)]">
                Nueva contraseña
              </span>
              <input
                type="password"
                value={password}
                onFocus={() => setShowRequirements(true)}
                onBlur={() => password === "" && setShowRequirements(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5"
                required
              />
            </label>

            {showRequirements && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md space-y-2 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Requisitos de la contraseña:
                </p>

                <RequirementItem
                  met={passwordRequirements.minLength}
                  text="Mínimo 8 caracteres"
                />
                <RequirementItem
                  met={passwordRequirements.hasUpperCase}
                  text="Al menos una letra mayúscula"
                />
                <RequirementItem
                  met={passwordRequirements.hasLowerCase}
                  text="Al menos una letra minúscula"
                />
                <RequirementItem
                  met={passwordRequirements.hasNumber}
                  text="Al menos un número"
                />
              </div>
            )}

            <Button
              type="submit"
              full
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? "Actualizando..." : "Guardar nueva contraseña"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-[var(--brand-purple)] hover:text-[var(--brand-pink)] text-sm font-medium"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="mb-10 text-center text-xs text-[var(--brand-dark)]/60 mt-10">
          Transformando adopciones en historias de amor
        </p>
      </div>
    </div>
  );
}
