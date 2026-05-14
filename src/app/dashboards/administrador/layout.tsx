import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import AdminSidebar from "@/components/layout/HeaderAd";
import Providers from "@/app/providers";
import { Toaster } from "sonner";
import "react-datepicker/dist/react-datepicker.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole(1);
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") redirect("/login");
    redirect("/dashboards");
  }

  return (
    <Providers>
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "0.95rem" },
        }}
      />

      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        <AdminSidebar />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[45rem] h-[45rem] rounded-full bg-amber-100/40 blur-3xl" />
        </div>

        <main className="relative px-4 md:px-8 py-6 pt-24 lg:pt-6 lg:ml-72">
          <div
            className="mx-auto max-w-full bg-white/85 backdrop-blur-sm rounded-3xl border border-slate-100 p-5 md:p-8"
            style={{ boxShadow: "0 20px 60px rgba(2,6,23,.06)" }}
          >
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}