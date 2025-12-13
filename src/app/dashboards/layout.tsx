import { Toaster } from "sonner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster richColors position="top-right" />

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
