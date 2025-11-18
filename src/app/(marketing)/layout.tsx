// src/app/(marketing)/layout.tsx
import Navbar from "../../components/layout/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0]">
      {/* Navbar fija */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e3c8b4] bg-[#BC5F36] text-[#fffaf4] shadow-inner">
        <div className="container mx-auto px-4 py-6 text-sm text-center">
          © 2025{" "}
          <span className="font-semibold">
            Centro de Atención Animal Morelia
          </span>
          . Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
