"use client";

import { useState } from "react";
import { PawPrint, Heart, AlertCircle, Loader2 } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import CertificadoModal from "@/components/certificados/CertificadoModal";

import { useMisMascotasQuery } from "@/features/mascotas/hooks/useMisMascotasQuery";
import MisMascotasCard from "@/features/mascotas/components/client/MisMascotasCard";

import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MisMascotasPage() {
  const { data: mascotas, isLoading, error } = useMisMascotasQuery();

  const [certificadoAbierto, setCertificadoAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(
    null
  );

  /* ---------------- Loading ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-white border border-[#eadacb] overflow-hidden flex flex-col lg:flex-row"
          >
            <Skeleton className="aspect-[4/3] lg:w-[40%] rounded-none" />
            <div className="flex-1 p-6 space-y-3">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
              </div>
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 text-[#7a5c49] py-2">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Cargando tus mascotas...</span>
        </div>
      </div>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={32} />}
        title="No pudimos cargar tus mascotas"
        description="Ocurrió un error al consultar tu información. Intenta nuevamente."
        action={
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        }
      />
    );
  }

  /* ---------------- Empty ---------------- */
  if (!mascotas || mascotas.length === 0) {
    return (
      <div className="space-y-6">
        <PageHead
          title="Mis mascotas adoptadas"
          subtitle="El espacio donde verás a tus compañeros y su seguimiento."
          eyebrow={
            <>
              <PawPrint size={12} />
              <span>Mi familia</span>
            </>
          }
          icon={<PawPrint size={20} />}
        />

        <EmptyState
          icon={<Heart size={32} fill="currentColor" />}
          title="Aún no has adoptado ninguna mascota"
          description="Cuando completes una adopción, verás aquí a tu nueva compañera o compañero. ¡Tu próximo mejor amigo te está esperando!"
          action={
            <Button
              onClick={() =>
                (window.location.href = "/dashboards/usuario/mascotas")
              }
            >
              Ver mascotas disponibles
            </Button>
          }
        />
      </div>
    );
  }

  /* ---------------- Lista ---------------- */
  const totalMascotas = mascotas.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHead
        title="Mis mascotas adoptadas"
        subtitle={`Tienes ${totalMascotas} ${
          totalMascotas === 1 ? "compañera/o" : "compañeras/os"
        } de vida. Aquí puedes ver su información y gestionar el seguimiento.`}
        eyebrow={
          <>
            <Heart size={12} fill="currentColor" />
            <span>Mi familia</span>
          </>
        }
        icon={<PawPrint size={20} />}
      />

      <div className="grid gap-5 sm:gap-6">
        {mascotas.map((mascota: any) => (
          <MisMascotasCard
            key={mascota.id ?? mascota.adopcion_id}
            mascota={mascota}
            onVerCertificado={(m) => {
              setMascotaSeleccionada(m);
              setCertificadoAbierto(true);
            }}
          />
        ))}
      </div>

      <CertificadoModal
        open={certificadoAbierto}
        onClose={() => setCertificadoAbierto(false)}
        mascota={mascotaSeleccionada}
      />
    </div>
  );
}
