"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Loader2,
  CheckCircle2,
  CalendarDays,
  Info,
  PawPrint,
} from "lucide-react";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";

import { useSeguimientoMascotasQuery } from "@/features/seguimiento/hooks/useSeguimientoMacostasQuery";

import SeguimientoForm from "@/features/seguimiento/components/client/SeguimientoForm";
import ModalInfoSeguimiento from "@/features/seguimiento/components/client/ModalInfoSeguimiento";
import ModalSeguimiento from "@/features/seguimiento/components/client/ModalSeguimiento";
import { getEstadoChip } from "@/features/seguimiento/utils/estadoChip";

export default function SeguimientoMascotasPage() {
  const queryClient = useQueryClient();

  // 🔹 DATA
  const {
    data: mascotas = [],
    isLoading,
  } = useSeguimientoMascotasQuery();

  // 🔹 MODALES
  const [infoOpen, setInfoOpen] = useState(false);
  const [seguimientoOpen, setSeguimientoOpen] = useState(false);
  const [seguimientoActual, setSeguimientoActual] = useState<{
    adopcionId: string;
    fecha: string;
    fechaFormateada: string;
  } | null>(null);

  // 🔹 LOADING
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-[#8B4513]">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        Cargando seguimientos...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-[#8B4513] text-center mb-10">
        Seguimiento de mis mascotas
      </h1>

      {mascotas.length === 0 ? (
        <p className="text-center text-gray-600">
          No tienes mascotas adoptadas aún.
        </p>
      ) : (
        <div className="grid gap-8">
          {mascotas.map((m) => (
            <div
              key={m.id}
              className="bg-[#FFF8F0] border border-[#E5D1B8] rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            >
              {/* ---------- HEADER ---------- */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-5">
                <img
                  src={
                    m.imagen?.startsWith("http")
                      ? m.imagen
                      : "/placeholder.png"
                  }
                  alt={m.nombre}
                  className="rounded-2xl object-cover border border-[#BC5F36]/30 
                             w-32 h-32 sm:w-[120px] sm:h-[120px] mx-auto sm:mx-0"
                />

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-bold text-[#8B4513] flex items-center justify-center sm:justify-start gap-2">
                    {m.nombre} <PawPrint size={20} />
                  </h2>

                  <p className="text-sm text-[#5C3D2E] mt-1">
                    <b>Fecha de adopción:</b> {m.fechaAdopcion}
                  </p>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3 mx-auto sm:mx-0"
                    onClick={() => setInfoOpen(true)}
                  >
                    <Info size={16} /> Cómo funciona el seguimiento
                  </Button>
                </div>
              </div>

              {/* ---------- SEGUIMIENTOS ---------- */}
              <div className="grid gap-3">
                {m.seguimientos.map((s, i) => (
                  <div
                    key={`${m.id}-${i}`}
                    className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 w-full border border-[#E5D1B8] rounded-xl px-4 py-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-[#8B4513]" />
                      <div>
                        <p className="text-sm font-medium text-[#8B4513]">
                          {s.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          {dayjs(s.fecha).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={getEstadoChip(s.estado)}>
                        {s.estado}
                      </span>

                      {s.estado === "Completado" ? (
                        <CheckCircle2
                          className="text-green-600"
                          size={20}
                        />
                      ) : s.estado === "Activo" ? (
                        <Button
                          size="sm"
                          className="bg-[#BC5F36] text-white"
                          onClick={() => {
                            setSeguimientoActual({
                              adopcionId: m.id,
                              fecha: s.fecha,
                              fechaFormateada: dayjs(s.fecha).format(
                                "DD/MM/YYYY"
                              ),
                            });
                            setSeguimientoOpen(true);
                          }}
                        >
                          Subir evidencia
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled>
                          Pendiente
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- MODALES ---------- */}
      <ModalInfoSeguimiento
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />

      {seguimientoActual && (
        <ModalSeguimiento
          open={seguimientoOpen}
          onClose={() => setSeguimientoOpen(false)}
          titulo="Registra el seguimiento de tu mascota"
        >
          <SeguimientoForm
            adopcionId={seguimientoActual.adopcionId}
            fechaProgramada={seguimientoActual.fecha}
            onSuccess={() => {
              setSeguimientoOpen(false);
              queryClient.invalidateQueries({
                queryKey: ["seguimiento-mascotas"],
              });
            }}
          />
        </ModalSeguimiento>
      )}
    </div>
  );
}
