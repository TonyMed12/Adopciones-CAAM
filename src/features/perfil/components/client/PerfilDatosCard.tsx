"use client";

import {
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Perfil } from "@/features/perfil/types/perfil";

export default function PerfilDatosCard({
  perfil,
  onEdit,
}: {
  perfil: Perfil;
  onEdit: () => void;
}) {
  const iniciales =
    (perfil.nombres?.[0] || "") + (perfil.apellido_paterno?.[0] || "");

  return (
    <section className="rounded-3xl bg-white border border-[#eadacb] shadow-sm overflow-hidden">
      {/* ============ Hero del perfil ============ */}
      <header className="relative p-5 sm:p-7 bg-gradient-to-br from-[#FFF7EF] via-[#FFEAD2] to-[#FFDCC0]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="grid place-items-center h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-white text-[#BC5F36] text-2xl font-extrabold shadow-md ring-4 ring-white shrink-0">
              {iniciales.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm text-[#8B4513] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb]">
                Datos personales
              </span>
              <h2 className="mt-1.5 text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2b1b12] tracking-tight leading-tight truncate">
                {perfil.nombres} {perfil.apellido_paterno}
              </h2>
              <p className="text-sm text-[#7a5c49] mt-0.5 truncate">
                {perfil.email}
              </p>
            </div>
          </div>

          <Button onClick={onEdit} variant="secondary" size="sm" className="gap-1.5 shrink-0">
            <Pencil size={14} />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        </div>
      </header>

      {/* ============ Datos ============ */}
      <div className="p-5 sm:p-7 grid sm:grid-cols-2 gap-4 sm:gap-5">
        <Campo
          icon={<User size={14} />}
          label="Nombre completo"
          value={`${perfil.nombres} ${perfil.apellido_paterno} ${
            perfil.apellido_materno ?? ""
          }`.trim()}
        />
        <Campo
          icon={<Mail size={14} />}
          label="Correo electrónico"
          value={perfil.email}
        />
        <Campo
          icon={<Phone size={14} />}
          label="Teléfono"
          value={perfil.telefono ?? "—"}
        />
        <Campo
          icon={<FileText size={14} />}
          label="CURP"
          value={perfil.curp ?? "—"}
        />
        <Campo
          icon={<Briefcase size={14} />}
          label="Ocupación"
          value={perfil.ocupacion ?? "—"}
        />
      </div>
    </section>
  );
}

function Campo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#FFF7EF]/60 border border-[#eadacb] p-3 sm:p-4">
      <p className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#a78d7b] mb-1">
        <span className="text-[#BC5F36]">{icon}</span>
        {label}
      </p>
      <p className="text-sm sm:text-base font-bold text-[#2b1b12] break-words">
        {value || "—"}
      </p>
    </div>
  );
}
