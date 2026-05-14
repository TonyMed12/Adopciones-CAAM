"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Files,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  CalendarSearch,
  PawPrint,
  MapPin,
  FileText,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useIsMobile } from "@/hooks/useIsMobile";

type EstadoCita = "pendiente" | "aprobada" | "cancelada";

const ESTADO_META: Record<
  EstadoCita,
  {
    label: string;
    chip: string;
    accent: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pendiente: {
    label: "Pendiente",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    accent: "from-amber-400 to-amber-500",
    Icon: Clock,
  },
  aprobada: {
    label: "Aprobada",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    accent: "from-emerald-400 to-emerald-500",
    Icon: CheckCircle2,
  },
  cancelada: {
    label: "Cancelada",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    accent: "from-rose-400 to-rose-500",
    Icon: XCircle,
  },
};

const FILTROS: {
  id: "todas" | EstadoCita;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  activeChip: string;
}[] = [
  {
    id: "todas",
    label: "Todas",
    Icon: Files,
    activeChip:
      "data-[active=true]:bg-slate-100 data-[active=true]:text-slate-800 data-[active=true]:ring-slate-300",
  },
  {
    id: "pendiente",
    label: "Pendientes",
    Icon: Clock,
    activeChip:
      "data-[active=true]:bg-amber-100 data-[active=true]:text-amber-800 data-[active=true]:ring-amber-300",
  },
  {
    id: "aprobada",
    label: "Aprobadas",
    Icon: CheckCircle2,
    activeChip:
      "data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800 data-[active=true]:ring-emerald-300",
  },
  {
    id: "cancelada",
    label: "Canceladas",
    Icon: XCircle,
    activeChip:
      "data-[active=true]:bg-rose-100 data-[active=true]:text-rose-800 data-[active=true]:ring-rose-300",
  },
];

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
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const [page, setPage] = useState(1);

  const citasFiltradas = useMemo(() => {
    if (filtro === "todas") return citas;
    return citas.filter((c) => c.estado === filtro);
  }, [citas, filtro]);

  useEffect(() => {
    setPage(1);
  }, [filtro, citas, isMobile]);

  const totalPages = Math.ceil(citasFiltradas.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    return citasFiltradas.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [citasFiltradas, page, ITEMS_PER_PAGE]);

  return (
    <div>
      {/* ============ FILTROS ============ */}
      <div className="w-full overflow-x-auto custom-scroll -mx-1 px-1 mb-5">
        <div className="inline-flex items-center gap-2 min-w-max">
          {FILTROS.map((f) => {
            const isActive = filtro === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                data-active={isActive}
                className={`
                  inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl
                  px-3.5 py-2 text-sm font-semibold transition-all duration-200
                  border border-slate-200 bg-white text-slate-600
                  hover:border-[#f3d6bb] hover:text-[#BC5F36] hover:bg-[#fffaf4]
                  data-[active=true]:ring-1 data-[active=true]:shadow-sm
                  data-[active=true]:border-transparent
                  ${f.activeChip}
                `}
              >
                <f.Icon className="h-4 w-4" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ EMPTY STATE ============ */}
      {citasFiltradas.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9d8c5] bg-[#fffaf4] py-14 px-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#BC5F36] ring-1 ring-[#f3d6bb] shadow-sm mb-4">
            <CalendarSearch className="h-7 w-7" />
          </div>
          <p className="text-base font-extrabold text-[#8B4513]">
            No hay citas
          </p>
          <p className="text-sm text-[#7a5c49] mt-1 max-w-sm mx-auto">
            {filtro === "todas"
              ? "Aún no has agendado ninguna cita veterinaria."
              : `No tienes citas en estado "${filtro}".`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {paginated.map((cita) => {
            const fecha = new Date(cita.fecha_cita);
            const fechaCorta = fecha.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "short",
            });
            const anio = fecha.getFullYear();
            const diaSemana = fecha.toLocaleDateString("es-MX", {
              weekday: "long",
            });
            const horaStr = fecha.toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const mascota = obtenerMascota(cita.adopcion_id);
            const estado = (cita.estado as EstadoCita) || "pendiente";
            const meta = ESTADO_META[estado] ?? ESTADO_META.pendiente;

            return (
              <article
                key={cita.id}
                className="
                  relative overflow-hidden rounded-2xl bg-white border border-[#eadacb]
                  shadow-[0_4px_16px_-8px_rgba(43,27,18,0.08)]
                  hover:shadow-[0_16px_32px_-12px_rgba(43,27,18,0.18)]
                  transition-all duration-300 hover:-translate-y-[2px]
                "
              >
                {/* Barra lateral de estado */}
                <div
                  className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b ${meta.accent}`}
                  aria-hidden
                />

                <div className="p-4 sm:p-5 pl-5 sm:pl-6">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                        <PawPrint className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a88b77]">
                          Mascota
                        </p>
                        <h3 className="text-base font-extrabold text-[#8B4513] capitalize truncate">
                          {mascota}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`
                        inline-flex items-center gap-1 rounded-full px-2.5 py-1
                        text-[10px] font-bold uppercase tracking-wider
                        ring-1 ${meta.chip} shrink-0
                      `}
                    >
                      <meta.Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                  </div>

                  {/* Fecha destacada + hora */}
                  <div className="flex items-center gap-3 rounded-xl bg-[#fffaf4] border border-[#f3d6bb]/60 p-3 mb-3">
                    <div className="grid place-items-center h-12 w-12 rounded-xl bg-white text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                      <div className="text-center leading-none">
                        <p className="text-[9px] font-bold uppercase tracking-wider">
                          {fechaCorta.split(" ")[1]?.replace(".", "") || ""}
                        </p>
                        <p className="text-base font-extrabold tabular-nums">
                          {fechaCorta.split(" ")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#8B4513] capitalize">
                        {diaSemana}, {anio}
                      </p>
                      <p className="text-sm text-[#7a5c49] flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-bold tabular-nums">
                          {horaStr}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Motivo */}
                  {cita.motivo && (
                    <div className="flex items-start gap-2 text-sm text-slate-700 mb-2">
                      <FileText className="h-4 w-4 text-[#BC5F36] mt-0.5 shrink-0" />
                      <p className="leading-relaxed">
                        <span className="font-bold text-[#8B4513]">
                          Motivo:{" "}
                        </span>
                        {cita.motivo}
                      </p>
                    </div>
                  )}

                  {/* Ubicación */}
                  <div className="flex items-center gap-1.5 text-xs text-[#a88b77] mt-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>CAAM - Centro de Atención Animal de Morelia</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ============ PAGINACIÓN ============ */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={citasFiltradas.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemsLabel="citas"
            onChange={(n) => {
              setPage(n);
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 10);
            }}
          />
        </div>
      )}
    </div>
  );
}
