"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

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
      setError("Por favor completa ambos campos.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Usar Supabase en lugar de tu API custom
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      });

      if (authError) {
        let errorMessage = 'Credenciales incorrectas';
        
        if (authError.message === 'Invalid login credentials') {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (authError.message === 'Email not confirmed') {
          errorMessage = 'Por favor verifica tu email antes de iniciar sesión';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Obtener perfil del usuario para verificar rol
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', data.user.id)
          .single();

        // Redirigir según el rol (mantener tu ruta /dashboards si prefieres)
        if (perfil?.rol === 'administrador') {
          router.push('/dashboards/administrador'); 
        } else {
          router.push('/dashboards/usuario'); 
        }
      }

    } catch (err) {
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
        <div className="text-center mb-6">
          <Image
            src="/logo.jpg"
            alt="Logo CAAM"
            width={200}
            height={200}
            className="mx-auto mb-4 h-20 w-auto"
            priority
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--brand-dark)]">
            Bienvenido
          </h1>
          <p className="text-[var(--brand-dark)]/70 mt-1">
            Inicia sesión para continuar ayudando a peluditos 🐶🐱
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
                placeholder="tucorreo@ejemplo.com"
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

            <Button type="submit" full variant="primary" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>

            <div className="text-right -mt-2">
              <ButtonLink
                href="/login/recuperar_contra"
                variant="ghost"
                className="text-[var(--brand-purple)]"
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
              className="text-[var(--brand-pink)] font-semibold"
            >
              Regístrate
            </ButtonLink>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--brand-dark)]/60 mt-4">
          Hecho con <span className="text-[var(--brand-pink)]">❤</span> por CAAM
          Morelia
        </p>
      </div>
    </div>
  );
}