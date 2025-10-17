"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [openDrop, setOpenDrop] = useState(false);

  const linkBase = "text-lg font-medium transition px-4 py-2 rounded-md";

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center flex-col">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="CAAM" width={60} height={60} />
            <div className="flex flex-col items-start">
              <span className="font-bold text-xl text-[#FFF8F0]">
                Centro de Atención Animal
              </span>
              <span className="font-medium text-lg text-[#FFF8F0]">
                Morelia, Michoacán{" "}
              </span>
            </div>
          </Link>
        </div>

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
            <Link
              href="/dashboards/mascotas"
              className={`${linkBase} ${
                isActive("/dashboards/mascotas")
                  ? "bg-[#FFF1E6] text-[#8B4513] font-semibold border-b-2 border-[#FDE68A]"
                  : "text-[#FFF8F0] hover:text-[#FDE68A]"
              }`}
            >
              Nuestras Mascotas
            </Link>
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
            {/* Citas*/}
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
