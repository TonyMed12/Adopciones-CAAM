"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, ButtonLink } from "@/components/ui/Button"; 

export default function RecuperarContrasena() { 
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess("Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.");
    }, 1000);
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
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-dark)]">
            Recuperar contraseña
          </h1>
          <p className="text-[var(--brand-dark)]/70 mt-1 text-sm">
            Ingresa tu correo y te enviaremos instrucciones para restablecerla
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

          {success && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-green-200/70 bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              {success}
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

            <Button type="submit" full variant="primary">
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <ButtonLink
              href="/login"
              variant="ghost"
              className="text-[var(--brand-purple)]"
            >
              Volver al inicio de sesión
            </ButtonLink>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--brand-dark)]/60 mt-4">
          Hecho con <span className="text-[var(--brand-pink)]">❤</span> por CAAM
          Morelia
        </p>
      </div>
    </div>
  );
}
