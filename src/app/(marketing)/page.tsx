// src/app/(marketing)/page.tsx
import { ButtonLink } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="bg-[#FFF8F0]">
      {/* Hero Section */}
      <section className="relative bg-[#D97706] text-white py-20 overflow-hidden">
        {/* Decoración con huellas */}
        <div className="absolute top-10 left-10 text-6xl opacity-20">🐾</div>
        <div className="absolute bottom-20 right-16 text-7xl opacity-20">
          🐾
        </div>

        <div className="container mx-auto grid items-center gap-10 px-6 md:grid-cols-2">
          {/* Texto */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Adopta y cambia una vida
            </h1>
            <p className="mt-4 text-lg text-[#FFF8F0]">
              Conoce a nuestros gatetes y perretes que buscan un hogar lleno de
              amor.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/adopciones"
                className="px-6 py-3 rounded-xl bg-white text-[#D97706] font-semibold shadow-md hover:bg-gray-100 transition"
              >
                ¿Quién Somos?
              </a>
              <a
                href="/login"
                className="px-6 py-3 rounded-xl bg-[#8B4513] text-white font-semibold shadow-md hover:bg-[#A0522D] transition"
              >
                Inicia Sesión
              </a>
            </div>
          </div>

          {/* Imagen mascota */}
          <div className="flex justify-center relative">
            <img
              src="/dog.png"
              alt="Perros en adopción"
              className="rounded-2xl shadow-2xl object-cover w-full max-w-md"
            />
            {/* Elemento decorativo */}
            <div className="absolute -z-10 top-6 left-6 w-72 h-72 rounded-full bg-[#FDE68A] opacity-70"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
