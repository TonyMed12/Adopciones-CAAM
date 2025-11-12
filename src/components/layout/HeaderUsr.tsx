"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  HeartIcon,
  Menu,
  X,
  User,
  LogOutIcon,
  ChevronDown,
  PawPrint,
  Dog,
  Stethoscope,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

export default function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuMascotas, setSubMenuMascotas] = useState(false);
  const [subMenuAdopcion, setSubMenuAdopcion] = useState(false);
  const [userName, setUserName] = useState<string>("Cargando...");

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/dashboards/usuario"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  // 🔹 Usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const nombre = data.user.user_metadata?.nombre;
        setUserName(nombre || "Usuario");
      } else setUserName("Usuario");
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // 🔹 Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) return;
      setOpen(false);
      setSubMenuAdopcion(false);
      setSubMenuMascotas(false);
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/dashboards/usuario" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CAAM" width={40} height={40} />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl text-[#FFF8F0]">
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
          <NavItem
            href="/dashboards/usuario"
            label="Inicio"
            icon={LayoutDashboard}
            active={isActive("/dashboards/usuario")}
          />
          <NavItem
            href="/dashboards/usuario/mascotas"
            label="Adoptables"
            icon={Dog}
            active={isActive("/dashboards/usuario/mascotas")}
          />

          {/* Adopción */}
          <li className="relative">
            <button
              onClick={() => setSubMenuAdopcion((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium transition rounded-md cursor-pointer ${isActive("/dashboards/usuario/adopcion") ||
                isActive("/dashboards/usuario/citas")
                ? "bg-[#FFF1E6] text-[#8B4513] border-b-2 border-[#FDE68A]"
                : "text-[#FFF8F0] hover:text-[#FDE68A]"
                }`}
            >
              <HeartIcon size={18} />
              <span>Adopción</span>
              <ChevronDown size={16} />
            </button>
            {subMenuAdopcion && (
              <div className="absolute left-0 mt-2 w-56 rounded-md bg-[#FFF1E6] shadow-lg py-2 text-[#8B4513]">
                <Link
                  href="/dashboards/usuario/citas"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setSubMenuAdopcion(false)}
                >
                  <CalendarCheck size={16} />
                  <span>Mis citas de adopción</span>
                </Link>
              </div>
            )}
          </li>

          {/* Mis Mascotas */}
          <li className="relative">
            <button
              onClick={() => setSubMenuMascotas((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium transition rounded-md cursor-pointer ${isActive("/dashboards/usuario/mis-mascotas") ||
                isActive("/dashboards/usuario/seguimiento") ||
                isActive("/dashboards/usuario/citas-veterinarias")
                ? "bg-[#FFF1E6] text-[#8B4513] border-b-2 border-[#FDE68A]"
                : "text-[#FFF8F0] hover:text-[#FDE68A]"
                }`}
            >
              <PawPrint size={18} />
              <span>Mis Mascotas</span>
              <ChevronDown size={16} />
            </button>
            {subMenuMascotas && (
              <div className="absolute left-0 mt-2 w-56 rounded-md bg-[#FFF1E6] shadow-lg py-2 text-[#8B4513]">
                <Link
                  href="/dashboards/usuario/mis-mascotas"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setSubMenuMascotas(false)}
                >
                  <PawPrint size={16} />
                  <span>Ver mis mascotas</span>
                </Link>
                <Link
                  href="/dashboards/usuario/citas-veterinarias"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition"
                  onClick={() => setSubMenuMascotas(false)}
                >
                  <Stethoscope size={16} />
                  <span>Citas veterinarias</span>
                </Link>
              </div>
            )}
          </li>

          {/* Usuario */}
          <li className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-[#FFF8F0] hover:text-[#FDE68A] transition text-lg font-medium cursor-pointer"
            >
              <User size={18} />
              <span>{userName}</span>
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

      {/* 🔹 NAV MÓVIL */}
      {open && (
        <div
          ref={mobileMenuRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="lg:hidden bg-[#BC5F36] border-t border-[#e3bba7] shadow-inner"
        >
          <ul className="flex flex-col items-center py-3 space-y-1 text-center">
            {[
              { href: "/dashboards/usuario", label: "Inicio", icon: LayoutDashboard },
              { href: "/dashboards/usuario/mascotas", label: "Adoptables", icon: Dog },
            ].map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <button
                  onClick={() => {
                    router.push(href);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-lg font-medium transition ${pathname === href
                    ? "bg-[#FFF1E6] text-[#8B4513]"
                    : "text-[#FFF8F0] hover:text-[#FDE68A]"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              </li>
            ))}

            {/* Adopción */}
            <li className="w-full">
              <button
                onClick={() => setSubMenuAdopcion((v) => !v)}
                className="flex items-center justify-center gap-2 w-full text-lg font-medium text-[#FFF8F0] hover:text-[#FDE68A] transition py-2"
              >
                <HeartIcon size={18} />
                <span>Adopción</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${subMenuAdopcion ? "rotate-180" : ""}`}
                />
              </button>

              {subMenuAdopcion && (
                <div className="bg-[#FFF1E6] rounded-md mt-1 mx-6 text-left text-[#8B4513] shadow-lg">
                  <button
                    onClick={() => {
                      router.push("/dashboards/usuario/adopcion");
                      setSubMenuAdopcion(false);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#FDE68A]/50 transition"
                  >
                    <ClipboardList size={16} />
                    <span>Proceso de adopción</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push("/dashboards/usuario/citas");
                      setSubMenuAdopcion(false);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#FDE68A]/50 transition"
                  >
                    <CalendarCheck size={16} />
                    <span>Mis citas de adopción</span>
                  </button>
                </div>
              )}
            </li>
            {/* Mis Mascotas */}
            <li className="w-full">
              <button
                onClick={() => setSubMenuMascotas((v) => !v)}
                className="flex items-center justify-center gap-2 w-full text-lg font-medium text-[#FFF8F0] hover:text-[#FDE68A] transition py-2"
              >
                <PawPrint size={18} />
                <span>Mis Mascotas</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${subMenuMascotas ? "rotate-180" : ""}`}
                />
              </button>
              {subMenuMascotas && (
                <div className="bg-[#FFF1E6] rounded-md mt-1 mx-6 text-left text-[#8B4513] shadow-lg">
                  <button
                    onClick={() => {
                      router.push("/dashboards/usuario/mis-mascotas");
                      setSubMenuMascotas(false);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#FDE68A]/50 transition"
                  >
                    <PawPrint size={16} />
                    <span>Ver mis mascotas</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/dashboards/usuario/citas-veterinarias");
                      setSubMenuMascotas(false);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#FDE68A]/50 transition"
                  >
                    <Stethoscope size={16} />
                    <span>Citas veterinarias</span>
                  </button>
                </div>
              )}
            </li>

            {/* Perfil */}
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

            {/* Logout */}
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

// 🔹 Componente reutilizable
function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: any;
  active: boolean;
}) {
  return (
    <li>
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
        {label}
      </Link>
    </li>
  );
}
