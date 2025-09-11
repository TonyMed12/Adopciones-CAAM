// src/app/(marketing)/layout.tsx
import Navbar from "../../components/layout/Navbar";
export default function MarketingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="mt-12 border-t">
        <div className="container mx-auto px-4 py-8 text-sm text-gray-600">
          © {new Date().getFullYear()} CAAM Morelia — Hecho con ❤️
        </div>
      </footer>
    </>
  );
}
