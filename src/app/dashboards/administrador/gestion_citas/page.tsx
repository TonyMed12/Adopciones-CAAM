"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "@/utils/calendarLocalizer";
import {
  listarCitas,
  reprogramarCita,
  actualizarEstadoCita,
} from "@/citas/citas-actions";
import { Search, Clock, CalendarClock, XCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";

type Cita = {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  estado: "programada" | "completada" | "cancelada";
  usuario?: { nombres?: string; email?: string } | null;
  mascotas?: { id: string; nombre: string } | null;
};

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

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "todas" | "programada" | "completada" | "cancelada"
  >("todas");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"tabla" | "calendario">("tabla");

  // Modal para reprogramar
  const [modalOpen, setModalOpen] = useState(false);
  const [edicionId, setEdicionId] = useState<string | null>(null);
  const [formFecha, setFormFecha] = useState<string>("");
  const [formHora, setFormHora] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const data = await listarCitas();
        setCitas(data as any);
      } catch (err) {
        console.error("Error cargando citas:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtradas = useMemo(() => {
    const q = query.toLowerCase().trim();
    return citas.filter((cita) => {
      const matchBusqueda =
        !q ||
        cita.mascotas?.nombre?.toLowerCase().includes(q) ||
        cita.usuario?.nombres?.toLowerCase().includes(q) ||
        cita.usuario?.email?.toLowerCase().includes(q);
      const matchEstado =
        filtroEstado === "todas" || cita.estado === filtroEstado;
      return matchBusqueda && matchEstado;
    });
  }, [query, citas, filtroEstado]);

  const buildDate = (d: string, t: string) => {
    const hhmm = t.length > 5 ? t.slice(0, 5) : t;
    return new Date(`${d}T${hhmm}:00`);
  };

  const events = useMemo(
    () =>
      citas.map((c) => ({
        id: c.id,
        title: `${c.usuario?.nombres ?? "—"} · ${
          c.mascotas?.nombre ?? "Mascota"
        }`,
        start: buildDate(c.fecha_cita, c.hora_cita),
        end: new Date(
          buildDate(c.fecha_cita, c.hora_cita).getTime() + 30 * 60 * 1000
        ),

        resource: c,
        allDay: false,
      })),
    [citas]
  );

  const openEdit = (c: Cita) => {
    setEdicionId(c.id);
    setFormFecha(c.fecha_cita);
    setFormHora((c.hora_cita || "").slice(0, 5));
    setModalOpen(true);
  };

  const onSubmitModal = async () => {
    try {
      if (!formFecha || !formHora) {
        toast.warning("Fecha y hora son obligatorias");
        return;
      }

      const ahora = new Date();
      const citaFecha = new Date(`${formFecha}T${formHora}:00`);
      const diferenciaHoras =
        (citaFecha.getTime() - ahora.getTime()) / 1000 / 60 / 60;

      // 1️⃣ Validar que sea al menos 3 h después
      if (diferenciaHoras < 3) {
        toast.error("Debes programar con al menos 3 horas de anticipación.");
        return;
      }

      // 1️⃣ Validar que la fecha no sea pasada
      if (citaFecha < ahora) {
        toast.warning("No puedes programar una cita en una fecha u hora pasada.");
        return;
      }

      // 2️⃣ Validar rango permitido (8:30 am a 2 pm)
      const hora = citaFecha.getHours();
      const minutos = citaFecha.getMinutes();

      const inicioPermitido = hora > 8 || (hora === 8 && minutos >= 30);
      const finPermitido = hora < 14 || (hora === 14 && minutos === 0);

      if (!inicioPermitido || !finPermitido) {
        toast.error("Las citas solo pueden programarse entre 8:30 am y 2:00 pm.");
        return;
      }

      const updated = await reprogramarCita(edicionId!, formFecha, formHora);
      setCitas((prev) =>
        prev.map((c) => (c.id === edicionId ? (updated as any) : c))
      );
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo reprogramar la cita");
    }
  };

  const cancelarCita = async (id: string) => {
    const confirmar = await toastConfirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;
    try {
      const actualizada = await actualizarEstadoCita(id, "cancelada");
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? (actualizada as any) : c))
      );
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cancelar la cita");
    }
  };

  if (loading)
    return (
      <div className="py-12 text-center text-[#6b4f40]">Cargando citas...</div>
    );

  return (
    <div className="min-h-[70vh] space-y-6 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B1B12] transition-all">
            Citas
          </h1>
          <p className="text-sm text-[#6b4f40] transition-all">
            Reprograma o cancela citas de adopción registradas por los usuarios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#EADACB] bg-white px-3 py-2 transition-all focus-within:ring-1 focus-within:ring-[#BC5F36]">
            <Search className="h-4 w-4 text-[#8b6f5d]" />
            <input
              placeholder="Buscar por usuario o mascota"
              className="w-60 bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Filtro rápido */}
          <div className="flex items-center gap-1 border border-[#EADACB] rounded-2xl bg-white px-2 py-1">
            <Filter size={14} className="text-[#BC5F36]" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="text-sm bg-transparent focus:outline-none text-[#2B1B12]"
            >
              <option value="todas">Todas</option>
              <option value="programada">Programadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          {/* Vista */}
          <div className="rounded-xl border border-[#EADACB] overflow-hidden">
            <button
              className={`px-3 py-2 text-sm transition-all ${
                view === "tabla"
                  ? "bg-[#FFF4E7] text-[#2B1B12] font-semibold"
                  : "bg-white text-[#6b4f40]"
              }`}
              onClick={() => setView("tabla")}
            >
              Tabla
            </button>
            <button
              className={`px-3 py-2 text-sm transition-all ${
                view === "calendario"
                  ? "bg-[#FFF4E7] text-[#2B1B12] font-semibold"
                  : "bg-white text-[#6b4f40]"
              }`}
              onClick={() => setView("calendario")}
            >
              Calendario
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {view === "tabla" ? (
        <div className="overflow-x-auto rounded-2xl border border-[#EADACB] bg-white transition-all duration-300">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF4E7] border-b border-[#EADACB]">
                <Th className="text-left">Usuario</Th>
                <Th className="text-left">Mascota</Th>
                <Th className="text-left">Fecha</Th>
                <Th className="text-left">Hora</Th>
                <Th className="text-left">Estado</Th>
                <Th className="text-left">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((cita, idx) => (
                <tr
                  key={cita.id}
                  className={`border-b border-[#F3E8DC] transition-colors duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#FFFDF9]"
                  } hover:bg-[#FFF4E7]`}
                >
                  <td className="px-3 py-3 text-[#2B1B12] font-medium transition-all">
                    {cita.usuario?.nombres || "—"}
                    <div className="text-xs text-[#8b6f5d]">
                      {cita.usuario?.email}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#2B1B12]">
                    {cita.mascotas?.nombre || "—"}
                  </td>
                  <td className="px-3 py-3 text-[#2B1B12]">
                    {new Date(cita.fecha_cita).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-3 py-3 text-[#2B1B12]">
                    <Clock className="inline-block mr-1 h-3 w-3 text-[#BC5F36]" />
                    {(cita.hora_cita || "").slice(0, 5)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`text-xs font-semibold rounded-full px-2 py-1 transition-all ${
                        cita.estado === "programada"
                          ? "bg-yellow-100 text-yellow-700"
                          : cita.estado === "completada"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {cita.estado}
                    </span>
                  </td>
                  <td className="px-3 py-3 flex gap-2">
                    {cita.estado !== "cancelada" && (
                      <>
                        <button
                          onClick={() => openEdit(cita)}
                          className="flex items-center gap-1 rounded-md border border-[#EADACB] px-2 py-1 text-xs font-medium text-[#2B1B12] hover:bg-[#FFF4E7] transition-all"
                        >
                          <CalendarClock size={14} />
                          Reprogramar
                        </button>
                        <button
                          onClick={() => cancelarCita(cita.id)}
                          className="flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 transition-all"
                        >
                          <XCircle size={14} />
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtradas.length === 0 && (
            <div className="py-8 text-center text-[#6b4f40] transition-all">
              No se encontraron citas.
            </div>
          )}
        </div>
      ) : (
        // Calendario (solo reprogramar)
        <div className="rounded-2xl border border-[#EADACB] bg-white p-3 transition-all">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            views={["month", "week", "day"]}
            defaultView="week"
            popup
            min={new Date(0, 0, 0, 8, 0)} // empieza 8:00 am
            max={new Date(0, 0, 0, 15, 0)} // termina 3:00 pm
            step={30} // ⏱️ cada 30 minutos
            selectable={false}
            onSelectEvent={(e: any) => {
              const citaFecha = new Date(
                `${e.resource.fecha_cita}T${e.resource.hora_cita}`
              );
              const ahora = new Date();

              if (citaFecha < ahora) {
                toast.error("No puedes reprogramar una cita que ya pasó.");
                return;
              }
              openEdit(e.resource);
            }}
            messages={{
              next: "Sig.",
              previous: "Ant.",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            dayPropGetter={(date) => {
              const now = new Date();
              const isPast =
                date <
                new Date(now.getFullYear(), now.getMonth(), now.getDate());
              return {
                style: {
                  backgroundColor: isPast ? "#F9F9F9" : "white",
                  color: isPast ? "#B0A7A0" : "#1F2937",
                  cursor: isPast ? "not-allowed" : "default",
                  transition: "all 0.3s ease",
                },
              };
            }}
            eventPropGetter={(event: any) => {
              const estado = event.resource.estado;
              let backgroundColor = "#FCD34D"; // amarillo programada
              let borderColor = "#EAB308";
              if (estado === "completada") {
                backgroundColor = "#86EFAC"; // verde
                borderColor = "#16A34A";
              } else if (estado === "cancelada") {
                backgroundColor = "#E5E7EB"; // gris
                borderColor = "#9CA3AF";
              }
              return {
                style: {
                  backgroundColor,
                  border: `1px solid ${borderColor}`,
                  color: "#1F2937",
                  borderRadius: "8px",
                  padding: "3px 4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                },
              };
            }}
            components={{
              event: ({ event }: any) => (
                <div className="relative group transition-all duration-300">
                  <div>{event.title}</div>
                  {/* Tooltip suave */}
                  <div className="absolute left-1/2 top-full z-10 hidden w-[240px] -translate-x-1/2 translate-y-2 rounded-lg border border-[#EADACB] bg-white p-3 text-xs shadow-lg opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-in-out">
                    <p className="font-bold text-[#2B1B12] mb-1">
                      {event.resource.usuario?.nombres || "Usuario desconocido"}
                    </p>
                    <p className="text-[#6b4f40] mb-1">
                      {event.resource.usuario?.email || "Sin correo"}
                    </p>
                    <p className="text-[#2B1B12] font-medium">
                      Mascota:{" "}
                      <span className="font-semibold">
                        {event.resource.mascotas?.nombre || "Sin asignar"}
                      </span>
                    </p>
                    <p className="text-[#6b4f40] mt-1">
                      {new Date(event.start).toLocaleDateString("es-MX")}{" "}
                      {event.resource.hora_cita?.slice(0, 5)}
                    </p>
                  </div>
                </div>
              ),
            }}
          />
        </div>
      )}

      {/* Modal reprogramar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md rounded-2xl border border-[#EADACB] bg-white p-5 shadow-lg animate-fadeIn">
            <h3 className="text-lg font-extrabold text-[#2B1B12] mb-1">
              Reprogramar cita
            </h3>

            <p className="text-sm text-[#6b4f40] mb-4">
              <span className="font-semibold text-[#2B1B12]">
                {citas.find((c) => c.id === edicionId)?.usuario?.nombres ||
                  "Usuario desconocido"}
              </span>{" "}
              —{" "}
              <span className="italic">
                {citas.find((c) => c.id === edicionId)?.mascotas?.nombre ||
                  "Mascota no asignada"}
              </span>
            </p>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-[#2B1B12]">
                  Nueva fecha
                </label>
                <input
                  type="date"
                  value={formFecha}
                  onChange={(e) => setFormFecha(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // 🔒 Bloquea fechas pasadas
                  className="mt-1 w-full rounded-md border border-[#EADACB] px-3 py-2 text-sm transition-all focus:ring-1 focus:ring-[#BC5F36] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#2B1B12]">
                  Nueva hora
                </label>
                <select
                  value={formHora}
                  onChange={(e) => setFormHora(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#EADACB] px-3 py-2 text-sm transition-all focus:ring-1 focus:ring-[#BC5F36] cursor-pointer"
                >
                  <option value="">Selecciona hora</option>
                  {[
                    "08:30",
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "11:30",
                    "12:00",
                    "12:30",
                    "13:00",
                    "13:30",
                    "14:00",
                  ].map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#EADACB] bg-white px-3 py-1.5 text-sm font-semibold text-[#2B1B12] hover:bg-[#FFF4E7] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={onSubmitModal}
                className="rounded-lg bg-[#BC5F36] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95 transition-all"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
