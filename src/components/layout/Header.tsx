"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkBase =
    "block text-lg font-medium transition px-4 py-2 rounded-md w-full text-center";

  const isActive = (href: string) => pathname === href;

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/dashboards/mascotas", label: "Nuestras Mascotas" },
    { href: "/nosotros", label: "Nosotros" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CAAM" width={50} height={50} />
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-base text-[#FFF8F0] leading-tight">
              Centro de Atención Animal
            </span>
            <span className="font-medium text-sm text-[#FFF8F0]">
              Morelia, Michoacán
            </span>
          </div>
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden text-[#FFF8F0] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links escritorio */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${linkBase} ${
                  isActive(link.href)
                    ? "bg-[#FFF1E6] text-[#8B4513] font-semibold border-b-2 border-[#FDE68A]"
                    : "text-[#FFF8F0] hover:text-[#FDE68A]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              className="px-5 py-2 rounded-md bg-[#8B4513] text-white text-base font-semibold hover:bg-[#A0522D] transition"
            >
              Inicia Sesión
            </Link>
          </li>
        </ul>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-[#BC5F36] border-t border-[#e3bba7] shadow-inner">
          <ul className="flex flex-col items-center py-3 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href} className="w-full">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${linkBase} ${
                    isActive(link.href)
                      ? "bg-[#FFF1E6] text-[#8B4513] font-semibold"
                      : "text-[#FFF8F0] hover:text-[#FDE68A]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-md bg-[#8B4513] text-white font-semibold hover:bg-[#A0522D] transition"
              >
                Inicia Sesión
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
