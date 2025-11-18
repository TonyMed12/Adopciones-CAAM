"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import {
  Loader2,
  CheckCircle2,
  CalendarDays,
  Info,
  PawPrint,
} from "lucide-react";
import dayjs from "dayjs";
import SeguimientoForm from "@/components/seguimiento/SeguimientoForm";
import ModalInfoSeguimiento from "@/components/seguimiento/ModalInfoSeguimiento";
import ModalSeguimiento from "@/components/seguimiento/ModalSeguimiento";

export default function SeguimientoMascotasPage() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal "Cómo funciona el seguimiento"
  const [infoOpen, setInfoOpen] = useState(false);

  // Modal de subir evidencia
  const [seguimientoOpen, setSeguimientoOpen] = useState(false);
  const [seguimientoActual, setSeguimientoActual] = useState<{
    adopcionId: string;
    fecha: string;
    fechaFormateada: string;
  } | null>(null);

  useEffect(() => {
    const cargarSeguimientos = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("id, email")
        .eq("id", user.id)
        .single();

      if (!perfil) {
        setLoading(false);
        return;
      }

      const { data: adopciones } = await supabase
        .from("adopciones")
        .select(
          `
          id,
          fecha_adopcion,
          solicitudes_adopcion (
            usuario_id,
            mascota_id,
            mascotas ( nombre, raza_id, imagen_url )
          )
        `
        )
        .order("fecha_adopcion", { ascending: false });

      const adopcionesUsuario = (adopciones || []).filter(
        (a) => a.solicitudes_adopcion?.usuario_id === perfil.id
      );

      const listaMascotas = await Promise.all(
        adopcionesUsuario.map(async (a) => {
          const mascota = a.solicitudes_adopcion?.mascotas;
          const fechaBase = dayjs(a.fecha_adopcion);

          const fechasProgramadas = [
            { nombre: "1 semana", fecha: fechaBase.add(7, "day") },
            { nombre: "1 mes", fecha: fechaBase.add(1, "month") },
            { nombre: "2 meses", fecha: fechaBase.add(2, "month") },
            { nombre: "6 meses", fecha: fechaBase.add(6, "month") },
          ];

          const { data: segs } = await supabase
            .from("seguimiento_adopcion")
            .select("fecha_seguimiento, completado")
            .eq("adopcion_id", a.id);

          const completados = new Set(
            (segs || []).map((s) =>
              dayjs(s.fecha_seguimiento).format("YYYY-MM-DD")
            )
          );

          const seguimientos = fechasProgramadas.map((f) => {
            const fecha = f.fecha; // dayjs object
            const hoy = dayjs();

            const fechaStr = fecha.format("YYYY-MM-DD");
            const diff = fecha.startOf("day").diff(hoy.startOf("day"), "day");

            let estado = "Pendiente";

            if (completados.has(fechaStr)) {
              estado = "Completado";
            } else if (fecha.isSame(hoy, "day")) {
              estado = "Activo";
            } else if (diff <= 3 && diff > 0) {
              estado = "Próximo";
            }

            return {
              nombre: f.nombre,
              fecha: fechaStr,
              estado,
            };
          });

          return {
            id: a.id,
            nombre: mascota?.nombre,
            raza: mascota?.raza_id || "Sin raza",
            imagen: mascota?.imagen_url || "/placeholder.png",
            fechaAdopcion: fechaBase.format("DD/MM/YYYY"),
            seguimientos,
          };
        })
      );

      setMascotas(listaMascotas);
      setLoading(false);
    };

    cargarSeguimientos();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-[#8B4513]">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        Cargando seguimientos...
      </div>
    );

  const getEstadoChip = (estado: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (estado.toLowerCase()) {
      case "completado":
        return `${base} bg-green-100 text-green-700`;
      case "activo":
        return `${base} bg-[#FDE68A] text-[#8B4513]`;
      case "próximo":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-gray-100 text-gray-500`;
    }
  };

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
              {/* ---------------------- HEADER ---------------------- */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-5">
                <img
                  src={
                    m.imagen?.startsWith("http") ? m.imagen : "/placeholder.png"
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

                  {/* INFO */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3 mx-auto sm:mx-0"
                    onClick={() => setInfoOpen(true)}
                  >
                    <Info size={16} />  Cómo funciona el seguimiento
                  </Button>
                </div>
              </div>

              {/* ---------------------- SEGUIMIENTOS ---------------------- */}
              <div className="grid gap-3">
                {m.seguimientos.map((s, i: number) => (
                  <div
                    key={`${m.id}-${i}`}
                    className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 w-full border border-[#E5D1B8] rounded-xl px-4 py-3 bg-white"
                  >
                    {/* IZQUIERDA */}
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

                    {/* DERECHA */}
                    <div className="flex items-center gap-3">
                      <span className={getEstadoChip(s.estado)}>
                        {s.estado}
                      </span>

                      {s.estado === "Completado" ? (
                        <CheckCircle2 className="text-green-600" size={20} />
                      ) : s.estado === "Activo" ? (
                        <Button
                          size="sm"
                          className="bg-[#BC5F36] text-white"
                          onClick={() => {
                            setSeguimientoActual({
                              adopcionId: m.id,
                              fecha: s.fecha,
                              fechaFormateada:
                                dayjs(s.fecha).format("DD/MM/YYYY"),
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

      {/* Modal: Cómo funciona el seguimiento */}
      <ModalInfoSeguimiento
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />

      {/* Modal: Formulario de seguimiento */}
      {seguimientoActual && (
        <ModalSeguimiento
          open={seguimientoOpen}
          onClose={() => setSeguimientoOpen(false)}
          titulo={`Seguimiento — ${seguimientoActual.fechaFormateada}`}
        >
          <SeguimientoForm
            adopcionId={seguimientoActual.adopcionId}
            fechaProgramada={seguimientoActual.fecha}
            onSuccess={() => window.location.reload()}
          />
        </ModalSeguimiento>
      )}
    </div>
  );
}
