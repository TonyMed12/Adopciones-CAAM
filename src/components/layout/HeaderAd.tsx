"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  PawPrint,
  Users,
  FileText,
  CalendarDays,
  CalendarHeart,
  ClipboardList,
  HeartHandshake,
  Menu,
  X,
  User,
  LogOutIcon,
  FolderKanban,
  ChevronRight,
} from "lucide-react";

interface NavLinkDef {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mainLinks: NavLinkDef[] = [
  {
    href: "/dashboards/administrador",
    label: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboards/administrador/mascotas",
    label: "Mascotas",
    icon: PawPrint,
  },
  {
    href: "/dashboards/administrador/usuarios",
    label: "Usuarios",
    icon: Users,
  },
];

const managementLinks: NavLinkDef[] = [
  {
    href: "/dashboards/administrador/gestion_adopciones",
    label: "Adopciones",
    icon: HeartHandshake,
  },
  {
    href: "/dashboards/administrador/documentos",
    label: "Documentos",
    icon: FileText,
  },
  {
    href: "/dashboards/administrador/seguimiento",
    label: "Seguimiento",
    icon: ClipboardList,
  },
  {
    href: "/dashboards/administrador/gestion_citas",
    label: "Citas de adopción",
    icon: CalendarDays,
  },
  {
    href: "/dashboards/administrador/citas-veterinarias",
    label: "Citas veterinarias",
    icon: CalendarHeart,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState("Administrador");

  const isActive = (href: string) =>
    href === "/dashboards/administrador"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      const nombre = data.user?.user_metadata?.nombre;
      setAdminName(nombre || "Administrador");
    };

    fetchAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchAdmin();
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  /* Bloquear scroll body cuando el menú móvil esté abierto */
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = adminName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "AD";

  const NavLink = ({ href, label, icon: Icon }: NavLinkDef) => {
    const active = isActive(href);

    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        aria-current={active ? "page" : undefined}
        className={`
          group relative flex items-center gap-3 rounded-xl px-3 py-2.5
          text-[13.5px] font-medium transition-all duration-200
          ${
            active
              ? "bg-white text-[#8B4513] shadow-sm"
              : "text-[#FFF8F0]/85 hover:bg-white/10 hover:text-white"
          }
        `}
      >
        {/* Indicador de active state - barra lateral */}
        <span
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full transition-all
            ${active ? "bg-[#FDE68A]" : "bg-transparent group-hover:bg-white/20"}
          `}
          aria-hidden="true"
        />

        <span
          className={`
            grid h-8 w-8 place-items-center rounded-lg shrink-0 transition
            ${
              active
                ? "bg-[#FFF1E6] text-[#BC5F36]"
                : "bg-white/5 text-[#FFF8F0]/90 group-hover:bg-white/10 group-hover:text-white"
            }
          `}
        >
          <Icon size={16} />
        </span>

        <span className="truncate flex-1">{label}</span>

        {active && (
          <ChevronRight
            size={14}
            className="text-[#BC5F36] shrink-0"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  };

  const SectionLabel = ({
    icon: Icon,
    children,
  }: {
    icon?: React.ElementType;
    children: React.ReactNode;
  }) => (
    <p className="mb-2 flex items-center gap-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#FFE4D6]/80">
      {Icon && <Icon size={12} />}
      {children}
    </p>
  );

  return (
    <>
      {/* ============ Barra superior móvil ============ */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#BC5F36] px-4 sm:px-5 py-3 shadow-md lg:hidden">
        <Link
          href="/dashboards/administrador"
          className="flex items-center gap-2.5 min-w-0"
        >
          <Image src="/logo.png" alt="CAAM" width={36} height={36} />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-[#FFF8F0] leading-tight truncate">
              CAAM Admin
            </span>
            <span className="text-[10px] text-[#FFE4D6]/90 leading-tight truncate">
              Panel de gestión
            </span>
          </div>
        </Link>

        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl p-2 text-[#FFF8F0] hover:bg-white/10 transition active:scale-95"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ============ Overlay móvil ============ */}
      {open && (
        <button
          className="fixed inset-0 z-40 bg-[#2b1b12]/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      {/* ============ Sidebar ============ */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col
          bg-gradient-to-b from-[#BC5F36] via-[#B05630] to-[#9F4D2A]
          shadow-xl transition-transform duration-300 ease-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo header */}
        <div className="px-4 pt-5 pb-4 border-b border-white/10">
          <Link
            href="/dashboards/administrador"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-1"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm shrink-0">
              <Image src="/logo.png" alt="CAAM" width={32} height={32} />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-extrabold leading-tight text-[#FFF8F0] tracking-tight">
                CAAM Admin
              </span>
              <span className="text-[11px] font-medium text-[#FFE4D6]/80 leading-tight">
                Morelia, Michoacán
              </span>
            </div>
          </Link>
        </div>

        {/* Perfil admin */}
        <div className="px-4 pt-4 pb-2">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-3 text-[#FFF8F0]">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#FDE68A] to-[#FCD34D] text-[#8B4513] font-extrabold text-sm shadow-sm">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#B05630]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold leading-tight">
                  {adminName}
                </p>
                <p className="text-[11px] text-[#FFE4D6]/80 leading-tight mt-0.5">
                  Administrador
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scroll">
          <section>
            <SectionLabel>Principal</SectionLabel>
            <div className="space-y-0.5">
              {mainLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel icon={FolderKanban}>Gestión</SectionLabel>
            <div className="space-y-0.5">
              {managementLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Cuenta</SectionLabel>
            <div className="space-y-0.5">
              <NavLink
                href="/dashboards/perfil"
                label="Mi perfil"
                icon={User}
              />

              <button
                onClick={handleLogout}
                className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-[#FFF8F0]/85 transition hover:bg-white/10 hover:text-white"
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-transparent group-hover:bg-white/20 transition-all" />
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-[#FFF8F0]/90 group-hover:bg-white/10 shrink-0 transition">
                  <LogOutIcon size={16} />
                </span>
                <span className="truncate">Cerrar sesión</span>
              </button>
            </div>
          </section>
        </nav>

        {/* Footer info */}
        <div className="border-t border-white/10 px-4 py-3 mt-auto">
          <p className="text-[10px] text-[#FFE4D6]/60 text-center leading-tight">
            © {new Date().getFullYear()} CAAM Morelia
          </p>
        </div>
      </aside>
    </>
  );
}
