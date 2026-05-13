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
  Bell,
} from "lucide-react";

const mainLinks = [
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

const managementLinks = [
  {
    href: "/dashboards/administrador/gestion_adopciones",
    label: "Adopciones",
    icon: HeartHandshake,
    badge: "12",
  },
  {
    href: "/dashboards/administrador/documentos",
    label: "Documentos",
    icon: FileText,
    badge: "4",
  },
  {
    href: "/dashboards/administrador/seguimiento",
    label: "Seguimiento",
    icon: ClipboardList,
    badge: "3",
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const NavLink = ({
    href,
    label,
    icon: Icon,
    badge,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }) => {
    const active = isActive(href);

    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
          active
            ? "bg-[#FFF1E6] text-[#8B4513] shadow-sm"
            : "text-[#FFF8F0] hover:bg-white/10 hover:text-[#FDE68A]"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {label}
        </span>

        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              active
                ? "bg-[#BC5F36] text-white"
                : "bg-[#FDE68A] text-[#8B4513]"
            }`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Barra superior móvil */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#BC5F36] px-5 py-4 shadow-md lg:hidden">
        <Link href="/dashboards/administrador" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CAAM" width={36} height={36} />
          <span className="font-bold text-[#FFF8F0]">CAAM Admin</span>
        </Link>

        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-[#FFF8F0] hover:bg-white/10"
          aria-label="Abrir menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay móvil */}
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#BC5F36] px-4 py-5 shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link
          href="/dashboards/administrador"
          onClick={() => setOpen(false)}
          className="mb-6 flex items-center gap-3 rounded-xl px-2"
        >
          <Image src="/logo.png" alt="CAAM" width={44} height={44} />

          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-[#FFF8F0]">
              Centro de Atención Animal
            </span>
            <span className="text-xs font-medium text-[#FFE4D6]">
              Morelia, Michoacán
            </span>
          </div>
        </Link>

        {/* Perfil admin */}
        <div className="mb-6 rounded-2xl bg-white/10 p-4 text-[#FFF8F0]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1E6] text-[#8B4513]">
              <User size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{adminName}</p>
              <p className="text-xs text-[#FFE4D6]">Administrador</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-6 overflow-y-auto">
          <section>
            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-[#FFE4D6]">
              Principal
            </p>

            <div className="space-y-1">
              {mainLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wider text-[#FFE4D6]">
              <FolderKanban size={14} />
              Gestión
            </p>

            <div className="space-y-1">
              {managementLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-[#FFE4D6]">
              Cuenta
            </p>

            <div className="space-y-1">
              <NavLink
                href="/dashboards/perfil"
                label="Mi perfil"
                icon={User}
              />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#FFF8F0] transition hover:bg-white/10 hover:text-[#FDE68A]"
              >
                <LogOutIcon size={18} />
                Cerrar sesión
              </button>
            </div>
          </section>
        </nav>

        {/* Notificación UX */}
        <div className="mt-5 rounded-2xl bg-[#FFF1E6] p-4 text-[#8B4513]">
          <div className="mb-1 flex items-center gap-2 font-bold">
            <Bell size={16} />
            Pendientes
          </div>
          <p className="text-sm">
            Hay solicitudes y documentos por revisar.
          </p>
        </div>
      </aside>
    </>
  );
}