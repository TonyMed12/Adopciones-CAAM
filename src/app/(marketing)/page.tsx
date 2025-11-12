// src/app/(marketing)/page.tsx
export default function LandingPage() {
  return (
    <main className="bg-[#FFF8F0]">
      {/* Sección con imagen de fondo */}
      <section
        className="relative text-white py-20 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://jivnxysdyziojckvslqp.supabase.co/storage/v1/object/public/logos/bg-green.jpeg')",
        }}
      >
        <div className="flex flex-row justify-center container mx-auto items-center gap-10 px-6 md:grid-cols-2">
          {/* Texto de la izquierda */}
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
              Adopta y cambia una vida
            </h1>
            <p className="mt-4 text-xl text-[#FFF8F0] max-w-lg">
              Encuentra a tu compañero de vida, animales que buscan un hogar
              lleno de amor.
            </p>

            {/* Botones */}
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

          {/* Imagen de la mascota desde Supabase */}
          <div className="flex justify-center relative">
            <img
              src="https://jivnxysdyziojckvslqp.supabase.co/storage/v1/object/public/logos/Dog.png"
              alt="Perros en adopción"
              className="rounded-2xl shadow-2xl object-cover w-full max-w-md hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
