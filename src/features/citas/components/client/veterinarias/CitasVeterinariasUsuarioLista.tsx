"use client";

import { Filter } from "lucide-react";

export default function CitasVeterinariasUsuarioLista({
  citas,
  filtro,
  setFiltro,
  obtenerMascota,
}: {
  citas: any[];
  filtro: string;
  setFiltro: (f: any) => void;
  obtenerMascota: (id: string) => string;
}) {
  const estadoColor = {
    pendiente: "text-orange-700 bg-orange-50",
    aprobada: "text-green-700 bg-green-50",
    cancelada: "text-red-700 bg-red-50",
  } as const;

  const citasFiltradas =
    filtro === "todas" ? citas : citas.filter((c) => c.estado === filtro);

  return (
    <div>
      {/* Filtro */}
      <div className="flex justify-end mt-6 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8B4513]" />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as any)}
            className="border rounded-lg px-3 py-1 text-sm text-[#8B4513] bg-[#FFF8F3] focus:ring-[#8B4513] focus:outline-none"
          >
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FFF1E6] text-[#8B4513]">
            <tr>
              <th className="px-4 py-3 text-left">Mascota</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Motivo</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>

          <tbody>
            {citasFiltradas.map((cita) => {
              const fecha = new Date(cita.fecha_cita);
              const fechaStr = fecha.toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const horaStr = fecha.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const mascota = obtenerMascota(cita.adopcion_id);

              return (
                <tr
                  key={cita.id}
                  className="border-t hover:bg-[#FFF8F3] transition"
                >
                  <td className="px-4 py-3 font-semibold text-[#8B4513]">
                    {mascota}
                  </td>
                  <td className="px-4 py-3 font-medium">{fechaStr}</td>
                  <td className="px-4 py-3 font-medium">{horaStr}</td>
                  <td className="px-4 py-3">{cita.motivo}</td>
                  <td
                    className={`px-4 py-3 rounded-lg ${estadoColor[cita.estado]}`}
                  >
                    {cita.estado.charAt(0).toUpperCase() +
                      cita.estado.slice(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="grid sm:hidden gap-4 mt-4">
        {citasFiltradas.map((cita) => {
          const fecha = new Date(cita.fecha_cita);
          const fechaStr = fecha.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const horaStr = fecha.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const mascota = obtenerMascota(cita.adopcion_id);

          return (
            <div
              key={cita.id}
              className="bg-white border border-[#E5D1B8] rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#8B4513]">{mascota}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${estadoColor[cita.estado]}`}
                >
                  {cita.estado}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                <b>Fecha:</b> {fechaStr}
              </p>
              <p className="text-sm text-gray-700">
                <b>Hora:</b> {horaStr}
              </p>

              {cita.motivo && (
                <p className="text-sm text-gray-700 mt-1">
                  <b>Motivo:</b> {cita.motivo}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
