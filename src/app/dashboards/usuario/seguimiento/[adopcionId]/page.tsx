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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import SeguimientoForm from "@/components/seguimiento/SeguimientoForm";

export default function SeguimientoMascotasPage() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSeguimientos = async () => {
      setLoading(true);

      // Obtener usuario autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Obtener perfil asociado al usuario actual
      const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("id, email")
        .eq("id", user.id)
        .single();

      if (perfilError || !perfil) {
        console.error("⚠️ No se encontró perfil asociado al usuario actual");
        setLoading(false);
        return;
      }

      // 🔍 Filtrar adopciones donde el usuario sea el adoptante
      const { data: adopciones, error } = await supabase
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

      if (error) {
        console.error("❌ Error al obtener adopciones:", error.message);
        setLoading(false);
        return;
      }

      // Filtrar las adopciones que pertenecen al perfil actual
      const adopcionesUsuario = (adopciones || []).filter(
        (a) => a.solicitudes_adopcion?.usuario_id === perfil.id
      );

      // Generar lista de seguimientos solo para las adopciones del usuario
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
            const fecha = f.fecha.format("YYYY-MM-DD");
            const hoy = dayjs().format("YYYY-MM-DD");
            const diferencia = f.fecha.diff(dayjs(), "day");

            let estado = "Pendiente";
            if (completados.has(fecha)) estado = "Completado";
            else if (fecha <= hoy) estado = "Activo";
            else if (diferencia <= 3 && diferencia > 0) estado = "Próximo";

            return { nombre: f.nombre, fecha, estado };
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
              <div className="flex items-center gap-6 mb-5">
                {/* ✅ Imagen corregida (sin next/image) */}
                <img
                  src={
                    m.imagen?.startsWith("http")
                      ? m.imagen
                      : "/placeholder.png"
                  }
                  alt={m.nombre}
                  width={120}
                  height={120}
                  className="rounded-2xl object-cover border border-[#BC5F36]/30 w-[120px] h-[120px]"
                />

                <div>
                  <h2 className="text-2xl font-bold text-[#8B4513] flex items-center gap-2">
                    {m.nombre} <PawPrint size={20} />
                  </h2>
                  <p className="text-sm text-[#5C3D2E]">
                    <b>Fecha de adopción:</b> {m.fechaAdopcion}
                  </p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="mt-2">
                        <Info size={16} /> Cómo funciona el seguimiento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg bg-[#FFF8F0] border-[#E5D1B8]">
                      <DialogHeader>
                        <DialogTitle className="text-[#8B4513] text-lg">
                          ¿Cómo funciona el seguimiento? 🐾
                        </DialogTitle>
                      </DialogHeader>
                      <div className="text-[#5C3D2E] text-sm leading-relaxed space-y-3">
                        <p>
                          Este seguimiento permite verificar la adaptación y
                          bienestar de tu mascota tras la adopción.
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>🗓️ 1 semana: revisión inicial.</li>
                          <li>📆 1 mes: adaptación familiar.</li>
                          <li>🐕 2 meses: evaluación intermedia.</li>
                          <li>💚 6 meses: cierre de proceso.</li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid gap-3">
                {m.seguimientos.map((s: any, i: number) => (
                  <div
                    key={`${m.id}-${i}`}
                    className="flex justify-between items-center border border-[#E5D1B8] rounded-xl px-4 py-3 bg-white hover:bg-[#FFF3E8] transition"
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
                        <CheckCircle2 className="text-green-600" size={20} />
                      ) : s.estado === "Activo" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary">
                              Registrar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-[#FFF8F0] border-[#E5D1B8]">
                            <DialogHeader>
                              <DialogTitle className="text-[#8B4513] text-xl">
                                Seguimiento —{" "}
                                {dayjs(s.fecha).format("DD/MM/YYYY")}
                              </DialogTitle>
                            </DialogHeader>
                            <SeguimientoForm
                              adopcionId={m.id}
                              fechaProgramada={s.fecha}
                              onSuccess={() => window.location.reload()}
                            />
                          </DialogContent>
                        </Dialog>
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
    </div>
  );
}
