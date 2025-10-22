"use client";
import { useEffect, useState } from "react";
import { listarMascotas } from "@/mascotas/mascotas-actions";
import { contarUsuarios } from "@/usuarios/usuarios-actions";

function Stat({
  label,
  value,
  tag,
}: {
  label: string;
  value: string | number;
  tag?: string;
}) {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-5"
      style={{ boxShadow: "0 10px 30px rgba(2,6,23,.05)" }}
    >
      <div className="text-slate-500 text-sm flex items-center gap-2">
        {label}
        {tag && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
            {tag}
          </span>
        )}
      </div>
      <div className="mt-1 text-3xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalMascotas: 0,
    adoptables: 0,
    adoptadasMes: 0,
    enProceso: 0,
    totalUsuarios: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Mascotas
        const mascotas = await listarMascotas();
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

        const totalMascotas = mascotas.length;
        const adoptables =
          mascotas.filter(
            (m: any) => m.estado === "disponible" || m.disponible_adopcion === true
          ).length;
        const adoptadasMes = mascotas.filter(
          (m: any) =>
            m.estado === "adoptada" && new Date(m.created_at) >= inicioMes
        ).length;
        const enProceso = mascotas.filter(
          (m: any) => m.estado === "en_proceso"
        ).length;

        // Usuarios
        const totalUsuarios = await contarUsuarios();

        setStats({
          totalMascotas,
          adoptables,
          adoptadasMes,
          enProceso,
          totalUsuarios,
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header visual */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Bienvenido</h1>
        <div className="flex items-center gap-3">
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Mascotas registradas" value={stats.totalMascotas} tag="hoy" />
        <Stat label="Adoptables" value={stats.adoptables} tag="hoy" />
        <Stat label="Adoptadas (mes)" value={stats.adoptadasMes} />
        <Stat label="En proceso" value={stats.enProceso} />
      </div>

      {/* Bloque de usuarios */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Usuarios totales" value={stats.totalUsuarios} />
      </div>

      {loading && (
        <p className="text-center text-slate-400 text-sm">
          Cargando datos actualizados desde la base 🐾
        </p>
      )}
    </div>
  );
}
