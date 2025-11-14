"use client";

import { UserCircle } from "lucide-react";
import type { PerfilConDocumentos } from "@/usuarios/usuarios";

export default function UserTable({
  usuarios,
  onSelect,
}: {
  usuarios: PerfilConDocumentos[];
  onSelect: (u: PerfilConDocumentos) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#EADACB] bg-white overflow-hidden">

      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden md:grid grid-cols-5 bg-[#FFF4E7] border-b border-[#EADACB] text-[11px] font-bold uppercase tracking-wide text-[#2B1B12] px-4 py-2">
        <div>Nombre</div>
        <div>Correo</div>
        <div>Teléfono</div>
        <div>Ocupación</div>
        <div>Estado</div>
      </div>

      {/* ===== FILAS ===== */}
      <div className="divide-y divide-[#F3E8DC]">
        {usuarios.map((u, idx) => (
          <button
            key={u.id}
            onClick={() => onSelect(u)}
            className={`
              block w-full transition text-left
              ${idx % 2 === 0 ? "bg-white" : "bg-[#FFFCF9]"}
              hover:bg-[#FFF2E5]
            `}
          >

            {/* ===== MOBILE CARD ===== */}
            <div className="md:hidden p-4 flex flex-col gap-2">

              {/* Avatar + Nombre */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-[#EADACB] bg-[#FFF7F0] grid place-items-center text-[#BC5F36] shadow-inner">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#2B1B12] leading-tight">
                    {u.nombres} {u.apellido_paterno} {u.apellido_materno}
                  </p>
                  <p className="text-[11px] text-[#8B6F5D]">ID {u.id.slice(0, 6)}</p>
                </div>
              </div>

              {/* CAMPOS CON LABELS */}
              <div className="text-xs text-[#8B6F5D] mt-1">Correo:</div>
              <div className="text-sm text-[#2B1B12] break-words">{u.email}</div>

              <div className="text-xs text-[#8B6F5D] mt-1">Teléfono:</div>
              <div className="text-sm text-[#2B1B12]">{u.telefono || "—"}</div>

              <div className="text-xs text-[#8B6F5D] mt-1">Ocupación:</div>
              <div className="text-sm text-[#2B1B12] capitalize">{u.ocupacion || "—"}</div>

              <div className="text-xs text-[#8B6F5D] mt-1">Estado:</div>
              <div className="flex justify-start">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    u.activo ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {/* ===== DESKTOP ROW ===== */}
            <div className="hidden md:grid grid-cols-5 items-center px-4 py-2">

              {/* Nombre */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border border-[#EADACB] bg-[#FFF7F0] grid place-items-center text-[#BC5F36] shadow-inner">
                  <UserCircle className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <div className="font-medium text-[#2B1B12] text-sm">
                    {u.nombres} {u.apellido_paterno}
                  </div>
                  <div className="text-[10px] text-[#8B6F5D]">
                    ID {u.id.slice(0, 6)}
                  </div>
                </div>
              </div>

              {/* Correo */}
              <div className="text-[#2B1B12] text-sm truncate">{u.email}</div>

              {/* Teléfono */}
              <div className="text-[#2B1B12] text-sm">{u.telefono || "—"}</div>

              {/* Ocupación */}
              <div className="text-[#2B1B12] text-sm capitalize">{u.ocupacion}</div>

              {/* Estado */}
              <div>
                <span
                  className={`
                    text-xs font-semibold px-2.5 py-1 rounded-full
                    ${u.activo ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}
                  `}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

          </button>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="py-10 text-center text-[#8B6F5D] border-t border-[#F3E8DC]">
          No se encontraron usuarios.
        </div>
      )}
    </div>
  );
}
