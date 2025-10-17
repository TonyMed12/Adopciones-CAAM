"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PawPrint, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHead from "@/components/layout/PageHead";
import Protected from "@/app/(auth)/Protected";
import { getUserRole } from "@/lib/supabase/getRole";
import { useRouter } from "next/navigation";

export default function DashboardUsuarioPage() {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyRole = async () => {
      const rol = await getUserRole();

      if (rol === 2) {
        // usuario normal
        setAllowed(true);
      } else {
        // si es admin o no hay rol válido → redirige
        router.push("/dashboards/administrador");
      }

      setChecking(false);
    };

    verifyRole();
  }, [router]);

  // Mientras se verifica el rol o sesión
  if (checking) return <p>Cargando...</p>;
  if (!allowed) return null;

  return (
    <Protected>
      <div className="space-y-8">
        <PageHead
          title="Bienvenido"
          subtitle="Encuentra a tu nuevo mejor amigo 🐾"
        />

        {/* Banner motivacional */}
        <section className="relative overflow-hidden rounded-2xl border border-[#eadacb] bg-[#fff4e7] p-6 shadow-[0_18px_60px_rgba(43,27,18,.18)]">
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr_.8fr]">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2b1b12]">
                Adopta y cambia{" "}
                <span className="text-[#BC5F36]">dos vidas</span>
              </h2>
              <p className="mt-3 text-[#7a5c49]">
                Hay perros y gatos esperando un hogar. Tú les das una
                oportunidad y ellos te dan compañía y amor.
              </p>

              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                <li className="flex items-center gap-2 text-[#2b1b12]">
                  <ShieldCheck className="h-5 w-5 text-[#BC5F36]" />
                  <span className="text-sm font-semibold">
                    Esterilizados y vacunados
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[#2b1b12]">
                  <Sparkles className="h-5 w-5 text-[#BC5F36]" />
                  <span className="text-sm font-semibold">
                    Proceso claro y acompañado
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[#2b1b12]">
                  <Heart className="h-5 w-5 text-[#BC5F36]" />
                  <span className="text-sm font-semibold">
                    Impacto real en tu comunidad
                  </span>
                </li>
              </ul>

              <div className="mt-6">
                <Link href="/dashboards/usuario/mascotas">
                  <Button className="px-5 py-3">
                    <PawPrint className="h-5 w-5" />
                    Ver mascotas
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tarjetas decorativas */}
            <div className="relative hidden md:block">
              <div className="absolute -right-6 -top-6 h-40 w-40 rounded-2xl bg-[#BC5F36]/10 blur-2xl" />
              <div className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-[0_12px_30px_rgba(43,27,18,.15)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#BC5F36]/15">
                    <PawPrint className="h-5 w-5 text-[#BC5F36]" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-[#2b1b12]">
                      +1 pero -2 adopciones
                    </p>
                    <p className="text-xs text-[#7a5c49]">en los 50 años</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Quote
                    nombre="María & ‘Canelo Álvarez’"
                    texto="Llenó la casa de pelos. Ya me tiene hasta la madre. Pero sencillo de adoptar"
                  />
                  <Quote
                    nombre="Enrique & Cesar - Un matrimonio feliz"
                    texto="Proceso rápido, ahora vivimos felices en Apatzingán."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios cortos */}
        <section className="grid gap-3 sm:grid-cols-3">
          <Feature
            title="Acompañamiento"
            desc="Te guiamos desde la elección hasta la adaptación."
          />
          <Feature
            title="Perfiles claros"
            desc="Conoce carácter, energía y cuidados antes de adoptar."
          />
          <Feature
            title="Responsabilidad"
            desc="Seguimiento para garantizar el bienestar de la mascota."
          />
        </section>
      </div>
    </Protected>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[#eadacb] bg-white p-4 text-[#2b1b12] shadow-[0_6px_14px_rgba(43,27,18,.08)]">
      <p className="text-sm font-extrabold">{title}</p>
      <p className="mt-1 text-sm text-[#7a5c49]">{desc}</p>
    </div>
  );
}

function Quote({ nombre, texto }: { nombre: string; texto: string }) {
  return (
    <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-3">
      <p className="text-sm text-[#2b1b12]">“{texto}”</p>
      <p className="mt-1 text-xs font-semibold text-[#7a5c49]">{nombre}</p>
    </div>
  );
}
