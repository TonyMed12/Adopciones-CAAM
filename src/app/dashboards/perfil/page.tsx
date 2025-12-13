"use client";

import HeaderAd from "@/components/layout/HeaderAd";
import HeaderUsr from "@/components/layout/HeaderUsr";
import PageHead from "@/components/layout/PageHead";
import PerfilCard from "@/features/perfil/components/client/PerfilCard";
import { usePerfilQuery } from "@/features/perfil/hooks/usePerfilQuery";

export default function PerfilPage() {
  const { data } = usePerfilQuery();

  const HeaderByRole =
    data?.rol_id === 1 ? <HeaderAd /> : <HeaderUsr />;

  return (
    <>
      {HeaderByRole}
      <div className="p-6 max-w-6xl mx-auto mt-[6.5rem] md:mt-[5.5rem]">
        <PageHead
          title="Mi Perfil"
          subtitle="Revisa y actualiza tu información personal."
        />
        <PerfilCard />
      </div>
    </>
  );
}
