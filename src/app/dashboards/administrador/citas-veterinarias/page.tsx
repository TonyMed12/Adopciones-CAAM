"use client";

import { useEffect, useState, useMemo } from "react";
import {
  listarCitasVeterinariasAdmin,
  cambiarEstadoCitaVeterinaria,
} from "@/citas/citas-veterinarias-actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CalendarioVeterinarias from "@/components/citas/CalendarioVeterinarias";

export default function GestionCitasVeterinariasPage() {
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<
    "todas" | "pendiente" | "aprobada" | "cancelada"
  >("todas");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchCitas() {
      try {
        const data = await listarCitasVeterinariasAdmin();
        setCitas(data);
      } catch (err) {
        console.error("Error cargando citas veterinarias:", err);
        toast.error("Error al cargar las citas veterinarias.");
      } finally {
        setLoading(false);
      }
    }
    fetchCitas();
  }, []);

  const aprobarCita = async (id: string) => {
    try {
      await cambiarEstadoCitaVeterinaria(id, "aprobada");
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: "aprobada" } : c))
      );
      toast.success("Cita aprobada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar la cita.");
    }
  };

  const cancelarCita = async (id: string) => {
    try {
      await cambiarEstadoCitaVeterinaria(id, "cancelada");
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: "cancelada" } : c))
      );
      toast.success("Cita cancelada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al cancelar la cita.");
    }
  };

  const citasOrdenadas = useMemo(() => {
    const filtradas =
      filtro === "todas" ? citas : citas.filter((c) => c.estado === filtro);

    const buscadas = query
      ? filtradas.filter(
          (c) =>
            c.mascota_nombre.toLowerCase().includes(query.toLowerCase()) ||
            c.adoptante_nombre.toLowerCase().includes(query.toLowerCase())
        )
      : filtradas;

    return [...buscadas].sort(
      (a, b) =>
        new Date(a.fecha_cita).getTime() - new Date(b.fecha_cita).getTime()
    );
  }, [citas, filtro, query]);

  if (loading)
    return (
      <div className="p-6 text-center text-[#8B4513] animate-pulse">
        Cargando citas veterinarias...
      </div>
    );

  const totales = {
    pendientes: citas.filter((c) => c.estado === "pendiente").length,
    aprobadas: citas.filter((c) => c.estado === "aprobada").length,
    canceladas: citas.filter((c) => c.estado === "cancelada").length,
  };

  const proximasCitas = citasOrdenadas
    .filter((c) => new Date(c.fecha_cita) > new Date())
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#8B4513]">
          Gestión de citas veterinarias
        </h1>
        <p className="text-sm text-gray-600">
          Revisa y aprueba las citas veterinarias agendadas por adoptantes.
        </p>
      </div>

      {/* KPIs */}
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

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        {/* 🧾 Tabla */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-700 align-top">
            <thead className="bg-[#FFF6E5] text-[#8B4513]">
              <tr>
                <th className="px-4 py-3 font-semibold">Adoptante</th>
                <th className="px-4 py-3 font-semibold">Mascota</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Motivo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f5e6d3]">
              {citasOrdenadas.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#FFF8F0] transition-colors"
                >
                  <td className="px-4 py-3">{item.adoptante_nombre}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {item.mascota_imagen && (
                      <img
                        src={item.mascota_imagen}
                        alt={item.mascota_nombre}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    <span>{item.mascota_nombre}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {format(
                      new Date(item.fecha_cita),
                      "EEEE d 'de' MMMM, h:mm a",
                      { locale: es }
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.motivo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        item.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.estado === "aprobada"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.estado.charAt(0).toUpperCase() +
                        item.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.estado === "pendiente" ? (
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => aprobarCita(item.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelarCita(item.id)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Aprobada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📆 Panel lateral */}
        <div className="flex flex-col gap-4 self-start">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-[#8B4513] mb-3">
              Calendario de citas
            </h2>
            <CalendarioVeterinarias citas={citasOrdenadas} vistaCompacta />
          </div>

          {/* 🐾 Próximas citas */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-[#8B4513] mb-3">
              Próximas citas
            </h2>
            {proximasCitas.length === 0 ? (
              <p className="text-sm text-gray-500">No hay citas próximas.</p>
            ) : (
              <ul className="divide-y divide-[#FDE68A]">
                {proximasCitas.map((c) => (
                  <li
                    key={c.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-[#8B4513]">
                        {c.mascota_nombre}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(c.fecha_cita),
                          "EEEE d 'de' MMMM, h:mm a",
                          { locale: es }
                        )}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        c.estado === "aprobada"
                          ? "text-green-700"
                          : c.estado === "pendiente"
                          ? "text-yellow-700"
                          : "text-red-700"
                      }`}
                    >
                      {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
