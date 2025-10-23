"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Menu,
  X,
  User,
  LogOutIcon,
  ChevronDown,
} from "lucide-react";

const adminNav = [
  { href: "/dashboards/administrador", label: "Inicio", icon: LayoutDashboard },
  {
    href: "/dashboards/administrador/gestion_citas",
    label: "Gestión de citas",
    icon: CalendarDays,
  },
  {
    href: "/dashboards/administrador/mascotas",
    label: "Mascotas",
    icon: FileText,
  },
  {
    href: "/dashboards/administrador/usuarios",
    label: "Usuarios",
    icon: Users,
  },
  {
    href: "/dashboards/administrador/reportes",
    label: "Reportes",
    icon: FileText,
    disabled: true, 
  },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("Cargando...");
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/dashboards/administrador"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  // nombre del admin logueado
  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        const nombre = data.user.user_metadata?.nombre;
        setAdminName(nombre || "Administrador");
      } else {
        setAdminName("Administrador");
      }
    };

    // Cargar al montar
    fetchAdmin();

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchAdmin();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          href="/dashboards/administrador"
          className="flex items-center gap-3"
        >
          <Image src="/logo.png" alt="CAAM" width={40} height={40} />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl text-[#FFF8F0]">
              Centro de Atención Animal
            </span>
            <span className="font-medium text-lg text-[#FFF8F0]">
              Morelia, Michoacán{" "}
            </span>
          </div>
        </Link>

        {/* Botón móvil */}
        <button
          className="lg:hidden text-[#FFF8F0] p-2 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* NAV DESKTOP */}
        <ul className="hidden lg:flex items-center gap-8">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "group flex items-center gap-2 rounded-md px-4 py-2 transition text-lg font-medium cursor-pointer",
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

          {/* Menú Admin */}
          <li className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-[#FFF8F0] hover:text-[#FDE68A] transition text-lg font-medium cursor-pointer"
            >
              <User size={18} />
              <span>{adminName}</span>
              <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-44 rounded-md bg-[#FFF1E6] shadow-lg py-2 text-[#8B4513]">
                <Link
                  //href="/dashboards/administrador/perfil"
                  href="https://www.youtube.com/watch?v=xvFZjo5PgG0"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition cursor-pointer"
                >
                  <LogOutIcon size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* NAV MÓVIL */}
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
                        "flex items-center gap-3 rounded-md px-3 py-2 transition text-base cursor-pointer",
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

              {/* Menú admin móvil */}
              <li className="mt-2 border-t border-white/20 pt-2">
                <p className="text-[#FFF8F0] font-medium mb-2">{adminName}</p>
                <Link
                  //href="/dashboards/administrador/perfil"
                  href="https://www.youtube.com/watch?v=xvFZjo5PgG0"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[#FFF8F0] hover:text-[#FDE68A] cursor-pointer"
                >
                  <User size={18} />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-[#FFF8F0] hover:text-[#FDE68A] cursor-pointer"
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
