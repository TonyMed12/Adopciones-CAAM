"use client";

import useSWR from "swr";
import { obtenerPerfilActual } from "@/perfil/perfil-actions";
import PerfilCard from "@/components/perfil/PerfilCard";
import HeaderAd from "@/components/layout/HeaderAd";
import HeaderUsr from "@/components/layout/HeaderUsr";
import { Loader2 } from "lucide-react";

const fetcher = async () => {
  const data = await obtenerPerfilActual();
  return data;
};

export default function PerfilPage() {
  const { data, error, isLoading } = useSWR("/perfil", fetcher, {
    revalidateOnFocus: false, // no recarga al cambiar de pestaña
    dedupingInterval: 60000, // 1 minuto de cache
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[#8b4513]">
        <Loader2 className="animate-spin h-8 w-8 mb-2" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <p>❌ Error cargando el perfil</p>
        <pre className="text-xs text-gray-600">{error.message}</pre>
      </div>
    );
  }

  if (!data) return null;

  const { perfil, direccion, solicitudes, documentos, rol_id } = data;
  const HeaderByRole = rol_id === 1 ? <HeaderAd /> : <HeaderUsr />;

  return (
    <>
      {HeaderByRole}
      <div className="p-6 max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-[#8b4513] mb-6">Mi perfil</h1>
        <PerfilCard
          perfil={perfil}
          direccion={direccion}
          solicitudes={solicitudes}
          mascotasAdoptadas={data.mascotasAdoptadas}
          documentos={documentos}
        />
      </div>
    </>
  );
}
