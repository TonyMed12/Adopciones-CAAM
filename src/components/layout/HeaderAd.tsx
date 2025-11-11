"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarHeart,
  Users,
  FileText,
  Menu,
  X,
  User,
  LogOutIcon,
  ChevronDown,
  FolderKanban,
} from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gestionOpen, setGestionOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("Cargando...");
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/dashboards/administrador"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  // Obtener nombre del administrador logueado
  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const nombre = data.user.user_metadata?.nombre;
        setAdminName(nombre || "Administrador");
      } else setAdminName("Administrador");
    };

    fetchAdmin();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchAdmin();
    });
    return () => listener.subscription.unsubscribe();
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
              Morelia, Michoacán
            </span>
          </div>
        </Link>

        {/* Botón móvil */}
        <button
          className="lg:hidden text-[#FFF8F0] p-2 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* NAV DESKTOP */}
        <ul className="hidden lg:flex items-center gap-8">
          {[
            {
              href: "/dashboards/administrador",
              label: "Inicio",
              icon: LayoutDashboard,
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
          ].map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-2 rounded-md px-4 py-2 text-lg font-medium transition
                    ${
                      active
                        ? "bg-[#FFF1E6] text-[#8B4513] border-b-2 border-[#FDE68A]"
                        : "text-[#FFF8F0] hover:text-[#FDE68A]"
                    }`}
                >
                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-[#8B4513]"
                        : "text-[#FFF8F0] group-hover:text-[#FDE68A]"
                    }
                  />
                  {label}
                </Link>
              </li>
            );
          })}

          {/* MENÚ GESTIÓN */}
          <li className="relative">
            <button
              onClick={() => setGestionOpen((v) => !v)}
              className="flex items-center gap-2 text-[#FFF8F0] hover:text-[#FDE68A] transition text-lg font-medium cursor-pointer"
            >
              <FolderKanban size={18} />
              <span>Gestión</span>
              <ChevronDown size={16} />
            </button>

            {gestionOpen && (
              <div className="absolute left-0 mt-3 w-56 rounded-md bg-[#FFF1E6] shadow-lg py-2 text-[#8B4513]">
                <Link
                  href="/dashboards/administrador/gestion_adopciones"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setGestionOpen(false)}
                >
                  <FileText size={16} />
                  <span>Adopciones</span>
                </Link>
                <Link
                  href="/dashboards/administrador/documentos"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setGestionOpen(false)}
                >
                  <FileText size={16} />
                  <span>Documentos</span>
                </Link>
                <Link
                  href="/dashboards/administrador/gestion_citas"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setGestionOpen(false)}
                >
                  <CalendarDays size={16} />
                  <span>Citas de adopción</span>
                </Link>
                <Link
                  href="/dashboards/administrador/gestion_citas_veterinarias"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setGestionOpen(false)}
                >
                  <CalendarHeart size={16} />
                  <span>Citas veterinarias</span>
                </Link>
              </div>
            )}
          </li>

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
                  href="/dashboards/perfil"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                >
                  <LogOutIcon size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
