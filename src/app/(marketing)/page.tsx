// src/app/(marketing)/page.tsx
export default function LandingPage() {
  return (
    <main className="bg-[#FFF8F0]">
      {/* Fondo imagen naranja */}
      <section
        className="relative text-white py-20 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-green.jpeg')" }}
      >
        <div className="flex flex-row justify-center container mx-auto  items-center gap-10 px-6 md:grid-cols-2">
          {/* Texto de la izquierda */}
          <div>
            <h1 className="text-7xl md:t font-extrabold leading-tight">
              Adopta y cambia una vida
            </h1>
            <p className="mt-4 text-xl text-[#FFF8F0]">
              Encuentra a tu compañero de vida, animales que buscan un hogar
              lleno de amor.
            </p>

            {/* Botones de lado izquierdo quienes somos e inicia sesion */}
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/nosotros"
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
          </div>
        </div>
      </section>
    </main>
  );
}
