"use client";

import useSWR from "swr";
import { obtenerMascotasAdoptadas } from "@/usuarios/usuario-mascotas-actions";
import HeaderUsr from "@/components/layout/HeaderUsr";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import CertificadoModal from "@/components/certificados/CertificadoModal";
import { useState } from "react";
import PageHead from "@/components/layout/PageHead";
import { Page } from "@/stories/Page";

const fetcher = async () => {
  try {
    const data = await obtenerMascotasAdoptadas();
    if (!data) throw new Error("No se devolvieron datos del servidor.");
    return data;
  } catch (err: any) {
    alert("❌ Error en fetcher: " + err.message);
    throw err;
  }
};

export default function MisMascotasPage() {
  const [certificadoAbierto, setCertificadoAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const adoptante = "Nombre del usuario"; // luego lo jalamos de supabase

  const {
    data: mascotas,
    error,
    isLoading,
  } = useSWR("/mis-mascotas", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[#8b4513]">
        <Loader2 className="animate-spin h-8 w-8 mb-2" />
        <p>Cargando tus mascotas...</p>
      </div>
    );

  if (error) {
    console.error("Error al cargar mascotas:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p>❌ Error al cargar tus mascotas</p>
        <pre className="text-xs text-gray-600">{error.message}</pre>
      </div>
    );
  }

  if (!mascotas || mascotas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <p className="text-lg mb-4">Aún no has adoptado ninguna mascota 🐾</p>
        <Link href="/usuario/mascotas">
          <Button>Ir a adoptar</Button>
        </Link>
      </div>
    );
  }

  // 🔹 Filtrar duplicados y asegurar keys únicas
  const mascotasUnicas = [
    ...new Map(
      mascotas.map((m: any) => [
        m.id ?? m.adopcion_id ?? crypto.randomUUID(),
        m,
      ])
    ).values(),
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <PageHead
        title="Mis Mascotas Adoptadas"
        subtitle="Consulta el seguimiento de las mascotas que has adoptado."
      />

      <div className="grid gap-6 lg:grid-cols-1">
        {mascotasUnicas.map((m: any) => {
          const fechaAdopcion = dayjs(m.fecha_adopcion);
          const seguimientos = generarFechasSeguimiento(fechaAdopcion);
          const keyId = m.id ?? m.adopcion_id ?? crypto.randomUUID();

          return (
            <Card
              key={keyId}
              className="flex flex-col md:flex-row items-center md:items-stretch overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-[#fff] to-[#fffaf4] rounded-2xl"
            >
              {/* Imagen de la mascota */}
              <div className="relative w-full md:w-[45%] h-64 md:h-auto flex-shrink-0">
                <img
                  src={
                    m.imagen_url?.startsWith("http")
                      ? m.imagen_url
                      : "/placeholder.png"
                  }
                  alt={m.nombre}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Contenido */}
              <div className="flex flex-col justify-between w-full md:w-[55%] p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#5a3d1e]">
                    {m.mascota_nombre || "Sin nombre"}
                  </h2>
                  <p className="text-sm text-gray-500 italic mb-3">
                    {m.raza_nombre || m.tamano || "Sin datos"} · {m.sexo}
                  </p>

                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Adoptada el:</strong>{" "}
                      {fechaAdopcion.isValid()
                        ? fechaAdopcion.format("DD/MM/YYYY")
                        : "Sin fecha"}
                    </p>
                    <p>
                      <strong>Edad:</strong> {m.edad || "Sin datos"}
                    </p>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <p className="font-semibold mb-1 text-[#8b4513]">
                      Seguimientos programados:
                    </p>
                    <ul className="list-disc ml-5 text-gray-600 leading-relaxed">
                      {seguimientos.map((f, i) => (
                        <li key={`${keyId}-seg-${i}`}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-2 mt-5">
                  <ButtonLink
                    href={`/dashboards/usuario/seguimiento/${m.adopcion_id}`}
                    variant="secondary"
                    size="md"
                    className="sm:w-auto w-full"
                  >
                    Gestionar seguimiento
                  </ButtonLink>

                  <Button
                    onClick={() => {
                      setMascotaSeleccionada(m);
                      setCertificadoAbierto(true);
                    }}
                  >
                    Ver mi certificado de adopción
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        <CertificadoModal
          open={certificadoAbierto}
          onClose={() => setCertificadoAbierto(false)}
          mascota={mascotaSeleccionada}
          adoptante={adoptante}
        />
      </div>
    </div>
  );
}

// 🔹 Generador de fechas de seguimiento
function generarFechasSeguimiento(fecha: dayjs.Dayjs) {
  if (!fecha.isValid()) return ["Fechas no disponibles"];
  return [
    `1 semana: ${fecha.add(7, "day").format("DD/MM/YYYY")}`,
    `1 mes: ${fecha.add(1, "month").format("DD/MM/YYYY")}`,
    `2 meses: ${fecha.add(2, "month").format("DD/MM/YYYY")}`,
    `6 meses: ${fecha.add(6, "month").format("DD/MM/YYYY")}`,
  ];
}
