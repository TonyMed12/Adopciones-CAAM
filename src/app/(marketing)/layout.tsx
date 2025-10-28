// src/app/(marketing)/layout.tsx
import Navbar from "../../components/layout/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="border-t border-[#e3c8b4] bg-[#BC5F36] text-[#fffaf4] shadow-inner">
      <div className="container mx-auto px-4 py-6 text-sm text-center">
        © 2025 <span className="font-semibold">Centro de Atención Animal Morelia</span>.  
        Todos los derechos reservados.
      </div>
    </footer>
    </>
  );
}
