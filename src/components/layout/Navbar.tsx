"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
  const [openDrop, setOpenDrop] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="CAAM" width={40} height={40} />
          <span className="font-bold text-lg text-[#FFF8F0]">
            Centro de Atención Animal Morelia
          </span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-8">
          {/* Dropdown Adopta */}
          <li className="relative">
            <button
              onClick={() => setOpenDrop(!openDrop)}
              className="text-lg font-medium text-[#FFF8F0] hover:text-[#FDE68A] transition"
            >
              Adopta
            </button>

            {openDrop && (
              <div className="absolute left-0 mt-3 w-44 rounded-md bg-[#FFF1E6] shadow-lg">
                <Link
                  href="/adopciones/perros"
                  className="block px-5 py-2 text-[#8B4513] hover:bg-[#FDE68A]"
                >
                  Perros
                </Link>
                <Link
                  href="/adopciones/gatos"
                  className="block px-5 py-2 text-[#8B4513] hover:bg-[#FDE68A]"
                >
                  Gatos
                </Link>
                <Link
                  href="/adopciones"
                  className="block px-5 py-2 font-semibold text-[#8B4513] hover:bg-[#FDE68A]"
                >
                  Ver todas
                </Link>
              </div>
            )}
          </li>

          {nav.slice(1).map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className="text-lg font-medium text-[#FFF8F0] hover:text-[#FDE68A] transition"
              >
                {i.label}
              </Link>
            </li>
          ))}

          {/* CTA */}
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
