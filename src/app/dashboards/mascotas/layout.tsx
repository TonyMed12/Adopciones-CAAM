// Server Component (no "use client")
import Header from "@/components/layout/HeaderUsr";
import PageShell from "@/components/layout/PageShell";

export default function MascotasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fff4e7]"> {/* fondo antes en :global(body) */}
      <Header />
      <PageShell>{children}</PageShell>
    </div>
  );
}
