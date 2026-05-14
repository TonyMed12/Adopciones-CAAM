import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import UserHeader from "@/components/layout/HeaderUsr";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole(2);
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") redirect("/login");
    redirect("/dashboards");
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] relative overflow-hidden">
      <UserHeader />

      {/* Fondos decorativos sutiles */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[46rem] h-[46rem] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-rose-100/20 blur-3xl" />
      </div>

      <main className="relative z-10 px-3 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-10 md:pb-16">
        <div className="mx-auto max-w-[1280px] bg-white/85 backdrop-blur-md rounded-3xl border border-slate-100/80 shadow-[0_20px_60px_rgba(2,6,23,.06)] p-4 sm:p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
