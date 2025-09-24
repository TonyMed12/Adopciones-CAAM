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
      <footer className="mt-12 border-amber-600 ]">
        <div className="container mx-auto px-4 py-8 text-sm bg-amber-50 text-gray-600">
          © {new Date().getFullYear()} Centro de Atención Animal Morelia. Echale
          mi chuyy
        </div>
      </footer>
    </>
  );
}
