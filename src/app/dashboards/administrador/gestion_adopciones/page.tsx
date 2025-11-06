"use client";

import {useMemo, useState, useEffect} from "react";
import AdopcionesTable from "@/components/adopciones/AdopcionesTable";
import {listarAdopcionesAdmin, cambiarEstadoAdopcion} from "@/adopciones/adopciones-actions";
import type {AdopcionAdminRow} from "@/adopciones/adopciones";
import {createClient} from "@/lib/supabase/client";

export default function GestionAdopcionesPage() {
    const [rows, setRows] = useState<AdopcionAdminRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<"todas" | AdopcionForm["estado"]>("todas");

    useEffect(() => {
        async function fetchAdopciones() {
            try {
                const data = await listarAdopcionesAdmin();
                setRows(data);
            } catch (error) {
                console.error("Error cargando adopciones:", error);
                alert("Error al cargar las adopciones.");
            } finally {
                setLoading(false);
            }
        }

        fetchAdopciones();
    }, []);

    const aprobar = async (id: string) => {
        if (!confirm("¿Aprobar esta adopción?")) return;

        try {
            const supabase = createClient();
            const {
                data: {user},
            } = await supabase.auth.getUser();

            if (!user) throw new Error("No hay sesión activa.");

            await cambiarEstadoAdopcion({
                id,
                estado: "aprobada",
                admin_responsable: user.id,
                observaciones_admin: "Adopción aprobada por el administrador.",
            });

            setRows((prev) => prev.map((r) => (r.id === id ? {...r, estado: "aprobada"} : r)));
            alert("✅ Adopción aprobada correctamente.");
        } catch (err) {
            console.error(err);
            alert("❌ Error al aprobar adopción.");
        }
    };

    const rechazar = async (id: string) => {
        const motivo = prompt("Motivo del rechazo:");
        if (motivo === null) return;

        try {
            const supabase = createClient();
            const {
                data: {user},
            } = await supabase.auth.getUser();

            if (!user) throw new Error("No hay sesión activa.");

            await cambiarEstadoAdopcion({
                id,
                estado: "rechazada",
                admin_responsable: user.id,
                observaciones_admin: motivo || "Sin motivo.",
            });

            setRows((prev) => prev.map((r) => (r.id === id ? {...r, estado: "rechazada"} : r)));
            alert("⚠️ Adopción rechazada.");
        } catch (err) {
            console.error(err);
            alert("❌ Error al rechazar adopción.");
        }
    };

    // (opcional) KPIs rápidos
    const totales = useMemo(
        () => ({
            pendientes: rows.filter((r) => r.estado === "pendiente").length,
            aprobadas: rows.filter((r) => r.estado === "aprobada").length,
            rechazadas: rows.filter((r) => r.estado === "rechazada").length,
        }),
        [rows]
    );

    if (loading) {
        return <div className="p-6 text-center text-sm text-[#7a5c49] animate-pulse">Cargando adopciones...</div>;
    }

    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Gestión de adopciones</h1>
                <p className="text-sm text-gray-600">Revisa las solicitudes y aprueba o rechaza la adopción.</p>
            </div>

            {/* KPIs opcionales, mismo estilo de “citas” */}
            <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
                    Pendientes: {totales.pendientes}
                </span>
                <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
                    Aprobadas: {totales.aprobadas}
                </span>
                <span className="px-2 py-1 text-sm rounded-md border bg-red-50 text-red-700">
                    Rechazadas: {totales.rechazadas}
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
