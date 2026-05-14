"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ClipboardCheck, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

import AdoptionForm, {
  type AdoptionPayload,
} from "@/features/adopciones/components/client/AdoptionForm";
import { obtenerSolicitudParaAdopcion } from "@/features/usuarios/actions/solicitudes-actions";
import { crearAdopcion } from "@/features/adopciones/actions/adopciones-actions";
import PageHead from "@/components/layout/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function FormularioAdopcionPage() {
  const router = useRouter();
  const { solicitudId } = useParams<{ solicitudId: string }>();

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
      toast.error("No se encontró la solicitud para continuar.");
      return;
    }

    try {
      await crearAdopcion({
        solicitud_id: solicitud.id,
        tipo_vivienda: payload.tipoVivienda,
        espacio_disponible: payload.espacioDisponible,
        otras_mascotas: payload.otrasMascotas === "si",
        detalle_otras_mascotas: payload.detalleOtrasMascotas || null,
        evidencia_hogar_urls: payload.evidenciaHogarUrls,
        compromiso_seguimiento: payload.compromisoSeguimiento,
        compromiso_cuidado: payload.compromisoCuidado,
        observaciones_usuario: payload.observaciones || null,
      });

      toast.success("Formulario de adopción enviado con éxito.");
      router.push("/dashboards/usuario");
    } catch (err: any) {
      console.error(err);
      toast.error("No se pudo enviar el formulario de adopción.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="flex items-center justify-center gap-2 text-[#7a5c49] py-4">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Cargando tu solicitud...</span>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <EmptyState
        icon={<AlertCircle size={32} />}
        title="No se pudo cargar la solicitud"
        description={errorMsg}
        action={
          <Button onClick={() => router.push("/dashboards/usuario/adopcion")}>
            Volver a mi adopción
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/dashboards/usuario/adopcion")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B4513] hover:text-[#BC5F36] transition-colors"
      >
        <ArrowLeft size={16} />
        Volver al proceso
      </button>

      <PageHead
        title="Formulario de adopción"
        subtitle="Completa los datos en 3 pasos sencillos. Toda tu información está protegida."
        eyebrow={
          <>
            <span>Solicitud {solicitud?.numero_solicitud}</span>
          </>
        }
        icon={<ClipboardCheck size={20} />}
      />

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
