"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginCAAM() {
  const router = useRouter();
  const supabase = createClient();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      //setError("Por favor completa ambos campos.");
      setError("Checa tu info papito.");

      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: correo,
          password: contrasena,
        }
      );

      if (authError) {
        let errorMessage = "Credenciales incorrectas";

        if (authError.message === "Invalid login credentials") {
          errorMessage = "Email o contraseña incorrectos";
        } else if (authError.message === "Email not confirmed") {
          errorMessage = "Por favor verifica tu email antes de iniciar sesión";
        }

        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Validar de confirmado
      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        setError(
          "Tu cuenta aún no ha sido verificada. Revisa tu bandeja de entrada."
        );
        setLoading(false);
        return;
      }

      if (data.user) {
        // obtener perfil del usuario
        console.log("Usuario logueado:", data.user.id);

        const { data: perfil, error: perfilError } = await supabase
          .from("perfiles")
          .select("rol_id")
          .eq("id", data.user.id)
          .single();

        if (perfilError) {
          console.error("Error al obtener el perfil:", perfilError);
          setError("Ocurrió un error al cargar tu perfil. Intenta nuevamente.");
          setLoading(false);
          return;
        }

        console.log("Perfil encontrado:", perfil);

        //Redirigir según el rol
        if (perfil?.rol_id === 1) {
          router.push("/dashboards/administrador");
        } else {
          router.push("/dashboards/usuario");
        }
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(91,75,182,0.08), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(240,79,147,0.08), transparent 45%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Encabezado */}
        <div className="text-center mb-6 mt-15">
          <Link href="/">
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
            ¡Bienvenido!
          </h1>

          <h1 className="mb-5 text-2xl">
            {" "}
            Centro de Atención Animal | Morelia, Michoacán{" "}
          </h1>
          <p className="text-[var(--brand-dark)]/70 mt-1">
            Para poder adoptar, es necesario iniciar sesión.
          </p>
        </div>

        {/* Tarjeta */}
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--brand-purple)]/15 p-6">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200/70 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-[var(--brand-dark)]">
                Correo electrónico
              </span>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="adopta@nocompres.mx"
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[var(--brand-dark)] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)] transition"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-[var(--brand-dark)]">
                Contraseña
              </span>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[var(--brand-dark)] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)] transition"
              />
            </label>

            <Button
              className="cursor-pointer"
              type="submit"
              full
              variant="primary"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>

            {/* Divider visual */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Botón Google */}
            {/*<Button
              disabled
              type="button"
              full
              variant="secondary"
              className="bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
              onClick={async () => {
                setLoading(true);
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  });
                  if (error) {
                    console.error("Error al iniciar con Google:", error);
                    setError(
                      "No se pudo iniciar sesión con Google. Intenta nuevamente."
                    );
                  }
                } catch (err) {
                  console.error(err);
                  setError(
                    "No se pudo iniciar sesión con Google. Intenta nuevamente."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Image
                src="/google.png"
                alt="Google logo"
                width={18}
                height={18}
                className="inline-block"
              />
              <span className="text-[var(--brand-dark)] font-medium">
                Iniciar sesión con Google
              </span>
            </Button>*/}

            <div className="text-center -mt-2">
              <ButtonLink
                href="/recuperacion"
                variant="ghost"
                className="text-[var(--brand-purple)] align-center"
              >
                ¿Olvidaste tu contraseña?
              </ButtonLink>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            ¿Aún no tienes cuenta?{" "}
            <ButtonLink
              href="/register"
              variant="secondary"
              className="text-[var(--brand-pink)] font-semibold ml-5"
            >
              Regístrate
            </ButtonLink>
          </p>
        </div>

        <p className="mb-10 text-center text-xs text-[var(--brand-dark)]/60 mt-10">
          Transformando adopciones en historias de amor
        </p>
      </div>
    </div>
  );
}
