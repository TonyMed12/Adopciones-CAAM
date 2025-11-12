"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "@/utils/calendarLocalizer";
import {
  listarCitas,
  reprogramarCita,
  actualizarEstadoCita,
  evaluarCita
} from "@/citas/citas-actions";
import { Search, Filter, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import PageHead from "@/components/layout/PageHead";

import CitasTable, { type Cita as CitaType } from "@/components/citas/CitasTAble";
import CitaEvalModal from "@/components/citas/CitasEvalModal";

// Alias para mantener un solo tipo dentro de la página
type Cita = CitaType;

export default function GestionCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "programada" | "completada" | "cancelada">("todas");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"tabla" | "calendario">("tabla");

  // Reprogramar
  const [modalOpen, setModalOpen] = useState(false);
  const [edicionId, setEdicionId] = useState<string | null>(null);
  const [formFecha, setFormFecha] = useState<string>("");
  const [formHora, setFormHora] = useState<string>("");

  // Evaluación post-cita
  const [evalOpen, setEvalOpen] = useState(false);
  const [evalTarget, setEvalTarget] = useState<Cita | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listarCitas();
        const normalizadas: Cita[] = (data as any[]).map((c) => ({
          ...c,
          asistencia: c.asistencia ?? null,
          interaccion: c.interaccion ?? null,
          nota: c.nota ?? null,
        }));
        setCitas(normalizadas);
      } catch (err) {
        console.error("Error cargando citas:", err);
        toast.error("No se pudieron cargar las citas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const buildDate = (d: string, t: string) => {
    const hhmm = t.length > 5 ? t.slice(0, 5) : t;
    return new Date(`${d}T${hhmm}:00`);
  };

  const events = useMemo(
    () =>
      citas.map((c) => ({
        id: c.id,
        title: `${c.usuario?.nombres ?? "—"} · ${c.mascotas?.nombre ?? "Mascota"}`,
        start: buildDate(c.fecha_cita, c.hora_cita),
        end: new Date(buildDate(c.fecha_cita, c.hora_cita).getTime() + 30 * 60 * 1000),
        resource: c,
        allDay: false,
      })),
    [citas]
  );

  // Handlers: Reprogramar
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
      const diferenciaHoras = (citaFecha.getTime() - ahora.getTime()) / 1000 / 60 / 60;

      if (diferenciaHoras < 3) {
        toast.error("Debes programar con al menos 3 horas de anticipación.");
        return;
      }
      if (citaFecha < ahora) {
        toast.warning("No puedes programar una cita en una fecha u hora pasada.");
        return;
      }

      const hora = citaFecha.getHours();
      const minutos = citaFecha.getMinutes();
      const inicioPermitido = hora > 8 || (hora === 8 && minutos >= 30);
      const finPermitido = hora < 14 || (hora === 14 && minutos === 0);
      if (!inicioPermitido || !finPermitido) {
        toast.error("Las citas solo pueden programarse entre 8:30 am y 2:00 pm.");
        return;
      }

      const updated = await reprogramarCita(edicionId!, formFecha, formHora);
      setCitas((prev) => prev.map((c) => (c.id === edicionId ? (updated as any) : c)));
      setModalOpen(false);
      toast.success("Cita reprogramada");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo reprogramar la cita");
    }
  };

  // Handlers: Cancelar
  const cancelarCita = async (id: string) => {
    const confirmar = await toastConfirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;
    try {
      const actualizada = await actualizarEstadoCita(id, "cancelada");
      setCitas((prev) => prev.map((c) => (c.id === id ? (actualizada as any) : c)));
      toast.success("Cita cancelada");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cancelar la cita");
    }
  };

  // Handlers: Evaluar (asistencia/interacción)
  const openEval = (c: Cita) => {
    setEvalTarget(c);
    setEvalOpen(true);
  };

  const applyEvaluation = async (payload: {
    asistencia: "asistio" | "no_asistio_no_apto";
    interaccion: "buena_aprobada" | "no_apta" | null;
    nota?: string;
  }) => {
    if (!evalTarget) return;

    const nuevoEstado = payload.asistencia === "asistio" ? "completada" : "cancelada";

    // Actualización optimista
    setCitas((prev) =>
      prev.map((c) =>
        c.id === evalTarget.id
          ? {
            ...c,
            asistencia: payload.asistencia,
            interaccion: payload.interaccion,
            nota: payload.nota ?? null,
            estado: nuevoEstado,
          }
          : c
      )
    );

    setEvalOpen(false);
    setEvalTarget(null);

    try {
      const updated = await evaluarCita(evalTarget.id, nuevoEstado, {
        asistencia: payload.asistencia,
        interaccion: payload.interaccion,
        nota: payload.nota ?? null,
      });
      setCitas((prev) => prev.map((c) => (c.id === evalTarget.id ? (updated as any) : c)));
      toast.success("Evaluación guardada");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar la evaluación");
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-[#6b4f40]">Cargando citas...</div>;
  }

  return (
    <div className="min-h-[70vh] space-y-6 transition-all duration-300 ease-in-out">
      {/* HEADER GLOBAL DE PÁGINA */}
      <div className="space-y-4">
        <PageHead
          title="Gestión de citas de adopción"
          subtitle="Administra todas las citas de adopción programadas."
        />

        {/* FILTROS Y BUSCADOR */}
        <div className="flex flex-wrap items-center justify-start gap-3 md:justify-between">
          {/* 🔍 Buscador */}
          <div className="flex items-center gap-2 flex-[2] min-w-[220px] max-w-[340px] rounded-2xl border border-[#EADACB] bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-[#BC5F36] transition-all">
            <Search className="h-4 w-4 text-[#8b6f5d]" />
            <input
              placeholder="Buscar por usuario, mascota o correo"
              className="flex-1 bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* 🔽 Filtro rápido */}
          <div className="flex items-center gap-1 flex-shrink-0 border border-[#EADACB] rounded-2xl bg-white px-3 py-2">
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

          {/* 🗓️ Selector de vista */}
          <div className="flex flex-shrink-0 rounded-xl border border-[#EADACB] overflow-hidden">
            <button
              className={`px-3 py-2 text-sm ${view === "tabla"
                  ? "bg-[#FFF4E7] text-[#2B1B12] font-semibold"
                  : "bg-white text-[#6b4f40]"
                }`}
              onClick={() => setView("tabla")}
            >
              Tabla
            </button>
            <button
              className={`px-3 py-2 text-sm ${view === "calendario"
                  ? "bg-[#FFF4E7] text-[#2B1B12] font-semibold"
                  : "bg-white text-[#6b4f40]"
                }`}
              onClick={() => setView("calendario")}
            >
              Calendario
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
            Programadas: {citas.filter((c) => c.estado === "programada").length}
          </span>
          <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
            Completadas: {citas.filter((c) => c.estado === "completada").length}
          </span>
          <span className="px-2 py-1 text-sm rounded-md border bg-gray-50 text-gray-700">
            Canceladas: {citas.filter((c) => c.estado === "cancelada").length}
          </span>
          <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700 flex items-center gap-1">
            <CheckCircle size={14} /> Aprobadas:{" "}
            {citas.filter((c) => c.interaccion === "buena_aprobada").length}
          </span>
        </div>
      </div>

      {/* Contenido */}
      {view === "tabla" ? (
        <CitasTable
          items={citas}
          query={query}
          onQueryChange={setQuery}
          filtroEstado={filtroEstado}
          onReprogramar={openEdit}
          onFiltroEstadoChange={setFiltroEstado}
          onCancelar={cancelarCita}
          onEvaluar={openEval}
        />
      ) : (
        <div className="rounded-2xl border border-[#EADACB] bg-white p-3">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            views={["month", "week", "day"]}
            defaultView="week"
            popup
            min={new Date(0, 0, 0, 8, 0)}
            max={new Date(0, 0, 0, 15, 0)}
            step={30}
            selectable={false}
            onSelectEvent={(e: any) => {
              const citaFecha = new Date(`${e.resource.fecha_cita}T${e.resource.hora_cita}`);
              const ahora = new Date();
              if (citaFecha < ahora) {
                toast.error("No puedes reprogramar una cita que ya pasó.");
                return;
              }
              openEdit(e.resource);
            }}
            messages={{ next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
            dayPropGetter={(date) => {
              const now = new Date();
              const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
              const { estado, interaccion } = event.resource as Cita;
              let backgroundColor = "#FCD34D"; // programada
              let borderColor = "#EAB308";
              if (estado === "completada") {
                backgroundColor = "#86EFAC";
                borderColor = "#16A34A";
              } else if (estado === "cancelada") {
                backgroundColor = "#E5E7EB";
                borderColor = "#9CA3AF";
              }
              if (interaccion === "buena_aprobada") {
                backgroundColor = "#BBF7D0";
                borderColor = "#22C55E";
              }
              if (interaccion === "no_apta") {
                backgroundColor = "#FECACA";
                borderColor = "#EF4444";
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
                  <div className="absolute left-1/2 top-full z-10 hidden w-[240px] -translate-x-1/2 translate-y-2 rounded-lg border border-[#EADACB] bg-white p-3 text-xs shadow-lg opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-in-out">
                    <p className="font-bold text-[#2B1B12] mb-1">
                      {event.resource.usuario?.nombres || "Usuario desconocido"}
                    </p>
                    <p className="text-[#6b4f40] mb-1">
                      {event.resource.usuario?.email || "Sin correo"}
                    </p>
                    <p className="text-[#2B1B12] font-medium">
                      Mascota: <span className="font-semibold">{event.resource.mascotas?.nombre || "Sin asignar"}</span>
                    </p>
                    <p className="text-[#6b4f40] mt-1">
                      {new Date(event.start).toLocaleDateString("es-MX")} {event.resource.hora_cita?.slice(0, 5)}
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#EADACB] bg-white p-5 shadow-lg">
            <h3 className="text-lg font-extrabold text-[#2B1B12] mb-1">Reprogramar cita</h3>
            <p className="text-sm text-[#6b4f40] mb-4">
              <span className="font-semibold text-[#2B1B12]">
                {citas.find((c) => c.id === edicionId)?.usuario?.nombres || "Usuario desconocido"}
              </span>{" "}
              —{" "}
              <span className="italic">
                {citas.find((c) => c.id === edicionId)?.mascotas?.nombre || "Mascota no asignada"}
              </span>
            </p>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-[#2B1B12]">Nueva fecha</label>
                <input
                  type="date"
                  value={formFecha}
                  onChange={(e) => setFormFecha(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full rounded-md border border-[#EADACB] px-3 py-2 text-sm focus:ring-1 focus:ring-[#BC5F36]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#2B1B12]">Nueva hora</label>
                <select
                  value={formHora}
                  onChange={(e) => setFormHora(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#EADACB] px-3 py-2 text-sm focus:ring-1 focus:ring-[#BC5F36]"
                >
                  <option value="">Selecciona hora</option>
                  {[
                    "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
                    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
                  ].map((hora) => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#EADACB] bg-white px-3 py-1.5 text-sm font-semibold text-[#2B1B12] hover:bg-[#FFF4E7]"
              >
                Cancelar
              </button>
              <button
                onClick={onSubmitModal}
                className="rounded-lg bg-[#BC5F36] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal evaluación */}
      <CitaEvalModal
        open={evalOpen}
        onClose={() => {
          setEvalOpen(false);
          setEvalTarget(null);
        }}
        onConfirm={applyEvaluation}
        citaLabel={
          evalTarget
            ? `${evalTarget.usuario?.nombres ?? "Usuario"} — ${evalTarget.mascotas?.nombre ?? "Mascota"}`
            : ""
        }
        defaultAsistencia={evalTarget?.asistencia ?? null}
        defaultInteraccion={evalTarget?.interaccion ?? null}
        defaultNota={evalTarget?.nota ?? ""}
      />
    </div>
  );
}
