"use client";

import { User } from "lucide-react";
import HeaderAd from "@/components/layout/HeaderAd";
import HeaderUsr from "@/components/layout/HeaderUsr";
import PageHead from "@/components/layout/PageHead";
import PerfilCard from "@/features/perfil/components/client/PerfilCard";
import { usePerfilQuery } from "@/features/perfil/hooks/usePerfilQuery";

export default function PerfilPage() {
  const { data } = usePerfilQuery();

  const isAdmin = data?.rol_id === 1;
  const HeaderByRole = isAdmin ? <HeaderAd /> : <HeaderUsr />;

  return (
    <>
      {HeaderByRole}
      <main className="min-h-screen bg-[#FFF8F0] relative overflow-hidden">
        {/* Fondos decorativos */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 w-[46rem] h-[46rem] rounded-full bg-amber-100/30 blur-3xl" />
        </div>

        <div className="relative z-10 px-3 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-10 md:pb-16">
          <div className="mx-auto max-w-[1100px] bg-white/85 backdrop-blur-md rounded-3xl border border-slate-100/80 shadow-[0_20px_60px_rgba(2,6,23,.06)] p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHead
              title="Mi perfil"
              subtitle="Revisa y actualiza tu información personal, dirección y documentos."
              eyebrow={
                <>
                  <User size={12} />
                  <span>Cuenta</span>
                </>
              }
              icon={<User size={20} />}
            />
            <PerfilCard />
          </div>
        </div>
      </main>
    </>
  );
}
