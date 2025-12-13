import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";

export default function MascotasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fff4e7]"> 
      <Header />
      <PageShell>{children}</PageShell>
    </div>
  );
}
