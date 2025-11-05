"use client";

import { useMemo, useState } from "react";
import AdopcionesTable from "@/components/adopciones/AdopcionesTable";
import {
  formulariosMock,
  actualizarEstadoFormularioMock,
  type AdopcionForm,
} from "@/data/adopciones/mocks";

export default function GestionAdopcionesPage() {
  const [rows, setRows] = useState<AdopcionForm[]>(formulariosMock);
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todas" | AdopcionForm["estado"]>("todas");

  const aprobar = (id: string) => {
    if (!confirm("¿Aprobar este formulario de adopción?")) return;
    const upd = actualizarEstadoFormularioMock(id, "aprobado");
    setRows(prev => prev.map(r => (r.id === id ? upd : r)));
    alert("Formulario aprobado (mock)");
  };

  const rechazar = (id: string) => {
    const motivo = prompt("Motivo del rechazo:");
    if (motivo === null) return; // cancelado
    const upd = actualizarEstadoFormularioMock(id, "rechazado", motivo || "Sin motivo");
    setRows(prev => prev.map(r => (r.id === id ? upd : r)));
    alert("Formulario rechazado (mock)");
  };

  // (opcional) KPIs rápidos
  const totales = useMemo(() => ({
    enRevision: rows.filter(r => r.estado === "en_revision").length,
    aprobados: rows.filter(r => r.estado === "aprobado").length,
    rechazados: rows.filter(r => r.estado === "rechazado").length,
  }), [rows]);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Gestión de adopciones</h1>
        <p className="text-sm text-gray-600">
          Revisa las solicitudes y aprueba o rechaza la adopción.
        </p>
      </div>

      {/* KPIs opcionales, mismo estilo de “citas” */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
          En revisión: {totales.enRevision}
        </span>
        <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
          Aprobados: {totales.aprobados}
        </span>
        <span className="px-2 py-1 text-sm rounded-md border bg-red-50 text-red-700">
          Rechazados: {totales.rechazados}
        </span>
      </div>

      <AdopcionesTable
        items={rows}
        query={query}
        onQueryChange={setQuery}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onAprobar={aprobar}
        onRechazar={rechazar}
      />
    </div>
  );
}
