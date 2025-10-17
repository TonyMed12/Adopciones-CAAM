"use client";

import React, { useMemo, useState } from "react";
import {
  UserCircle,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
  MapPin,
  Trash2,
  AlertTriangle,
} from "lucide-react";

// Paleta del proyecto Adopciones
// primario: #BC5F36, acento: #FF8414, fondo suave: #FFF4E7, bordes: #EADACB, texto: #2B1B12

type Usuario = {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  direccion?: string;
  edad?: number;
  sexo?: "M" | "H" | "";
  imagenUrl?: string;
};

const demoUsuarios: Usuario[] = [
  {
    id: 1,
    nombres: "Ana",
    apellidos: "Ramírez López",
    correo: "ana@gmail.com",
    telefono: "55 1234 5678",
    ciudad: "Morelia",
    estado: "Michoacan",
    pais: "México",
    direccion: "Av. Siempre Viva 123",
    edad: 24,
    sexo: "M",
  },
  {
    id: 2,
    nombres: "Carlos",
    apellidos: "García Pérez",
    correo: "carlos@gmail.com",
    telefono: "55 9876 5432",
    ciudad: "Morelia",
    estado: "Michoacan",
    pais: "México",
    direccion: "Calle Sol #45",
    edad: 27,
    sexo: "H",
  },
  {
    id: 3,
    nombres: "Lucía",
    apellidos: "Hernández",
    correo: "lucia@hotmail.com",
    telefono: "81 123 4567",
    ciudad: "Morelia",
    estado: "Michoacan",
    pais: "México",
    direccion: "Insurgentes 200",
    edad: 22,
    sexo: "M",
  },
  {
    id: 4,
    nombres: "Mario",
    apellidos: "Torres",
    correo: "mario@gmail.com",
    telefono: "33 555 0000",
    ciudad: "Morelia",
    estado: "Michoacan",
    pais: "México",
    direccion: "Lerdo 10",
    edad: 30,
    sexo: "H",
  },
  {
    id: 5,
    nombres: "Diana",
    apellidos: "Flores",
    correo: "diana@gmail.com",
    telefono: "55 222 3333",
    ciudad: "Morelia",
    estado: "Michoacan",
    pais: "México",
    direccion: "Roma Nte.",
    edad: 26,
    sexo: "M",
  },
  {
    id: 6,
    nombres: "Héctor",
    apellidos: "Mendoza",
    correo: "hector@gmail.com",
    telefono: "222 111 0000",
    ciudad: "Morelia",
    estado: "Michoacan",
    pais: "México",
    direccion: "Centro",
    edad: 31,
    sexo: "H",
  },
];

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12] ${
        props.className || ""
      }`}
    />
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#FFF4E7] border border-[#EADACB] px-2.5 py-1 text-xs text-[#2B1B12]">
      {children}
    </span>
  );
}

function ConfirmModal({
  open,
  nombre,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  nombre?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(43,27,18,.45)] p-4">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#eadacb] bg-[#fff4e7] text-[#2b1b12] shadow-[0_18px_60px_rgba(43,27,18,.25)]">
        <header className="flex items-center gap-2 border-b border-[#f0e6dc] bg-[#fff4e7] px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-[#BC5F36]" />
          <div className="text-sm font-extrabold">Confirmar eliminación</div>
        </header>
        <div className="space-y-3 px-4 py-4 text-sm">
          <p>
            Vas a eliminar al usuario <b>{nombre}</b>. Esta acción no se puede
            deshacer.
          </p>
          <p className="text-[#6b4f40]">¿Deseas continuar?</p>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-[#f0e6dc] bg-white px-4 py-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[#EADACB] bg-white px-3 py-1.5 text-sm font-semibold text-[#2B1B12] hover:bg-[#FFF4E7]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-[#BC5F36] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95"
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>(demoUsuarios);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter(
      (u) =>
        u.nombres.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q)
    );
  }, [query, usuarios]);

  const askEliminar = (id: number) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmEliminar = () => {
    if (toDeleteId == null) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== toDeleteId));
    if (selected?.id === toDeleteId) setSelected(null);
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  return (
    <div className="min-h-[70vh] space-y-6">
      {/* Encabezado */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B1B12]">Usuarios</h1>
          <p className="text-sm text-[#6b4f40]">
            Listado general y panel de detalle.
          </p>
        </div>
        {/* Controles */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#EADACB] bg-white px-3 py-2">
          <Search className="h-4 w-4 text-[#8b6f5d]" />
          <input
            placeholder="Buscar por nombre o correo"
            className="w-72 bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mx-2 h-5 w-px bg-[#EADACB]" />
          <button
            className="inline-flex items-center gap-1 text-sm text-[#BC5F36] hover:opacity-90"
            title="Filtros (próximamente)"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex gap-6">
        {/* Tabla */}
        <div className="w-full overflow-x-auto">
          <table className="w-full rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-[#FFF4E7] border-b border-[#EADACB]">
                <Th className="text-left">Nombre</Th>
                <Th className="text-left">Correo</Th>
                <Th className="text-left">Teléfono</Th>
                <Th className="text-left">Ubicación</Th>
                <Th className="text-left">Etiqueta</Th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u, idx) => (
                <tr
                  key={u.id}
                  onClick={() => setSelected(u)}
                  className={`cursor-pointer border-b border-[#F3E8DC] transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#FFF9F3]"
                  } hover:bg-[#FFF4E7]`}
                >
                  <td className="px-3 py-3 font-semibold text-[#2B1B12]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full border border-[#EADACB] bg-white text-[#BC5F36]">
                        <UserCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <div>
                          {u.nombres} {u.apellidos}
                        </div>
                        <div className="text-[11px] text-[#8b6f5d]">
                          ID {u.id.toString().padStart(3, "0")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#2B1B12]">
                    <span title={u.correo}>{u.correo}</span>
                  </td>
                  <td className="px-3 py-3 text-[#2B1B12]">
                    {u.telefono || "—"}
                  </td>
                  <td className="px-3 py-3 text-[#2B1B12]">
                    {u.ciudad || "—"}
                    {u.estado ? `, ${u.estado}` : ""}
                  </td>
                  <td className="px-3 py-3">
                    <Pill>Usuario</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-[#EADACB] p-8 text-center text-[#6b4f40]">
              No se encontraron resultados para{" "}
              <b className="mx-1">“{query}”</b>.
            </div>
          )}
        </div>

        {/* Perfil lateral */}
        <aside className="sticky top-4 h-fit w/full max-w-sm rounded-2xl border border-[#EADACB] bg-white p-6">
          {!selected ? (
            <div className="grid place-items-center text-center text-[#6b4f40]">
              <UserCircle className="mb-3 h-12 w-12 text-[#BC5F36]" />
              <p className="text-sm">
                Selecciona un usuario para ver sus detalles
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-[#EADACB] bg-[#FFF4E7] text-[#BC5F36]">
                  <UserCircle className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#2B1B12]">
                    {selected.nombres} {selected.apellidos}
                  </h3>
                  <div className="text-[12px] text-[#8b6f5d]">Usuario</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#2B1B12]">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#BC5F36]" />
                  <span>{selected.correo}</span>
                </div>
                {selected.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#BC5F36]" />
                    <span>{selected.telefono}</span>
                  </div>
                )}
                {(selected.ciudad || selected.estado || selected.pais) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#BC5F36]" />
                    <span>
                      {[selected.ciudad, selected.estado, selected.pais]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {selected.direccion && (
                  <div className="ml-6 text-[12px] text-[#6b4f40]">
                    {selected.direccion}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Pill>
                  {selected.sexo === "M"
                    ? "Mujer"
                    : selected.sexo === "H"
                    ? "Hombre"
                    : "—"}
                </Pill>
                <Pill>
                  {selected.edad ? `${selected.edad} años` : "Edad —"}
                </Pill>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => selected && askEliminar(selected.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#EADACB] bg-white px-3 py-1.5 text-sm font-semibold text-[#BC5F36] hover:bg-[#FFF4E7]"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        open={confirmOpen}
        nombre={
          selected ? `${selected.nombres} ${selected.apellidos}` : undefined
        }
        onCancel={() => {
          setConfirmOpen(false);
          setToDeleteId(null);
        }}
        onConfirm={handleConfirmEliminar}
      />
    </div>
  );
}
