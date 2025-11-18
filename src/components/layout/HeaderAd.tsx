"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const supabase = createClient();

  const [open, setOpen] = useState(false); // menú móvil
  const [menuOpen, setMenuOpen] = useState(false); // menú perfil
  const [gestionOpen, setGestionOpen] = useState(false); // submenú gestión
  const [adminName, setAdminName] = useState<string>("Cargando...");

  // 🔹 Referencias para detectar clic fuera
  const gestionRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // 🔹 Cierra menús si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // 👇 Si el click fue dentro del menú móvil, no cierres nada
      if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) {
        return;
      }

      if (gestionRef.current && !gestionRef.current.contains(target)) {
        setGestionOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/dashboards/administrador"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  // 🔹 Obtener nombre del administrador
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
        <Link href="/dashboards/administrador" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CAAM" width={40} height={40} />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl text-[#FFF8F0] leading-tight">
              Centro de Atención Animal
            </span>
            <span className="font-medium text-sm text-[#FFF8F0]">
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
            { href: "/dashboards/administrador", label: "Inicio", icon: LayoutDashboard },
            { href: "/dashboards/administrador/mascotas", label: "Mascotas", icon: FileText },
            { href: "/dashboards/administrador/usuarios", label: "Usuarios", icon: Users },
          ].map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-2 rounded-md px-4 py-2 text-lg font-medium transition ${
                    active
                      ? "bg-[#FFF1E6] text-[#8B4513] border-b-2 border-[#FDE68A]"
                      : "text-[#FFF8F0] hover:text-[#FDE68A]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? "text-[#8B4513]" : "text-[#FFF8F0] group-hover:text-[#FDE68A]"}
                  />
                  {label}
                </Link>
              </li>
            );
          })}

          {/* MENÚ GESTIÓN */}
          <li className="relative" ref={gestionRef}>
            <button
              onClick={() => setGestionOpen((v) => !v)}
              className="flex items-center gap-2 text-[#FFF8F0] hover:text-[#FDE68A] transition text-lg font-medium cursor-pointer"
            >
              <FolderKanban size={18} />
              <span>Gestión</span>
              <ChevronDown size={16} />
            </button>

            {gestionOpen && (
              <div className="absolute left-0 mt-3 w-56 rounded-md bg-[#FFF1E6] shadow-lg py-2 text-[#8B4513] animate-fadeIn">
                {[
                  { href: "/dashboards/administrador/gestion_adopciones", label: "Adopciones", icon: FileText },
                  { href: "/dashboards/administrador/documentos", label: "Documentos", icon: FileText },
                  { href: "/dashboards/administrador/seguimiento", label: "Seguimiento", icon: FileText },
                  { href: "/dashboards/administrador/gestion_citas", label: "Citas de adopción", icon: CalendarDays },
                  { href: "/dashboards/administrador/citas-veterinarias", label: "Citas veterinarias", icon: CalendarHeart },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                    onClick={() => setGestionOpen(false)}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* MENÚ ADMIN */}
          <li className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-[#FFF8F0] hover:text-[#FDE68A] transition text-lg font-medium cursor-pointer"
            >
              <User size={18} />
              <span>{adminName}</span>
              <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-44 rounded-md bg-[#FFF1E6] shadow-lg py-2 text-[#8B4513] animate-fadeIn">
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

      {/* 🔹 NAV MÓVIL */}
      {open && (
        <div
          ref={mobileMenuRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="lg:hidden bg-[#BC5F36] border-t border-[#e3bba7] shadow-inner"
        >
          <ul className="flex flex-col items-center py-3 space-y-1 text-center">
            {[
              { href: "/dashboards/administrador", label: "Inicio" },
              { href: "/dashboards/administrador/mascotas", label: "Mascotas" },
              { href: "/dashboards/administrador/usuarios", label: "Usuarios" },
            ].map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => {
                    router.push(href);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 rounded-md text-lg font-medium transition ${
                    pathname === href
                      ? "bg-[#FFF1E6] text-[#8B4513]"
                      : "text-[#FFF8F0] hover:text-[#FDE68A]"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}

            {/* Submenú Gestión */}
            <li className="w-full">
              <button
                onClick={() => setGestionOpen((v) => !v)}
                className="flex items-center justify-center gap-2 w-full text-lg font-medium text-[#FFF8F0] hover:text-[#FDE68A] transition py-2"
              >
                <FolderKanban size={18} />
                <span>Gestión</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${gestionOpen ? "rotate-180" : ""}`}
                />
              </button>

              {gestionOpen && (
                <div className="bg-[#FFF1E6] rounded-md mt-1 mx-6 text-left text-[#8B4513] shadow-lg">
                  {[
                    { href: "/dashboards/administrador/gestion_adopciones", label: "Adopciones", icon: FileText },
                    { href: "/dashboards/administrador/documentos", label: "Documentos", icon: FileText },
                    { href: "/dashboards/administrador/seguimiento", label: "Seguimiento", icon: FileText },
                    { href: "/dashboards/administrador/gestion_citas", label: "Citas de adopción", icon: CalendarDays },
                    { href: "/dashboards/administrador/citas-veterinarias", label: "Citas veterinarias", icon: CalendarHeart },
                  ].map(({ href, label, icon: Icon }) => (
                    <button
                      key={href}
                      onClick={() => {
                        router.push(href);
                        setGestionOpen(false);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#FDE68A]/50 transition"
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Perfil y Cerrar sesión */}
            <li>
              <button
                onClick={() => {
                  router.push("/dashboards/perfil");
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-lg text-[#FFF8F0] hover:text-[#FDE68A]"
              >
                Mi perfil
              </button>
            </li>
            <li>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                  setOpen(false);
                }}
                className="w-full text-center px-5 py-3 rounded-md bg-[#8B4513] text-white font-semibold hover:bg-[#A0522D] transition"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
