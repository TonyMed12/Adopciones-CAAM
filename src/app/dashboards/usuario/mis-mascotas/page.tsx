"use client";

import useSWR from "swr";
import { obtenerMascotasAdoptadas } from "@/features/usuarios/actions/usuario-mascotas-actions";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/Button";
import Link from "next/link";
import dayjs from "dayjs";
import CertificadoModal from "@/components/certificados/CertificadoModal";
import { useState } from "react";
import PageHead from "@/components/layout/PageHead";

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
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(
    null
  );

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
        <Link href="dashboards/usuario/adopcion">
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
        subtitle="Consulta el seguimiento y la información de las mascotas que has adoptado."
      />

      <div className="grid gap-6 lg:grid-cols-1">
        {mascotasUnicas.map((m: any) => {
          const fechaAdopcion = dayjs(m.fecha_adopcion);
          const seguimientos = generarFechasSeguimiento(fechaAdopcion);
          const keyId = m.id ?? m.adopcion_id ?? crypto.randomUUID();

          // Línea secundaria: raza · sexo · tamaño · personalidad
          const lineaSecundaria = [
            m.raza_nombre,
            m.sexo,
            m.tamano,
            m.personalidad,
          ]
            .filter(Boolean)
            .join(" · ");

          // Colores (si vienen como array)
          const coloresTexto = Array.isArray(m.colores)
            ? m.colores.join(", ")
            : m.colores || "";

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
                  alt={m.mascota_nombre || "Mascota adoptada"}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Contenido */}
              <div className="flex flex-col justify-between w-full md:w-[55%] p-6">
                <div>
                  {/* Nombre */}
                  <h2 className="text-2xl font-semibold text-[#5a3d1e]">
                    {m.mascota_nombre || "Sin nombre"}
                  </h2>

                  {/* Raza / sexo / tamaño / personalidad */}
                  <p className="text-sm text-gray-500 italic mb-3">
                    {lineaSecundaria || "Sin datos"}
                  </p>

                  {/* Datos principales */}
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

                    {m.peso_kg && (
                      <p>
                        <strong>Peso:</strong> {m.peso_kg} kg
                      </p>
                    )}

                    {m.altura_cm && (
                      <p>
                        <strong>Altura:</strong> {m.altura_cm} cm
                      </p>
                    )}

                    {coloresTexto && (
                      <p>
                        <strong>Colores:</strong> {coloresTexto}
                      </p>
                    )}

                    {m.esterilizado !== null && m.esterilizado !== undefined && (
                      <p>
                        <strong>Esterilizado:</strong>{" "}
                        {m.esterilizado ? "Sí" : "No"}
                      </p>
                    )}
                  </div>

                  {/* Origen / info médica */}
                  {m.lugar_rescate && (
                    <p className="text-sm mt-2 text-gray-700">
                      <strong>Rescatada en:</strong> {m.lugar_rescate}
                    </p>
                  )}

                  {(m.condicion_ingreso || m.observaciones_medicas) && (
                    <div className="border-t pt-3 mt-3">
                      <p className="font-semibold mb-1 text-[#8b4513]">
                        Información médica:
                      </p>
                      <ul className="list-disc ml-5 text-gray-600 leading-relaxed">
                        {m.condicion_ingreso && (
                          <li>Condición al ingresar: {m.condicion_ingreso}</li>
                        )}
                        {m.observaciones_medicas && (
                          <li>Observaciones: {m.observaciones_medicas}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Seguimientos */}
                  <div className="border-t pt-3 mt-4">
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
                    className="sm:w-auto w-full"
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

        {/* Modal de certificado */}
        <CertificadoModal
          open={certificadoAbierto}
          onClose={() => setCertificadoAbierto(false)}
          mascota={mascotaSeleccionada}
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
