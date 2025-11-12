"use client";

import Header from "@/components/layout/Header";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f0] text-gray-800">
      {/* Navbar */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1">
        <section className="py-20 px-6 bg-gradient-to-b from-orange-50 to-white text-gray-800">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-orange-600">
              Sobre Nosotros
            </h2>
            <p className="mb-6 text-lg leading-relaxed">
              En el <strong>Centro de Atención Animal de Morelia (CAAM)</strong>{" "}
              trabajamos con pasión y compromiso por la salud pública, el
              bienestar animal y la seguridad ciudadana. Nuestro equipo
              multidisciplinario busca que cada perro y gato reciba atención
              digna, cariño y la oportunidad de encontrar un hogar responsable.
            </p>

            {/* Tarjetas con ejes principales */}
            <div className="grid md:grid-cols-3 gap-8 my-10">
              <div className="p-6 bg-white shadow rounded-2xl">
                <h3 className="text-xl font-semibold mb-2 text-orange-500">
                  Salud Pública
                </h3>
                <p>
                  Brindamos <strong>servicios médicos veterinarios</strong> de
                  prevención y primera instancia, campañas de vacunación y
                  esterilización para controlar la sobrepoblación y proteger la
                  salud de la comunidad.
                </p>
              </div>
              <div className="p-6 bg-white shadow rounded-2xl">
                <h3 className="text-xl font-semibold mb-2 text-orange-500">
                  Bienestar Animal
                </h3>
                <p>
                  Promovemos el <strong>trato digno y responsable</strong> a los
                  animales de compañía, alineados con la normatividad vigente,
                  fomentando la adopción y el respeto hacia todas las formas de
                  vida.
                </p>
              </div>
              <div className="p-6 bg-white shadow rounded-2xl">
                <h3 className="text-xl font-semibold mb-2 text-orange-500">
                  Seguridad Ciudadana
                </h3>
                <p>
                  Resguardamos a animales agresores o enfermos en vía pública,
                  priorizando la seguridad de los ciudadanos y la atención
                  responsable de cada caso.
                </p>
              </div>
            </div>

            {/* Misión y visión */}
            <div className="bg-orange-100 p-8 rounded-2xl shadow-inner mb-10">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">
                Nuestra Misión
              </h3>
              <p className="mb-4">
                Ser un espacio donde{" "}
                <strong>
                  la salud animal y el amor por los animales convergen
                </strong>
                , promoviendo la adopción responsable y contribuyendo a una
                ciudad más humana y consciente.
              </p>
              <h3 className="text-2xl font-bold mb-4 text-orange-600">
                Nuestra Visión
              </h3>
              <p>
                Lograr que Morelia sea un referente nacional en{" "}
                <strong>bienestar animal</strong>, con una comunidad unida que
                reconozca y respete a los animales como parte fundamental de
                nuestra sociedad.
              </p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 my-12 text-center">
              <div>
                <h4 className="text-3xl font-extrabold text-orange-600">
                  10,000+
                </h4>
                <p className="text-gray-600">Vacunas aplicadas</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-orange-600">
                  5,000+
                </h4>
                <p className="text-gray-600">Esterilizaciones</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-orange-600">
                  3,000+
                </h4>
                <p className="text-gray-600">Adopciones responsables</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-orange-600">365</h4>
                <p className="text-gray-600">Días de compromiso</p>
              </div>
            </div>

            {/* Contacto */}
            <p className="text-gray-600 mb-2">
              📍 Álamos No. 395, Col. Centenario, C.P. 58128, Morelia, Mich.
            </p>
            <p className="text-gray-600 mb-6">
              📞 443 321 4731 / 443 321 1392
            </p>

            <a
              href="https://serviciospublicos.morelia.gob.mx/centro-de-atencion-animal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition"
            >
              Conoce más en nuestra página oficial
            </a>
          </div>
        </section>
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
