"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import { getUserRole } from "@/lib/supabase/getRole";
import AdminHeader from "@/components/layout/HeaderAd";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyRole = async () => {
      const rol = await getUserRole();

      if (rol === 1) {
        setAllowed(true); // administrador
      } else {
        router.push("/dashboards/usuario"); // si no es admin → redirige
      }

      setChecking(false);
    };

    verifyRole();
  }, [router]);

  if (checking) return <p className="p-10">Cargando...</p>;
  if (!allowed) return null;

  return (
    <Protected>
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Header superior del admin */}
        <AdminHeader />

        {/* Fondo suave decorativo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[45rem] h-[45rem] rounded-full bg-amber-100/40 blur-3xl" />
        </div>

        {/* Contenido principal */}
        <main className="relative px-6 md:px-8 py-6 mt-20">
          <div
            className="mx-auto max-w-auto bg-white/85 backdrop-blur-sm rounded-3xl border border-slate-100 p-6 md:p-8"
            style={{ boxShadow: "0 20px 60px rgba(2,6,23,.06)" }}
          >
            {children}
          </div>
        </main>
      </div>
    </Protected>
  );
}
