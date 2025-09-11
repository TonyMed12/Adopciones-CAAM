
// src/app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adopciones CAAM",
  description: "Adopta y cambia una vida",
};


  export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}


