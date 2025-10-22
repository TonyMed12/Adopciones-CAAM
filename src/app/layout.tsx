import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat, Zain } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const zain = Zain({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-zain",
});

export const metadata: Metadata = {
  title: "Centro de Atención Animal | Morelia",
  description: "Adopta y cambia una vida",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.className} ${montserrat.variable} ${zain.variable}`}
    >
      <body className="bg-white text-gray-900 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
