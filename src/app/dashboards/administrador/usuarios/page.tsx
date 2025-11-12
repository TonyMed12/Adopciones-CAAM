"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { listarUsuarios, eliminarUsuario, actualizarDocumentoStatus, obtenerUrlDocumento } from "@/usuarios/usuarios-actions";
import type { PerfilConDocumentos } from "@/usuarios/usuarios";
import PageHead from "@/components/layout/PageHead";

// Paleta del proyecto Adopciones
// primario: #BC5F36, acento: #FF8414, fondo suave: #FFF4E7, bordes: #EADACB, texto: #2B1B12

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12] ${props.className || ""
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
  const [usuarios, setUsuarios] = useState<PerfilConDocumentos[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PerfilConDocumentos | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  /** Cargar usuarios reales */
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await listarUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter(
      (u) =>
        u.nombres.toLowerCase().includes(q) ||
        u.apellido_paterno.toLowerCase().includes(q) ||
        u.apellido_materno?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [query, usuarios]);

  const askEliminar = (id: string) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmEliminar = async () => {
    if (!toDeleteId) return;
    try {
      await eliminarUsuario(toDeleteId);
      setUsuarios((prev) => prev.filter((u) => u.id !== toDeleteId));
      if (selected?.id === toDeleteId) setSelected(null);
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert("No se pudo eliminar el usuario");
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  return (
    <div className="min-h-[70vh] space-y-6">
      {/* Encabezado */}
      <div className="space-y-4">
        <PageHead
          title="Usuarios"
          subtitle="Listado general y panel de detalle."
        />

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 🔍 Buscador */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-[380px] rounded-2xl border border-[#EADACB] bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-[#BC5F36] transition-all">
            <Search className="h-4 w-4 text-[#8b6f5d]" />
            <input
              placeholder="Buscar por nombre o correo"
              className="flex-1 bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* ⚙️ Botón filtros (placeholder visual por ahora) */}
          <button
            className="inline-flex items-center gap-1 rounded-2xl border border-[#EADACB] bg-[#FFF9F3] px-3 py-2 text-sm font-semibold text-[#BC5F36] hover:bg-[#FFF4E7] transition"
            title="Filtros (próximamente)"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="py-12 text-center text-[#6b4f40]">
          Cargando usuarios...
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* Tabla usuarios */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-[#FFF4E7] border-b border-[#EADACB]">
                  <Th className="text-left">Nombre</Th>
                  <Th className="text-left">Correo</Th>
                  <Th className="text-left">Teléfono</Th>
                  <Th className="text-left">Ocupación</Th>
                  <Th className="text-left">Estado</Th>
                  <Th className="text-left">Documentos</Th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u, idx) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className={`cursor-pointer border-b border-[#F3E8DC] transition-colors ${u.documentos?.some((d) => d.status === "pendiente")
                      ? "bg-[#FFF9F3]"
                      : idx % 2 === 0
                        ? "bg-white"
                        : "bg-[#FFFDF9]"
                      } hover:bg-[#FFF4E7]`}
                  >
                    <td className="px-3 py-3 font-semibold text-[#2B1B12]">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full border border-[#EADACB] bg-white text-[#BC5F36]">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <div>
                            {u.nombres} {u.apellido_paterno}{" "}
                            {u.apellido_materno || ""}
                          </div>
                          <div className="text-[11px] text-[#8b6f5d]">
                            ID {u.id.slice(0, 6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#2B1B12]">{u.email}</td>
                    <td className="px-3 py-3 text-[#2B1B12]">
                      {u.telefono || "—"}
                    </td>
                    <td className="px-3 py-3 text-[#2B1B12]">
                      {u.ocupacion || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <Pill>{u.activo ? "Activo" : "Inactivo"}</Pill>
                    </td>
                    <td className="px-3 py-3 text-[#2B1B12]">
                      {u.documentos && u.documentos.length > 0 ? (
                        (() => {
                          const pendientes = u.documentos.filter(d => d.status === "pendiente").length;
                          const aprobados = u.documentos.filter(d => d.status === "aprobado").length;
                          const rechazados = u.documentos.filter(d => d.status === "rechazado").length;

                          let color = "#BC5F36";
                          let texto = "";

                          if (pendientes > 0) {
                            color = "#FF8414";
                            texto = `${pendientes} pendiente${pendientes > 1 ? "s" : ""}`;
                          } else if (rechazados > 0) {
                            color = "#E63946";
                            texto = `${rechazados} rechazado${rechazados > 1 ? "s" : ""}`;
                          } else if (aprobados === u.documentos.length && aprobados > 0) {
                            color = "#2A9D8F";
                            texto = "completos";
                          } else {
                            texto = "sin documentos";
                            color = "#8b6f5d";
                          }

                          return (
                            <span
                              style={{
                                color,
                                fontWeight: 600,
                                fontSize: "13px",
                                backgroundColor: `${color}20`,
                                borderRadius: "12px",
                                padding: "4px 8px",
                                display: "inline-block",
                              }}
                            >
                              {texto}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-[#8b6f5d] text-sm italic">—</span>
                      )}
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
          <aside className="sticky top-4 lg:w-[320px] w-full rounded-2xl border border-[#EADACB] bg-white p-6">
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
                      {selected.nombres} {selected.apellido_paterno}{" "}
                      {selected.apellido_materno || ""}
                    </h3>
                    <div className="text-[12px] text-[#8b6f5d]">Usuario</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-[#2B1B12]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#BC5F36]" />
                    <span>{selected.email}</span>
                  </div>

                  {selected.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#BC5F36]" />
                      <span>{selected.telefono}</span>
                    </div>
                  )}

                  {selected.ocupacion && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#BC5F36]" />
                      <span>{selected.ocupacion}</span>
                    </div>
                  )}
                </div>

                {selected.documentos && selected.documentos.length > 0 && (
                  <div className="pt-3 border-t border-[#EADACB] mt-3">
                    <h4 className="text-sm font-extrabold text-[#2B1B12] mb-2">
                      Documentos del usuario
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {selected.documentos.map((doc) => (
                        <li
                          key={doc.id}
                          className="flex items-center justify-between border border-[#EADACB] rounded-lg px-3 py-2 bg-[#FFF9F3]"
                        >
                          <div>
                            <p className="font-semibold text-[#2B1B12]">{doc.tipo}</p>
                            <p className="text-xs text-[#6b4f40] capitalize">
                              Estado:{" "}
                              <span
                                className={`font-semibold ${doc.status === "aprobado"
                                  ? "text-green-600"
                                  : doc.status === "rechazado"
                                    ? "text-red-600"
                                    : "text-[#BC5F36]"
                                  }`}
                              >
                                {doc.status || "pendiente"}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Botón para ver el documento */}
                            <a
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  const publicUrl = await obtenerUrlDocumento(doc.url);
                                  if (!publicUrl) {
                                    alert("No se pudo obtener la URL del documento");
                                    return;
                                  }
                                  window.open(publicUrl, "_blank");
                                } catch (err) {
                                  console.error("Error abriendo documento:", err);
                                  alert("Error al abrir el documento");
                                }
                              }}
                              className="text-[#BC5F36] text-xs font-semibold hover:underline cursor-pointer"
                            >
                              Ver
                            </a>

                            {/* Selector de estado */}
                            <select
                              className="text-xs border border-[#EADACB] rounded-md bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#BC5F36]"
                              value={doc.status || "pendiente"}
                              onChange={async (e) => {
                                const nuevoStatus = e.target.value;
                                try {
                                  await actualizarDocumentoStatus(doc.id, nuevoStatus);
                                  // Actualizar el estado local
                                  setSelected((prev) =>
                                    prev
                                      ? {
                                        ...prev,
                                        documentos: prev.documentos?.map((d) =>
                                          d.id === doc.id ? { ...d, status: nuevoStatus } : d
                                        ),
                                      }
                                      : prev
                                  );
                                } catch (err) {
                                  console.error("Error cambiando estado del documento:", err);
                                  alert("No se pudo actualizar el estado del documento");
                                }
                              }}
                            >
                              <option value="pendiente">pendiente</option>
                              <option value="aprobado">aprobado</option>
                              <option value="rechazado">rechazado</option>
                            </select>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        open={confirmOpen}
        nombre={
          selected
            ? `${selected.nombres} ${selected.apellido_paterno} ${selected.apellido_materno || ""}`
            : undefined
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
