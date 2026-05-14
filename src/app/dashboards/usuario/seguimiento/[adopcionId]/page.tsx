"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList, PawPrint } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import PageHead from "@/components/layout/PageHead";
import ModalInfoSeguimiento from "@/features/seguimiento/components/client/ModalInfoSeguimiento";
import ModalSeguimiento from "@/features/seguimiento/components/client/ModalSeguimiento";
import SeguimientoForm from "@/features/seguimiento/components/client/SeguimientoForm";
import SeguimientoMascotaCard from "@/features/seguimiento/components/client/SeguimientoMascotaCard";
import { useSeguimientoMascotasQuery } from "@/features/seguimiento/hooks/useSeguimientoMacostasQuery";

import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function SeguimientoMascotasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: mascotas = [], isLoading } = useSeguimientoMascotasQuery();

  const [infoOpen, setInfoOpen] = useState(false);
  const [seguimientoOpen, setSeguimientoOpen] = useState(false);
  const [seguimientoActual, setSeguimientoActual] = useState<any>(null);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/dashboards/usuario/mis-mascotas")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B4513] hover:text-[#BC5F36] transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a mis mascotas
      </button>

      <PageHead
        title="Seguimiento de mis mascotas"
        subtitle="Revisa el progreso y registra los seguimientos programados para cada mascota adoptada 🐾"
        eyebrow={
          <>
            <ClipboardList size={12} />
            <span>Seguimiento post-adopción</span>
          </>
        }
        icon={<ClipboardList size={20} />}
      />

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-[#eadacb] overflow-hidden shadow-sm"
            >
              <div className="p-6 bg-[#FFF7EF] flex gap-4">
                <Skeleton variant="card" className="h-32 w-32 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-48 mt-2" />
                </div>
              </div>
              <div className="p-6 space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : mascotas.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={32} />}
          title="Aún no tienes mascotas adoptadas"
          description="Cuando completes el proceso de adopción, podrás llevar el seguimiento de tu nueva mascota desde aquí."
          action={
            <Button
              onClick={() => router.push("/dashboards/usuario/mascotas")}
            >
              Explorar mascotas
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6">
          {mascotas.map((m: any) => (
            <SeguimientoMascotaCard
              key={m.id}
              mascota={m}
              onInfo={() => setInfoOpen(true)}
              onSubirSeguimiento={(s) => {
                setSeguimientoActual({
                  adopcionId: m.id,
                  fecha: s.fecha,
                  fechaFormateada: dayjs(s.fecha).format("DD/MM/YYYY"),
                });
                setSeguimientoOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ModalInfoSeguimiento
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />

      {seguimientoActual && (
        <ModalSeguimiento
          open={seguimientoOpen}
          onClose={() => setSeguimientoOpen(false)}
          titulo="Registra el seguimiento de tu mascota"
        >
          <SeguimientoForm
            adopcionId={seguimientoActual.adopcionId}
            fechaProgramada={seguimientoActual.fecha}
            onSuccess={() => {
              setSeguimientoOpen(false);
              queryClient.invalidateQueries({
                queryKey: ["seguimiento-mascotas"],
              });
            }}
          />
        </ModalSeguimiento>
      )}
    </div>
  );
}
