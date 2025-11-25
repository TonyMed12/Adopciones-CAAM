"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "@/utils/calendarLocalizer";
import {
  actualizarEstadoCita,
  evaluarCita,
} from "@/features/citas/actions/citas-actions";
import { useCitas } from "@/features/citas/hooks/useCitas";
import { useReprogramarCita } from "@/features/citas/hooks/useReprogramarCita";
import { Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import PageHead from "@/components/layout/PageHead";
import CitasTable from "@/features/citas/components/client/CitasTAble";
import CitaEvalModal from "@/features/citas/components/client/CitasEvalModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

import CitaReprogramarModal from "@/features/citas/components/client/CitaReprogramarModal";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type Cita = CitaType;

export default function GestionCitasPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const { data: citas = [], isLoading } = useCitas();
  const { mutate: reprogramar, isPending: isReprogramando } = useReprogramarCita();

  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<"todas" | "programada" | "completada" | "cancelada" | "aprobada">("todas");

  const [view, setView] = useState<"tabla" | "calendario">("tabla");

  // Modal reprogramar
  const [modalOpen, setModalOpen] = useState(false);
  const [edicionId, setEdicionId] = useState<string | null>(null);
  const [formFecha, setFormFecha] = useState<string>("");
  const [formHora, setFormHora] = useState<string>("");

  // Modal evaluación
  const [evalOpen, setEvalOpen] = useState(false);
  const [evalTarget, setEvalTarget] = useState<Cita | null>(null);

  useBodyScrollLock(modalOpen);


  /* FILTROS + BÚSQUEDA */
  const citasFiltradas = useMemo(() => {
    const q = query.toLowerCase().trim();

    return citas.filter((c) => {
      const matchQ =
        !q ||
        c.mascota?.nombre?.toLowerCase().includes(q) ||
        c.usuario?.nombres?.toLowerCase().includes(q) ||
        c.usuario?.email?.toLowerCase().includes(q);

      let matchEstado = true;

      if (filtroEstado === "aprobada") {
        // aprobada = asistió + buena_aprobada
        matchEstado =
          c.asistencia === "asistio" &&
          c.interaccion === "buena_aprobada";
      } else if (filtroEstado !== "todas") {
        // otros filtros usan directamente el estado
        matchEstado = c.estado === filtroEstado;
      }

      return matchQ && matchEstado;
    });
  }, [citas, query, filtroEstado]);

  /* PAGINACIÓN */
  const {
    slice: paginated,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination(citasFiltradas, ITEMS_PER_PAGE);

  /* CALENDARIO */
  const buildDate = (d: string, t: string) => {
    const hhmm = t.length > 5 ? t.slice(0, 5) : t;
    return new Date(`${d}T${hhmm}:00`);
  };

  const events = useMemo(
    () =>
      citas.map((c) => ({
        id: c.id,
        title: `${c.usuario?.nombres ?? "—"} · ${c.mascota?.nombre ?? "Mascota"
          }`,
        start: buildDate(c.fecha_cita, c.hora_cita),
        end: new Date(buildDate(c.fecha_cita, c.hora_cita).getTime() + 30 * 60 * 1000),
        resource: c,
        allDay: false,
      })),
    [citas]
  );

  /* HANDLERS */

  const openEdit = (c: Cita) => {
    setEdicionId(c.id);
    setFormFecha(c.fecha_cita);
    setFormHora(c.hora_cita.slice(0, 5));
    setModalOpen(true);
  };

  const closeModalReprogramar = () => {
    setModalOpen(false);
  };

  const onSubmitModal = () => {
    const ocupado = citas.some(c =>
      c.fecha_cita === formFecha &&
      c.hora_cita.slice(0, 5) === formHora &&
      c.id !== edicionId
    );

    if (ocupado) {
      return toast.error("Ese horario ya está ocupado");
    }

    // Ejecutar mutation
    reprogramar(
      {
        id: edicionId!,
        fecha: formFecha,
        hora: formHora,
      },
      {
        onSuccess: () => {
          closeModalReprogramar();
          toast.success("Cita reprogramada");
        },
        onError: () => {
          toast.error("Error al reprogramar");
        },
      }
    );
  };


  const cancelarCita = async (id: string) => {
    const ok = await toastConfirm("¿Cancelar esta cita?");
    if (!ok) return;

    try {
      const updated = await actualizarEstadoCita(id, "cancelada");
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? (updated as any) : c))
      );
    } catch {
      toast.error("No se pudo cancelar");
    }
  };

  const openEval = (c: Cita) => {
    setEvalTarget(c);
    setEvalOpen(true);
  };

  const applyEvaluation = async (payload: any) => {
    if (!evalTarget) return;

    const nuevoEstado =
      payload.asistencia === "asistio" ? "completada" : "cancelada";

    // Optimista
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

    // Servidor
    try {
      const updated = await evaluarCita(evalTarget.id, nuevoEstado, payload);
      setCitas((prev) =>
        prev.map((c) => (c.id === evalTarget.id ? (updated as any) : c))
      );
      toast.success("Evaluación guardada");
    } catch {
      toast.error("No se pudo guardar");
    }
  };

  if (isLoading)
    return (
      <div className="py-12 text-center text-[#6b4f40]">
        Cargando citas...
      </div>
    );

  return (
    <div className="min-h-[70vh] space-y-6 transition-all">
      {/* HEADER */}
      <PageHead
        title="Gestión de citas de adopción"
        subtitle="Administra todas las citas de adopción programadas."
      />

      {/* FILTROS Y BUSCADOR */}
      <div className="space-y-6">

        {/* Toggle Tabla / Calendario */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-[#EADACB] overflow-hidden">
            <button
              className={`px-4 py-2 text-sm ${view === "tabla"
                ? "bg-[#FFF4E7] text-[#2B1B12] font-semibold"
                : "bg-white text-[#6b4f40]"
                }`}
              onClick={() => setView("tabla")}
            >
              Tabla
            </button>

            <button
              className={`px-4 py-2 text-sm ${view === "calendario"
                ? "bg-[#FFF4E7] text-[#2B1B12] font-semibold"
                : "bg-white text-[#6b4f40]"
                }`}
              onClick={() => setView("calendario")}
            >
              Calendario
            </button>
          </div>
        </div>

        {/* KPI CHIPS COMO FILTROS */}
        <div className="flex flex-wrap gap-3 pt-1">

          {/* Programadas */}
          <button
            onClick={() => setFiltroEstado("programada")}
            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
                ${filtroEstado === "programada"
                ? "bg-yellow-200 text-yellow-900 border-yellow-500 shadow-sm scale-[1.03]"
                : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"}
            `}
          >
            Programadas: {citas.filter((c) => c.estado === "programada").length}
          </button>

          {/* Completadas */}
          <button
            onClick={() => setFiltroEstado("completada")}
            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
                ${filtroEstado === "completada"
                ? "bg-green-200 text-green-900 border-green-600 shadow-sm scale-[1.03]"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}
            `}
          >
            Completadas: {citas.filter((c) => c.estado === "completada").length}
          </button>

          {/* Canceladas */}
          <button
            onClick={() => setFiltroEstado("cancelada")}
            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
                ${filtroEstado === "cancelada"
                ? "bg-gray-300 text-gray-900 border-gray-600 shadow-sm scale-[1.03]"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
            `}
          >
            Canceladas: {citas.filter((c) => c.estado === "cancelada").length}
          </button>

          {/* Aprobadas (asistió + buena_aprobada) */}
          <button
            onClick={() => setFiltroEstado("aprobada")}
            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold flex items-center gap-1 transition
                ${filtroEstado === "aprobada"
                ? "bg-green-200 text-green-900 border-green-600 shadow-sm scale-[1.03]"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              }
            `}
          >
            <CheckCircle size={14} />
            Aprobadas:{" "}
            {
              citas.filter(
                (c) =>
                  c.asistencia === "asistio" &&
                  c.interaccion === "buena_aprobada"
              ).length
            }
          </button>

          {/* Botón para limpiar filtro */}
          {filtroEstado !== "todas" && (
            <button
              onClick={() => setFiltroEstado("todas")}
              className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-[#6b4f40] hover:bg-gray-50"
            >
              Mostrar todas
            </button>
          )}
        </div>
      </div>

      {/* Buscador */}
      <div className="flex items-center rounded-full border border-[#EADACB] bg-white px-4 py-2 w-full md:w-96 shadow-sm">
        <Search className="h-4 w-4 text-[#BC5F36]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por usuario, mascota o correo"
          className="ml-2 w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* CONTENIDO */}
      {view === "tabla" ? (
        <>
          <CitasTable
            items={paginated}
            onReprogramar={openEdit}
            onCancelar={cancelarCita}
            onEvaluar={openEval}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={citasFiltradas.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemsLabel="citas"
            onChange={(p) => {
              if (p > page) nextPage();
              else if (p < page) prevPage();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 10);
            }}
          />
        </>
      ) : (

        /* VISTA CALENDARIO */
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
            onSelectEvent={(e: any) => openEdit(e.resource)}
          />
        </div>
      )}

      {modalOpen &&
        createPortal(
          <CitaReprogramarModal
            open={modalOpen}
            onClose={closeModalReprogramar}
            onSubmit={onSubmitModal}
            isSaving={isReprogramando}
            fecha={formFecha}
            hora={formHora}
            onFechaChange={setFormFecha}
            onHoraChange={setFormHora}
            cita={citas.find(c => c.id === edicionId) || null}
            citas={citas}
          />,
          document.body
        )
      }


      {/* MODAL EVALUACIÓN */}
      <CitaEvalModal
        open={evalOpen}
        onClose={() => {
          setEvalOpen(false);
          setEvalTarget(null);
        }}
        onConfirm={applyEvaluation}
        citaLabel={
          evalTarget
            ? `${evalTarget.usuario?.nombres} — ${evalTarget.mascotas?.nombre}`
            : ""
        }
        defaultAsistencia={evalTarget?.asistencia ?? null}
        defaultInteraccion={evalTarget?.interaccion ?? null}
        defaultNota={evalTarget?.nota ?? ""}
      />
    </div>
  );
}
