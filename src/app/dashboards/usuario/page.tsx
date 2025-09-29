"use client";

import React from "react";
import Link from "next/link";
import { PawPrint, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHead from "@/components/layout/PageHead";

export default function DashboardUsuarioPage() {
  return (
    <div className="space-y-8">
      <PageHead title="Bienvenido" subtitle="Encuentra a tu nuevo mejor amigo 🐾" />

      {/* Banner motivacional */}
      <section className="relative overflow-hidden rounded-2xl border border-[#eadacb] bg-[#fff4e7] p-6 shadow-[0_18px_60px_rgba(43,27,18,.18)]">
        <div className="grid items-center gap-6 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#2b1b12]">
              Adopta y cambia <span className="text-[#BC5F36]">dos vidas</span>
            </h2>
            <p className="mt-3 text-[#7a5c49]">
              Hay lomitos y michis esperando un hogar. Tú les das una oportunidad y ellos te dan compañía y amor.
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              <li className="flex items-center gap-2 text-[#2b1b12]">
                <ShieldCheck className="h-5 w-5 text-[#BC5F36]" />
                <span className="text-sm font-semibold">Esterilizados y vacunados</span>
              </li>
              <li className="flex items-center gap-2 text-[#2b1b12]">
                <Sparkles className="h-5 w-5 text-[#BC5F36]" />
                <span className="text-sm font-semibold">Proceso claro y acompañado</span>
              </li>
              <li className="flex items-center gap-2 text-[#2b1b12]">
                <Heart className="h-5 w-5 text-[#BC5F36]" />
                <span className="text-sm font-semibold">Impacto real en tu comunidad</span>
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

          {/* Tarjetitas testimonio/contador (decorativo) */}
          <div className="relative hidden md:block">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-2xl bg-[#BC5F36]/10 blur-2xl" />
            <div className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-[0_12px_30px_rgba(43,27,18,.15)]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#BC5F36]/15">
                  <PawPrint className="h-5 w-5 text-[#BC5F36]" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[#2b1b12]">+120 adopciones</p>
                  <p className="text-xs text-[#7a5c49]">en los últimos meses</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Quote nombre="María & ‘Canelo’" texto="Llenó la casa de alegría. Adoptar fue la mejor decisión." />
                <Quote nombre="Luis & ‘Michi’" texto="Proceso rápido, ahora somos inseparables." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 beneficios cortos */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Feature title="Acompañamiento" desc="Te guiamos desde la elección hasta la adaptación." />
        <Feature title="Perfiles claros" desc="Conoce carácter, energía y cuidados." />
        <Feature title="Responsabilidad" desc="Seguimiento para el bienestar de la mascota." />
      </section>
    </div>
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
