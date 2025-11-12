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
} from "lucide-react";

export default function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState("Cargando...");

  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  /* 馃敼 Usuario actual */
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const nombre = data.user?.user_metadata?.nombre;
      setUserName(nombre || "Usuario");
    };
    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* 馃敼 Cerrar dropdowns al hacer clic fuera */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#BC5F36] shadow-md">
      <nav
        ref={menuRef}
        className="container mx-auto flex items-center justify-between px-6 py-5"
      >
        {/* Logo */}
        <Link href="/dashboards/usuario" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CAAM" width={40} height={40} />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl text-[#FFF8F0]">
              Centro de Atenci贸n Animal
            </span>
            <span className="font-medium text-sm text-[#FFF8F0]">
              Morelia, Michoac谩n
            </span>
          </div>
        </Link>

        {/* Bot贸n m贸vil */}
        <button
          className="lg:hidden text-[#FFF8F0] p-2"
          onClick={() => setOpenMobile(!openMobile)}
        >
          {openMobile ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* NAV DESKTOP */}
        <ul className="hidden lg:flex items-center gap-8 text-lg font-medium text-[#FFF8F0]">
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

          {/* Adopci贸n */}
          <Dropdown
            label="Adopci贸n"
            icon={HeartIcon}
            open={openDropdown === "adopcion"}
            onOpen={() =>
              setOpenDropdown(openDropdown === "adopcion" ? null : "adopcion")
            }
            items={[
              {
                href: "/dashboards/usuario/citas",
                label: "Mis citas de adopci贸n",
                icon: CalendarCheck,
              },
            ]}
          />

          {/* Mis Mascotas */}
          <Dropdown
            label="Mis Mascotas"
            icon={PawPrint}
            open={openDropdown === "mascotas"}
            onOpen={() =>
              setOpenDropdown(openDropdown === "mascotas" ? null : "mascotas")
            }
            items={[
              {
                href: "/dashboards/usuario/mis-mascotas",
                label: "Ver mis mascotas",
                icon: PawPrint,
              },
              {
                href: "/dashboards/usuario/citas-veterinarias",
                label: "Citas veterinarias",
                icon: Stethoscope,
              },
            ]}
          />

          {/* Usuario */}
          <Dropdown
            label={userName}
            icon={User}
            open={openDropdown === "usuario"}
            onOpen={() =>
              setOpenDropdown(openDropdown === "usuario" ? null : "usuario")
            }
            items={[
              { href: "/dashboards/perfil", label: "Mi perfil", icon: User },
              {
                onClick: handleLogout,
                label: "Cerrar sesi贸n",
                icon: LogOutIcon,
              },
            ]}
            align="right"
          />
        </ul>
      </nav>

      {/* NAV M脫VIL */}
      {openMobile && (
        <div className="lg:hidden bg-[#BC5F36] border-t border-[#e3bba7] shadow-inner animate-slideDown">
          <ul className="flex flex-col items-center py-4 space-y-2 text-center text-[#FFF8F0]">
            <MobileLink
              href="/dashboards/usuario"
              label="Inicio"
              icon={LayoutDashboard}
              onClick={() => setOpenMobile(false)}
            />
            <MobileLink
              href="/dashboards/usuario/mascotas"
              label="Adoptables"
              icon={Dog}
              onClick={() => setOpenMobile(false)}
            />

            <MobileDropdown
              label="Adopci贸n"
              icon={HeartIcon}
              items={[
                {
                  href: "/dashboards/usuario/citas",
                  label: "Mis citas de adopci贸n",
                  icon: CalendarCheck,
                },
              ]}
              router={router}
              setOpenMobile={setOpenMobile}
            />

            <MobileDropdown
              label="Mis Mascotas"
              icon={PawPrint}
              items={[
                {
                  href: "/dashboards/usuario/mis-mascotas",
                  label: "Ver mis mascotas",
                  icon: PawPrint,
                },
                {
                  href: "/dashboards/usuario/citas-veterinarias",
                  label: "Citas veterinarias",
                  icon: Stethoscope,
                },
              ]}
              router={router}
              setOpenMobile={setOpenMobile}
            />

            <button
              onClick={() => {
                router.push("/dashboards/perfil");
                setOpenMobile(false);
              }}
              className="block w-full px-4 py-2 hover:text-[#FDE68A]"
            >
              Mi perfil
            </button>

            <button
              onClick={handleLogout}
              className="w-[90%] mt-3 text-center px-5 py-3 rounded-md bg-[#8B4513] text-white font-semibold hover:bg-[#A0522D] transition"
            >
              Cerrar sesi贸n
            </button>
          </ul>
        </div>
      )}
    </header>
  );
}

/* ========= SUBCOMPONENTES ========= */

function NavItem({ href, label, icon: Icon, active }: any) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
          active
            ? "bg-[#FFF1E6] text-[#8B4513] border-b-2 border-[#FDE68A]"
            : "hover:text-[#FDE68A]"
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    </li>
  );
}

function Dropdown({
  label,
  icon: Icon,
  open,
  onOpen,
  items,
  align = "left",
}: any) {
  return (
    <li className="relative group">
      <button
        onClick={onOpen}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
          open ? "bg-[#FFF1E6] text-[#8B4513]" : "hover:text-[#FDE68A]"
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-56 bg-[#FFF1E6] rounded-md shadow-lg py-2 text-[#8B4513] animate-fadeIn border border-[#EADACB]`}
        >
          {items.map((item: any, i: number) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                onClick={onOpen}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#FDE68A]/40 transition"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[#FDE68A]/40 transition"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </li>
  );
}

/* 馃敼 Mobile helpers */

function MobileLink({ href, label, icon: Icon, onClick }: any) {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-lg hover:text-[#FDE68A] transition"
      >
        <Icon size={18} />
        {label}
      </button>
    </li>
  );
}

function MobileDropdown({
  label,
  icon: Icon,
  items,
  router,
  setOpenMobile,
}: any) {
  const [open, setOpen] = useState(false);
  return (
    <li className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 w-full text-lg py-2 hover:text-[#FDE68A] transition"
      >
        <Icon size={18} />
        <span>{label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="bg-[#FFF1E6] rounded-md mt-1 mx-6 text-left text-[#8B4513] shadow-lg animate-fadeIn">
          {items.map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                router.push(item.href);
                setOpenMobile(false);
              }}
              className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#FDE68A]/40 transition"
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
