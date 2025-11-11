"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  ClipboardList,
  Stethoscope,
  CalendarCheck,
} from "lucide-react";

export default function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuMascotas, setSubMenuMascotas] = useState(false);
  const [subMenuAdopcion, setSubMenuAdopcion] = useState(false);
  const [userName, setUserName] = useState<string>("Cargando...");
  const supabase = createClient();

  const isActive = (href: string) =>
    href === "/dashboards/usuario"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  // Usuario actual
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
          {/* Inicio */}
          <NavItem
            href="/dashboards/usuario"
            label="Inicio"
            icon={LayoutDashboard}
            active={isActive("/dashboards/usuario")}
          />

          {/* Adoptables */}
          <NavItem
            href="/dashboards/usuario/mascotas"
            label="Adoptables"
            icon={Dog}
            active={isActive("/dashboards/usuario/mascotas")}
          />

          {/* Adopción con submenu */}
          <li className="relative">
            <button
              onClick={() => setSubMenuAdopcion((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium transition rounded-md cursor-pointer ${
                isActive("/dashboards/usuario/adopcion") ||
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
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition cursor-pointer"
                  onClick={() => setSubMenuAdopcion(false)}
                >
                  <CalendarCheck size={16} />
                  <span>Mis citas para adopción</span>
                </Link>
              </div>
            )}
          </li>

          {/* MIS MASCOTAS con desplegable */}
          <li className="relative">
            <button
              onClick={() => setSubMenuMascotas((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium transition rounded-md cursor-pointer ${
                isActive("/dashboards/usuario/mis-mascotas") ||
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
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition cursor-pointer"
                  onClick={() => setSubMenuMascotas(false)}
                >
                  <PawPrint size={16} />
                  <span>Ver mis mascotas</span>
                </Link>

                <Link
                  href="/dashboards/usuario/citas-veterinarias"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/50 transition cursor-pointer"
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
    </header>
  );
}

// 🔹 Componente reutilizable para ítems del menú
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
