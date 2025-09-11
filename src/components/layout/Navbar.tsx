// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

const nav = [
  {
    href: "/adopciones",
    label: "Adopta",
    children: [
      { href: "/adopciones/perros", label: "Perros" },
      { href: "/adopciones/gatos", label: "Gatos" },
    ],
  },
  { href: "/contacto", label: "Contacto" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);

  // Mejor tipo para setTimeout (evita conflicto Node/DOM)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropRef = useRef<HTMLLIElement | null>(null);

  function scheduleClose(delay = 120) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDrop(false), delay);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  // Cierra menús al navegar
  useEffect(() => {
    setOpenMenu(false);
    setOpenDrop(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href !== "/" && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="CAAM" width={28} height={28} />
          <span className="font-semibold text-[var(--brand-purple)]">
            Adopciones CAAM
          </span>
        </Link>

        {/* Hamburguesa (móvil) */}
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100"
          onClick={() => setOpenMenu((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={openMenu}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Links (desktop) */}
        <ul className="hidden md:flex items-center gap-6">
          {/* Adopta con dropdown mejorado */}
          <li
            ref={dropRef}
            className="relative"
            onMouseEnter={() => { cancelClose(); setOpenDrop(true); }}
            onMouseLeave={() => scheduleClose()}
            onBlur={(e) => {
              // si el foco se va fuera del li, cierra
              if (!dropRef.current?.contains(e.relatedTarget as Node)) scheduleClose();
            }}
          >
            <button
              className={`relative text-sm font-medium transition-colors hover:text-[var(--brand-purple)] ${
                isActive("/adopciones") ? "text-[var(--brand-purple)]" : "text-gray-700"
              }`}
              aria-haspopup="menu"
              aria-expanded={openDrop}
              onClick={() => setOpenDrop((v) => !v)} // touch/click
            >
              Adopta
            </button>

            {/* Zona puente para que no se cierre al bajar el cursor */}
            {openDrop && (
              <div className="absolute left-0 top-full h-3 w-44" aria-hidden />
            )}

            {openDrop && (
              <div
                role="menu"
                className="absolute left-0 mt-3 w-64 rounded-2xl border bg-white/95 p-2 shadow-xl ring-1 ring-purple-100 animate-fade-slide"
                onMouseEnter={cancelClose}
                onMouseLeave={() => scheduleClose()}
              >
                {/* Flecha */}
                <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 border-l border-t bg-white/95" />
                {/* PERROS */}
                <Link
                role="menuitem"
                href="/adopciones/perros"
                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--brand-purple)]/10"
                >
                <Image
                    src="/dog.png"           // <--- en /public
                    alt="Perros"
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                />
                <div>
                    <div className="font-medium text-gray-800 group-hover:text-[var(--brand-purple)]">
                    Perros
                    </div>
                    <div className="text-xs text-gray-500">Encuentra tu mejor amigo</div>
                </div>
                </Link>

                {/* GATOS */}
                <Link
                role="menuitem"
                href="/adopciones/gatos"
                className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--brand-purple)]/10"
                >
                <Image
                    src="/cat.png"           // <--- en /public
                    alt="Gatos"
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                />
                <div>
                    <div className="font-medium text-gray-800 group-hover:text-[var(--brand-purple)]">
                    Gatos
                    </div>
                    <div className="text-xs text-gray-500">Dale hogar a un michi</div>
                </div>
                </Link>
                
                <div className="my-2 border-t" />

                <Link
                  href="/adopciones"
                  className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-[var(--brand-purple)] hover:bg-[var(--brand-purple)] hover:text-white transition-colors"
                >
                  Ver todas las mascotas
                </Link>
              </div>
            )}
          </li>

          {nav.slice(1).map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--brand-purple)] ${
                  isActive(i.href) ? "text-[var(--brand-purple)]" : "text-gray-700"
                }`}
              >
                {i.label}
              </Link>
            </li>
          ))}

          {/* CTA */}
          <li>
            <ButtonLink href="/ayuda" variant="primary">
              Ayúdalos
            </ButtonLink>
          </li>
        </ul>
      </nav>

      {/* Menú móvil */}
      {openMenu && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-3">
            <details className="group">
              <summary className="cursor-pointer list-none py-2 text-sm font-medium text-gray-700">
                Adopta
              </summary>
              <div className="ml-3 space-y-1 pb-2">
                <Link href="/adopciones/perros" className="block rounded-md px-2 py-1 text-sm hover:bg-gray-50">Perros</Link>
                <Link href="/adopciones/gatos"  className="block rounded-md px-2 py-1 text-sm hover:bg-gray-50">Gatos</Link>
              </div>
            </details>

            {nav.slice(1).map((i) => (
              <Link key={i.href} href={i.href} className="block py-2 text-sm text-gray-700 hover:text-[var(--brand-purple)]">
                {i.label}
              </Link>
            ))}

            <div className="pt-2">
              <ButtonLink href="/ayuda" variant="primary" full>
                Ayúdalos
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
