"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { obtenerMascotaPorId } from "@/mascotas/mascotas-actions";
import { supabase } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import { PawPrint, CalendarDays, CheckCircle2, X } from "lucide-react";
import dayjs from "dayjs";

export default function SeguimientoPorMascotaPage() {
  const params = useParams();
  const mascotaId = params?.id as string;

  const [mascota, setMascota] = useState<any>(null);
  const [seguimientos, setSeguimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 estado para imagen ampliada
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  async function loadMascota() {
    const data = await obtenerMascotaPorId(mascotaId);
    setMascota(data);
  }

 async function loadSeguimientos() {
  const { data, error } = await supabase
    .from("seguimiento_adopcion")
    .select(`
      *,
      adopciones:adopciones (
        id,
        solicitudes_adopcion (
          mascota_id
        )
      )
    `)
    .eq("adopciones.solicitudes_adopcion.mascota_id", mascotaId)
    .order("fecha_seguimiento", { ascending: true });

  if (!error) {
    console.log("📌 SEGUIMIENTOS CARGADOS:", data);
    setSeguimientos(data || []);
  }
}


  useEffect(() => {
    async function load() {
      await loadMascota();
      await loadSeguimientos();
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-[#8B4513]">
        Cargando seguimiento...
      </div>
    );

  if (!mascota)
    return (
      <div className="text-center py-20 text-red-600">
        Mascota no encontrada.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      {/* HEADER */}
      <PageHead
        title={`Seguimiento: ${mascota.nombre}`}
        subtitle="Revisión de seguimientos registrados por el adoptante"
      />

      {/* INFO DE MASCOTA */}
      <div className="bg-[#FFF8F0] border border-[#E5D1B8] rounded-2xl p-6 flex gap-6 mb-10">
        <img
          src={mascota.imagen_url ?? "/placeholder.png"}
          className="w-40 h-40 rounded-xl object-cover border border-[#BC5F36]/40 cursor-pointer hover:opacity-90 transition"
          onClick={() => setZoomImage(mascota.imagen_url)}
        />

        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#8B4513] flex gap-2 items-center">
            {mascota.nombre}
            <PawPrint size={22} />
          </h2>

          <p className="text-sm text-[#5C3D2E] mt-1">
            <b>Raza:</b> {mascota.raza?.nombre}
          </p>
          <p className="text-sm text-[#5C3D2E]">
            <b>Especie:</b> {mascota.raza?.especie}
          </p>
          <p className="text-sm text-[#5C3D2E]">
            <b>Sexo:</b> {mascota.sexo === "h" ? "Hembra" : "Macho"}
          </p>
        </div>
      </div>

      {/* ------------------- LISTA DE SEGUIMIENTOS ------------------- */}
      <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
        Seguimientos registrados
      </h3>

      {seguimientos.length === 0 ? (
        <p className="text-gray-600 text-center py-10">
          Aún no hay seguimientos registrados para esta mascota.
        </p>
      ) : (
        <div className="grid gap-6">
          {seguimientos.map((s, i) => {
            console.log("📸 Fotos recibidas en seguimiento:", s.fotos_actuales);

            return (
              <div
                key={i}
                className="bg-white border border-[#E5D1B8] rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[#8B4513] font-semibold text-lg">
                      Seguimiento #{i + 1}
                    </p>
                    <p className="text-sm text-gray-600">
                      Programado para:{" "}
                      <b>{dayjs(s.fecha_seguimiento).format("DD/MM/YYYY")}</b>
                    </p>
                  </div>

                  {s.completado ? (
                    <CheckCircle2 className="text-green-600" size={26} />
                  ) : null}
                </div>

                {/* OBSERVACIONES */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[#8B4513] mb-1">
                    Observaciones del adoptante:
                  </p>
                  <p className="text-sm text-gray-700">{s.observaciones}</p>
                </div>

                {/* RECOMENDACIONES */}
                {s.recomendaciones && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#8B4513] mb-1">
                      Recomendaciones:
                    </p>
                    <p className="text-sm text-gray-700">
                      {s.recomendaciones}
                    </p>
                  </div>
                )}

                {/* CALIFICACIÓN */}
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <PawPrint
                      key={idx}
                      size={20}
                      className={
                        idx < (s.satisfaccion_adoptante ?? 0)
                          ? "text-[#BC5F36]"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* ---------------- GALERÍA ---------------- */}
                {Array.isArray(s.fotos_actuales) &&
                  s.fotos_actuales.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-[#8B4513] mb-2">
                        Evidencias:
                      </p>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {s.fotos_actuales.map((url: string, j: number) => (
                          <img
                            key={j}
                            src={url}
                            className="w-full h-28 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                            onClick={() => setZoomImage(url)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* 🔥 Si NO es array, lo mostramos para depurar */}
                {!Array.isArray(s.fotos_actuales) && s.fotos_actuales && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    ⚠ fotos_actuales NO es un array.  
                    Valor recibido:
                    <pre className="text-xs mt-1 bg-white p-2 rounded">
                      {JSON.stringify(s.fotos_actuales, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- MODAL ZOOM ---------------- */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
            >
              <X size={22} className="text-gray-700" />
            </button>

            <img
              src={zoomImage}
              className="w-full max-h-[90vh] object-contain rounded-xl border border-white shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
