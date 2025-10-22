"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  FileText,
  Menu,
  X,
  LogOutIcon,
} from "lucide-react";

const adminNav = [
  { href: "/dashboards/administrador", label: "Inicio", icon: LayoutDashboard },
  {
    href: "/dashboards/administrador/mascotas",
    label: "Mascotas",
    icon: CalendarClock,
  },
  {
    href: "/dashboards/administrador/usuarios",
    label: "Usuarios",
    icon: Users,
  },
  //{ href: "/dashboards/administrador/reportes", label: "Reportes", icon: FileText },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/dashboards/administrador"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    await supabase.auth.signOut(); // borra token y adios
    router.push("/"); // al inicio
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link
          href="/dashboards/administrador"
          className="flex items-center gap-3"
        >
          <Image src="/logo.png" alt="CAAM" width={40} height={40} />
          <span className="font-bold text-lg text-[#FFF8F0]">
            Centro de Atención Animal Morelia
          </span>
        </Link>

        <button
          className="lg:hidden text-[#FFF8F0] p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul className="hidden lg:flex items-center gap-8">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "group flex items-center gap-2 rounded-md px-4 py-2 transition text-lg font-medium",
                    active
                      ? "bg-[#FFF1E6] text-[#8B4513] font-semibold border-b-2 border-[#FDE68A]"
                      : "text-[#FFF8F0] hover:text-[#FDE68A]",
                  ].join(" ")}
                >
                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-[#8B4513]"
                        : "text-[#FFF8F0] group-hover:text-[#FDE68A]"
                    }
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
          {/* Pinche boton de logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#FFF8F0] cursor-pointer hover:text-[#FDE68A] transition text-lg font-medium"
            >
              <LogOutIcon size={18} />
              <span>Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-white/20 bg-[#BC5F36]">
          <div className="container mx-auto px-6 py-3">
            <ul className="flex flex-col gap-1">
              {adminNav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center gap-3 rounded-md px-3 py-2 transition text-base",
                        active
                          ? "bg-[#FFF1E6] text-[#8B4513] font-medium"
                          : "text-[#FFF8F0] hover:text-[#FDE68A]",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-[#8B4513]" : "text-[#FFF8F0]"}
                      />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}

              {/* boton logout */}
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-[#FFF8F0] hover:text-[#FDE68A]"
                >
                  <LogOutIcon size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
