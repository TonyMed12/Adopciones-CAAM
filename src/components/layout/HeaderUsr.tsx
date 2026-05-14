"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
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

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type NavDropdown = {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: Array<{
    href?: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick?: () => void;
    description?: string;
  }>;
};

export default function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState("Cargando...");
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/dashboards/usuario") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* Usuario actual */
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const nombre = data.user?.user_metadata?.nombre;
      setUserName(nombre || "Usuario");
    };
    fetchUser();
  }, [supabase]);

  /* Scroll effect para sombra/blur */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cerrar dropdowns al hacer clic fuera */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Bloquear scroll cuando el menú móvil está abierto */
  useEffect(() => {
    if (openMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  /* Cerrar menú móvil al cambiar de ruta */
  useEffect(() => {
    setOpenMobile(false);
    setOpenDropdown(null);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* === Estructura de navegación === */
  const primaryLinks: NavLink[] = [
    { href: "/dashboards/usuario", label: "Inicio", icon: LayoutDashboard },
    { href: "/dashboards/usuario/mascotas", label: "Adoptables", icon: Dog },
  ];

  const adopcionDropdown: NavDropdown = {
    label: "Adopción",
    icon: HeartIcon,
    items: [
      {
        href: "/dashboards/usuario/adopcion",
        label: "Proceso de adopción",
        icon: HeartIcon,
        description: "Tu adopción activa",
      },
      {
        href: "/dashboards/usuario/citas",
        label: "Mis citas",
        icon: CalendarCheck,
        description: "Citas programadas",
      },
    ],
  };

  const mascotasDropdown: NavDropdown = {
    label: "Mis Mascotas",
    icon: PawPrint,
    items: [
      {
        href: "/dashboards/usuario/mis-mascotas",
        label: "Ver mis mascotas",
        icon: PawPrint,
        description: "Tus compañeros adoptados",
      },
      {
        href: "/dashboards/usuario/citas-veterinarias",
        label: "Citas veterinarias",
        icon: Stethoscope,
        description: "Salud y seguimiento",
      },
    ],
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full bg-[#BC5F36] text-[#FFF8F0] transition-shadow",
        scrolled ? "shadow-lg" : "shadow-md"
      )}
    >
      <nav
        ref={menuRef}
        className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/dashboards/usuario"
          className="flex items-center gap-3 group min-w-0"
          aria-label="Inicio CAAM"
        >
          <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors shrink-0">
            <Image src="/logo.png" alt="" width={28} height={28} />
          </div>
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="font-bold text-base leading-tight truncate">
              Centro de Atención Animal
            </span>
            <span className="font-medium text-xs opacity-90 truncate">
              Morelia, Michoacán
            </span>
          </div>
        </Link>

        {/* Botón móvil */}
        <button
          type="button"
          className="lg:hidden h-11 w-11 grid place-items-center rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpenMobile(!openMobile)}
          aria-expanded={openMobile}
          aria-label={openMobile ? "Cerrar menú" : "Abrir menú"}
        >
          {openMobile ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* NAV DESKTOP */}
        <ul className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {primaryLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              active={isActive(link.href)}
            />
          ))}

          <Dropdown
            label={adopcionDropdown.label}
            icon={adopcionDropdown.icon}
            items={adopcionDropdown.items}
            open={openDropdown === "adopcion"}
            active={adopcionDropdown.items.some(
              (it) => it.href && isActive(it.href)
            )}
            onOpen={() =>
              setOpenDropdown(openDropdown === "adopcion" ? null : "adopcion")
            }
          />

          <Dropdown
            label={mascotasDropdown.label}
            icon={mascotasDropdown.icon}
            items={mascotasDropdown.items}
            open={openDropdown === "mascotas"}
            active={mascotasDropdown.items.some(
              (it) => it.href && isActive(it.href)
            )}
            onOpen={() =>
              setOpenDropdown(openDropdown === "mascotas" ? null : "mascotas")
            }
          />

          {/* Separador sutil */}
          <li className="mx-2 h-6 w-px bg-white/20" aria-hidden="true" />

          <Dropdown
            label={userName}
            icon={User}
            avatar
            items={[
              {
                href: "/dashboards/perfil",
                label: "Mi perfil",
                icon: User,
                description: "Datos personales y documentos",
              },
              {
                onClick: handleLogout,
                label: "Cerrar sesión",
                icon: LogOutIcon,
              },
            ]}
            open={openDropdown === "usuario"}
            onOpen={() =>
              setOpenDropdown(openDropdown === "usuario" ? null : "usuario")
            }
            align="right"
            highlightLast
          />
        </ul>
      </nav>

      {/* NAV MÓVIL */}
      {openMobile && (
        <div
          className="lg:hidden absolute inset-x-0 top-full bg-[#BC5F36] border-t border-white/20 shadow-xl animate-fade-slide max-h-[calc(100vh-4rem)] overflow-y-auto"
          role="dialog"
          aria-label="Menú de navegación móvil"
        >
          <div className="px-4 py-4 space-y-1">
            {/* Saludo móvil */}
            <div className="px-3 py-3 mb-2 rounded-xl bg-white/10 flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-full bg-white text-[#BC5F36] font-bold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs opacity-80">Hola,</p>
                <p className="font-bold truncate">{userName}</p>
              </div>
            </div>

            {primaryLinks.map((link) => (
              <MobileLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={isActive(link.href)}
                router={router}
                onClick={() => setOpenMobile(false)}
              />
            ))}

            <MobileDropdown
              label={adopcionDropdown.label}
              icon={adopcionDropdown.icon}
              items={adopcionDropdown.items}
              isActive={isActive}
              router={router}
              setOpenMobile={setOpenMobile}
            />

            <MobileDropdown
              label={mascotasDropdown.label}
              icon={mascotasDropdown.icon}
              items={mascotasDropdown.items}
              isActive={isActive}
              router={router}
              setOpenMobile={setOpenMobile}
            />

            <div className="h-px bg-white/20 my-3" aria-hidden="true" />

            <MobileLink
              href="/dashboards/perfil"
              label="Mi perfil"
              icon={User}
              active={isActive("/dashboards/perfil")}
              router={router}
              onClick={() => setOpenMobile(false)}
            />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white text-[#8B4513] font-semibold hover:bg-[#FDE68A] active:scale-[0.99] transition-all"
            >
              <LogOutIcon size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* =================== SUBCOMPONENTES =================== */

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
          active
            ? "bg-white text-[#8B4513] shadow-sm"
            : "hover:bg-white/10 text-[#FFF8F0]"
        )}
      >
        <Icon size={16} className="shrink-0" />
        <span>{label}</span>
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
  active,
  avatar,
  highlightLast,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  open: boolean;
  onOpen: () => void;
  items: NavDropdown["items"];
  align?: "left" | "right";
  active?: boolean;
  avatar?: boolean;
  highlightLast?: boolean;
}) {
  return (
    <li className="relative">
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
          active || open
            ? "bg-white text-[#8B4513] shadow-sm"
            : "hover:bg-white/10 text-[#FFF8F0]"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatar ? (
          <span className="grid place-items-center h-6 w-6 rounded-full bg-white/20 text-[10px] font-bold shrink-0">
            {label.charAt(0).toUpperCase()}
          </span>
        ) : (
          <Icon size={16} className="shrink-0" />
        )}
        <span className="max-w-[120px] truncate">{label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform shrink-0",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute mt-2 min-w-[240px] bg-white rounded-2xl shadow-xl border border-[#eadacb] py-2 z-50 animate-fade-slide",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const dangerStyle = highlightLast && isLast;
            const content = (
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "grid place-items-center h-9 w-9 rounded-lg shrink-0",
                    dangerStyle
                      ? "bg-rose-50 text-rose-600"
                      : "bg-[#FFF1E6] text-[#BC5F36]"
                  )}
                >
                  <item.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      dangerStyle ? "text-rose-700" : "text-[#2b1b12]"
                    )}
                  >
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[#7a5c49] mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );

            return item.href ? (
              <Link
                key={i}
                href={item.href}
                onClick={onOpen}
                className="block px-3 py-2 mx-1 rounded-xl hover:bg-[#FFF7EF] transition-colors"
                role="menuitem"
              >
                {content}
              </Link>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onOpen();
                  item.onClick?.();
                }}
                className={cn(
                  "block w-full text-left px-3 py-2 mx-1 rounded-xl transition-colors",
                  dangerStyle ? "hover:bg-rose-50" : "hover:bg-[#FFF7EF]"
                )}
                style={{ width: "calc(100% - 0.5rem)" }}
                role="menuitem"
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </li>
  );
}

function MobileLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
  router,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
  onClick: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        router.push(href);
        onClick();
      }}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors",
        active
          ? "bg-white text-[#8B4513]"
          : "text-[#FFF8F0] hover:bg-white/10"
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MobileDropdown({
  label,
  icon: Icon,
  items,
  isActive,
  router,
  setOpenMobile,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: NavDropdown["items"];
  isActive: (href: string) => boolean;
  router: ReturnType<typeof useRouter>;
  setOpenMobile: (v: boolean) => void;
}) {
  const groupActive = items.some((it) => it.href && isActive(it.href));
  const [open, setOpen] = useState(groupActive);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl transition-colors",
          groupActive || open
            ? "bg-white/10 text-[#FFF8F0]"
            : "text-[#FFF8F0] hover:bg-white/10"
        )}
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} className="shrink-0" />
          <span className="font-medium">{label}</span>
        </span>
        <ChevronDown
          size={16}
          className={cn("transition-transform", open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div className="mt-1 ml-3 pl-3 border-l-2 border-white/20 space-y-1 animate-fade-slide">
          {items.map((item, i) =>
            item.href ? (
              <button
                key={i}
                type="button"
                onClick={() => {
                  router.push(item.href!);
                  setOpenMobile(false);
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-white text-[#8B4513]"
                    : "text-[#FFF8F0]/90 hover:bg-white/10"
                )}
              >
                <item.icon size={16} className="shrink-0" />
                <span>{item.label}</span>
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
