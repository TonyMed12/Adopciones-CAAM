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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <UserHeader />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[45rem] h-[45rem] rounded-full bg-amber-100/40 blur-3xl" />
      </div>
      <main className="relative px-6 md:px-8 py-6 mt-[6.5rem] md:mt-[5.5rem]">
        <div
          className="mx-auto max-w-auto bg-white/85 backdrop-blur-sm rounded-3xl border border-slate-100 p-6 md:p-8"
          style={{ boxShadow: "0 20px 60px rgba(2,6,23,.06)" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
