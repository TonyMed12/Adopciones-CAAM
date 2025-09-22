"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [openDrop, setOpenDrop] = useState(false);

  const linkBase =
    "text-lg font-medium transition px-4 py-2 rounded-md";

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CAAM" width={40} height={40} />
          <span className="font-bold text-lg text-[#FFF8F0]">
            Centro de Atención Animal Morelia
          </span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-8">
          {/* Inicio */}
          <li>
            <Link
              href="/"
              className={`${linkBase} ${
                isActive("/")
                  ? "bg-[#FFF1E6] text-[#8B4513] font-semibold border-b-2 border-[#FDE68A]"
                  : "text-[#FFF8F0] hover:text-[#FDE68A]"
              }`}
            >
              Inicio
            </Link>
          </li>

          {/* Dropdown Adopta */}
          <li className="relative">
            <button
              aria-haspopup="menu"
              aria-expanded={openDrop}
              onClick={() => setOpenDrop((v) => !v)}
              className={`${linkBase} text-[#FFF8F0] hover:text-[#FDE68A]`}
            >
              Adopta
            </button>

            {openDrop && (
              <div
                className="absolute left-0 mt-3 w-48 rounded-md bg-[#FFF1E6] shadow-lg overflow-hidden z-50"
                role="menu"
                onMouseLeave={() => setOpenDrop(false)}
              >
                <Link
                  href="/mascotas?especie=Perro"
                  className={`block px-5 py-2 ${
                    pathname.includes("mascotas") &&
                    pathname.includes("Perro")
                      ? "bg-[#FDE68A] text-[#8B4513] font-semibold"
                      : "text-[#8B4513] hover:bg-[#FDE68A]"
                  }`}
                  onClick={() => setOpenDrop(false)}
                  role="menuitem"
                >
                  Perros
                </Link>
                <Link
                  href="/mascotas?especie=Gato"
                  className={`block px-5 py-2 ${
                    pathname.includes("mascotas") &&
                    pathname.includes("Gato")
                      ? "bg-[#FDE68A] text-[#8B4513] font-semibold"
                      : "text-[#8B4513] hover:bg-[#FDE68A]"
                  }`}
                  onClick={() => setOpenDrop(false)}
                  role="menuitem"
                >
                  Gatos
                </Link>
                <Link
                  href="/mascotas?especie=Todas"
                  className={`block px-5 py-2 ${
                    pathname.includes("mascotas") &&
                    pathname.includes("Todas")
                      ? "bg-[#FDE68A] text-[#8B4513] font-semibold"
                      : "text-[#8B4513] hover:bg-[#FDE68A]"
                  }`}
                  onClick={() => setOpenDrop(false)}
                  role="menuitem"
                >
                  Ver todas
                </Link>
              </div>
            )}
          </li>

          {/* Nosotros */}
          <li>
            <Link
              href="/nosotros"
              className={`${linkBase} ${
                isActive("/nosotros")
                  ? "bg-[#FFF1E6] text-[#8B4513] font-semibold border-b-2 border-[#FDE68A]"
                  : "text-[#FFF8F0] hover:text-[#FDE68A]"
              }`}
            >
              Nosotros
            </Link>
          </li>

          {/* CTA Login */}
          <li>
            <Link
              href="/login"
              className="px-6 py-3 rounded-md bg-[#8B4513] text-white text-lg font-semibold hover:bg-[#A0522D] transition"
            >
              Inicia Sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
