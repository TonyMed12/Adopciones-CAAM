"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listarCitasVeterinariasAdmin,
  cambiarEstadoCitaVeterinaria,
} from "@/citas/citas-veterinarias-actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import { Button } from "@/components/ui/Button";

export default function GestionCitasVeterinariasPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");

  useEffect(() => {
    async function fetchCitas() {
      try {
        const data = await listarCitasVeterinariasAdmin();
        setRows(data);
      } catch (error) {
        console.error("Error cargando citas veterinarias:", error);
        toast.error("Error al cargar las citas veterinarias.");
      } finally {
        setLoading(false);
      }
    }

    fetchCitas();
  }, []);

  const aprobar = async (id: string) => {
    const confirmed = await toastConfirm("¿Aprobar esta cita veterinaria?");
    if (!confirmed) return;

    try {
      await cambiarEstadoCitaVeterinaria(id, "aprobada");
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "aprobada" } : r))
      );
      toast.success("Cita aprobada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar la cita.");
    }
  };

  const cancelar = async (id: string) => {
    const confirmed = await toastConfirm("¿Cancelar esta cita veterinaria?");
    if (!confirmed) return;

    try {
      await cambiarEstadoCitaVeterinaria(id, "cancelada");
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r))
      );
      toast.success("Cita cancelada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al cancelar la cita.");
    }
  };

  const totales = useMemo(
    () => ({
      pendientes: rows.filter((r) => r.estado === "pendiente").length,
      aprobadas: rows.filter((r) => r.estado === "aprobada").length,
      canceladas: rows.filter((r) => r.estado === "cancelada").length,
    }),
    [rows]
  );

  const rowsFiltradas =
    filtroEstado === "todas"
      ? rows
      : rows.filter((r) => r.estado === filtroEstado);

  const rowsBuscadas = rowsFiltradas.filter(
    (r) =>
      r.mascota_nombre.toLowerCase().includes(query.toLowerCase()) ||
      r.adoptante_nombre.toLowerCase().includes(query.toLowerCase())
  );

  if (loading)
    return (
      <div className="p-6 text-center text-sm text-[#7a5c49] animate-pulse">
        Cargando citas...
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Gestión de citas veterinarias</h1>
        <p className="text-sm text-gray-600">
          Revisa y aprueba las citas veterinarias agendadas por adoptantes.
        </p>
      </div>

      {/* Contadores */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
          Pendientes: {totales.pendientes}
        </span>
        <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
          Aprobadas: {totales.aprobadas}
        </span>
        <span className="px-2 py-1 text-sm rounded-md border bg-red-50 text-red-700">
          Canceladas: {totales.canceladas}
        </span>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar por adoptante o mascota..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-[#fff7ef] text-[#8B4513] text-sm uppercase">
            <tr>
              <th className="p-3 text-left">Adoptante</th>
              <th className="p-3 text-left">Mascota</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Motivo</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rowsBuscadas.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No se encontraron citas.
                </td>
              </tr>
            ) : (
              rowsBuscadas.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-orange-50 transition text-sm"
                >
                  <td className="p-3">{r.adoptante_nombre}</td>
                  <td className="p-3 flex items-center gap-2">
                    {r.mascota_imagen && (
                      <img
                        src={r.mascota_imagen}
                        alt={r.mascota_nombre}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    {r.mascota_nombre}
                  </td>
                  <td className="p-3">
                    {new Date(r.fecha_cita).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-3">{r.motivo}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        r.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.estado === "aprobada"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {r.estado === "pendiente" ? (
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => aprobar(r.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelar(r.id)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic text-xs">
                        {r.estado === "aprobada" ? "Aprobada" : "Cancelada"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
