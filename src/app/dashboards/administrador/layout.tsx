"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  FileText,
} from "lucide-react";

const nav = [
  { href: "/dashboards/administrador", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboards/administrador/mascotas", label: "Mascotas", icon: CalendarClock },
  { href: "/dashboards/administrador/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboards/administrador/reportes", label: "Reportes", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const root = nav[0].href;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Fondo suave */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[45rem] h-[45rem] rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className="relative w-64 flex flex-col shadow-xl rounded-tr-3xl rounded-br-3xl text-white"
          style={{
            background: "linear-gradient(180deg, #FF8414 0%, #FF6B00 100%)",
            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          }}
        >
          {/* Header del sidebar */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
            <img src="/logo.jpg" alt="CAAM" className="h-9 w-9 rounded-xl object-cover" />
            <div>
              <div className="text-lg font-semibold leading-5">CAAM</div>
              <div className="text-xs opacity-80">Panel de administración</div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 py-4">
            {nav.map(({ href, label, icon: Icon }) => {
              const isRoot = href === root;
              const active = isRoot
                ? pathname === root
                : pathname === href || pathname.startsWith(href + "/");

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative mx-3 my-1 flex items-center gap-3 rounded-xl px-4 py-2 transition ${
                    active
                      ? "bg-white text-[#FF6B00] font-medium"
                      : "hover:bg-white/10 text-white/95"
                  }`}
                >
                  {/* Indicador lateral */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full ${
                      active ? "bg-white" : "bg-transparent group-hover:bg-white/40"
                    }`}
                  />
                  <Icon size={18} className={active ? "text-[#FF6B00]" : "text-white"} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 text-[11px] text-white/80 border-t border-white/10">
            © {new Date().getFullYear()} Centro de Atención Animal • Morelia
          </div>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1 p-6 md:p-8">
          <div
            className="mx-auto max-w-[1200px] bg-white/85 backdrop-blur-sm rounded-3xl border border-slate-100 p-6 md:p-8"
            style={{ boxShadow: "0 20px 60px rgba(2,6,23,.06)" }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
