"use client";
import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import AdoptionForm, {type AdoptionPayload} from "@/components/adopciones/AdoptionForm";
import {obtenerSolicitudParaAdopcion} from "@/solicitudes/solicitudes-actions";
import {crearAdopcion} from "@/adopciones/adopciones-actions";

export default function FormularioAdopcionPage() {
    const router = useRouter();
    const {solicitudId} = useParams<{solicitudId: string}>();

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [solicitud, setSolicitud] = useState<null | {
        id: string;
        numero_solicitud: string;
        usuario_id: string;
        mascota_id: string;
    }>(null);

    useEffect(() => {
        (async () => {
            try {
                const s = await obtenerSolicitudParaAdopcion(String(solicitudId));
                setSolicitud({
                    id: s.id,
                    numero_solicitud: s.numero_solicitud,
                    usuario_id: s.usuario_id,
                    mascota_id: s.mascota_id,
                });
            } catch (e: any) {
                setErrorMsg(e?.message || "No se pudo cargar la solicitud.");
            } finally {
                setLoading(false);
            }
        })();
    }, [solicitudId]);

    const handleSubmit = async (payload: AdoptionPayload) => {
        if (!solicitud) {
            alert("No se encontró la solicitud para continuar.");
            return;
        }

        try {
            await crearAdopcion({
                solicitud_id: solicitud.id, // ✅ UUID real
                tipo_vivienda: payload.tipoVivienda,
                espacio_disponible: payload.espacioDisponible,
                otras_mascotas: payload.otrasMascotas === "si",
                detalle_otras_mascotas: payload.detalleOtrasMascotas || null,
                evidencia_hogar_urls: payload.evidenciaHogarUrls, // URLs del Storage
                compromiso_seguimiento: payload.compromisoSeguimiento,
                compromiso_cuidado: payload.compromisoCuidado,
                observaciones_usuario: payload.observaciones || null,
            });

            alert("Formulario enviado. Estado: En revisión.");
            router.push("/dashboards/usuario");
        } catch (err: any) {
            console.error(err);
            alert(err?.message || "No se pudo enviar la solicitud.");
        }
    };

    if (loading) return <div className="p-6">Cargando…</div>;
    if (errorMsg) return <div className="p-6 text-red-600">{errorMsg}</div>;

    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Formulario de adopción</h1>
                <p className="text-sm text-gray-600">Completa la información para continuar con tu adopción.</p>
            </div>

            {/* Puedes pasar defaults si quieres precargar usuario/mascota */}
            <AdoptionForm
                defaultValues={{
                    usuarioId: solicitud!.usuario_id,
                    mascotaId: solicitud!.mascota_id,
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
