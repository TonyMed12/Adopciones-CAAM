import { obtenerMascotaPorId } from "@/mascotas/mascotas-actions";
import HeaderSmart from "@/components/layout/HeaderSmart";
import MascotaPublicAdoptButton from "@/components/masc/MascotaPublicAdoptButton";

const COLORES_DISPONIBLES = [
  { nombre: "blanco", hex: "#FFFFFF" },
  { nombre: "negro", hex: "#000000" },
  { nombre: "gris", hex: "#808080" },
  { nombre: "gris oscuro", hex: "#4B4B4B" },
  { nombre: "café", hex: "#8B4513" },
  { nombre: "café claro", hex: "#B97A57" },
  { nombre: "beige", hex: "#D6B591" },
  { nombre: "crema", hex: "#F5E8C7" },
  { nombre: "canela", hex: "#C68642" },
  { nombre: "dorado", hex: "#DAA520" },
  { nombre: "miel", hex: "#E2B66C" },
  { nombre: "rojizo", hex: "#B55239" },
  { nombre: "atigrado", hex: "#9C661F" },
  { nombre: "tricolor", hex: "#C19A6B" },
  { nombre: "bicolor", hex: "#C0C0C0" },
  { nombre: "manchado", hex: "#B5A89F" },
  { nombre: "naranja", hex: "#FFA500" },
  { nombre: "gris azulado", hex: "#6E7F80" },
  { nombre: "verde", hex: "#32CD32" },
  { nombre: "verde oscuro", hex: "#228B22" },
  { nombre: "amarillo", hex: "#FFD700" },
  { nombre: "azul", hex: "#1E90FF" },
  { nombre: "celeste", hex: "#87CEEB" },
  { nombre: "rojo", hex: "#DC143C" },
];

export default async function MascotaPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mascota = await obtenerMascotaPorId(id);

  if (!mascota) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Mascota no encontrada 🐾
      </div>
    );
  }

  const fotoSrc = mascota.imagen_url || "/no-image.png";

  const coloresSeleccionados: string[] = Array.isArray(mascota.colores)
    ? (mascota.colores as string[])
    : [];

  const coloresEnriquecidos = coloresSeleccionados.map((nombre) => {
    const base = COLORES_DISPONIBLES.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
    );
    return {
      nombre,
      hex: base?.hex ?? "#D1D5DB",
    };
  });

  const tamanoRaw = (mascota.tamano || "").toLowerCase();
  const tamanoClase =
    tamanoRaw === "pequeño" || tamanoRaw === "chico"
      ? "from-emerald-500 to-emerald-400"
      : tamanoRaw === "mediano"
      ? "from-amber-500 to-amber-400"
      : tamanoRaw === "grande"
      ? "from-red-500 to-red-400"
      : "from-slate-500 to-slate-400";

  const sexoEsHembra = mascota.sexo?.toLowerCase().startsWith("h");

  return (
    <>
      <HeaderSmart />
      <main className="min-h-screen bg-[#FFF4E7] flex flex-col items-center justify-center p-6">
        <article className="relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl border-[4px] border-[#FF8414] bg-white">
          {/* 📸 Imagen + fondo blur + chips */}
          <div className="relative h-[500px] w-full overflow-hidden">
            {/* Fondo blur con la misma imagen */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-60"
              style={{ backgroundImage: `url(${fotoSrc})` }}
            />

            {/* Imagen principal */}
            <img
              src={fotoSrc}
              alt={mascota.nombre}
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            />

            {/* Capa cálida */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00000066] via-[#FF841420] to-transparent z-20" />

            {/* Chips superiores distribuidos */}
            <div className="absolute top-5 left-0 right-0 z-30 px-6 flex items-start justify-between">
              {/* Lado izquierdo: Sexo + Tamaño */}
              <div className="flex flex-wrap gap-2">
                {/* Sexo */}
                <span
                  className={`
                    inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wide capitalize
                    bg-gradient-to-r ${
                      sexoEsHembra
                        ? "from-pink-500 to-rose-400"
                        : "from-sky-500 to-blue-600"
                    }
                    text-white
                  `}
                >
                  <span className="text-lg">{sexoEsHembra ? "♀" : "♂"}</span>
                  {mascota.sexo}
                </span>

                {/* Tamaño */}
                <span
                  className={`
                    inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wide capitalize
                    bg-gradient-to-r ${tamanoClase}
                    text-white
                  `}
                >
                  {mascota.tamano || "—"}
                </span>
              </div>

              {/* Lado derecho: Disponibilidad */}
              <span
                className={`
                  inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wide capitalize
                  ${
                    mascota.disponible_adopcion
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }
                `}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    mascota.disponible_adopcion
                      ? "bg-emerald-200"
                      : "bg-red-200"
                  }`}
                />
                {mascota.disponible_adopcion ? "Disponible" : "No Disponible"}
              </span>
            </div>

            {/* Nombre + Raza abajo */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
              <h1 className="text-4xl font-extrabold drop-shadow-xl capitalize">
                {mascota.nombre}
              </h1>
              <p className="text-sm text-gray-200 mt-1 capitalize">
                {mascota.raza?.nombre || "Mestizo"} •{" "}
                {mascota.raza?.especie || "Desconocido"}
              </p>
            </div>
          </div>

          {/* 📋 Detalles */}
          <div className="p-6 md:p-8 text-[#2B1B12]">
            {/* Información general */}
            <section className="mb-8">
              <h2 className="text-xl font-extrabold mb-4 text-[#BC5F36]">
                Información General
              </h2>

              <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 text-sm">
                <div>
                  <dt className="font-semibold text-slate-700">Edad</dt>
                  <dd className="capitalize">{mascota.edad || "—"}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-700">Peso</dt>
                  <dd>{mascota.peso_kg ? `${mascota.peso_kg} Kg` : "—"}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-700">Altura</dt>
                  <dd>{mascota.altura_cm ? `${mascota.altura_cm} Cm` : "—"}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-700">Raza</dt>
                  <dd className="capitalize">
                    {mascota.raza?.nombre || "Mestizo"}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-700">Especie</dt>
                  <dd className="capitalize">
                    {mascota.raza?.especie || "Desconocido"}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-slate-700">Esterilizado</dt>
                  <dd>{mascota.esterilizado ? "Sí" : "No"}</dd>
                </div>
              </dl>
            </section>

            {/* Colores */}
            {coloresEnriquecidos.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-extrabold mb-3 text-[#BC5F36]">
                  Colores
                </h2>
                <div className="flex flex-wrap gap-2">
                  {coloresEnriquecidos.map(({ nombre, hex }) => (
                    <div
                      key={nombre}
                      className="
                        flex items-center gap-2 px-3 py-1.5 rounded-2xl border 
                        bg-white border-[#FF8414] text-[#2B1B12] text-sm 
                        shadow-sm
                      "
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-[#2b1b12]/30"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="capitalize">{nombre}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Personalidad */}
            {mascota.personalidad && (
              <section className="mb-8">
                <h2 className="text-xl font-extrabold mb-3 text-[#BC5F36]">
                  Personalidad
                </h2>
                <p className="capitalize text-sm">{mascota.personalidad}</p>
              </section>
            )}

            {/* Descripción física */}
            {mascota.descripcion_fisica && (
              <section className="mb-8">
                <h2 className="text-xl font-extrabold mb-3 text-[#BC5F36]">
                  Descripción Física
                </h2>
                <p className="text-sm">{mascota.descripcion_fisica}</p>
              </section>
            )}

            {/* Datos médicos y de rescate */}
            {(mascota.lugar_rescate ||
              mascota.condicion_ingreso ||
              mascota.observaciones_medicas) && (
              <section className="mb-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-extrabold mb-4 text-[#BC5F36]">
                  Datos Médicos Y De Rescate
                </h2>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  {mascota.lugar_rescate && (
                    <div>
                      <dt className="font-semibold text-slate-700">
                        Lugar De Rescate
                      </dt>
                      <dd className="capitalize">{mascota.lugar_rescate}</dd>
                    </div>
                  )}

                  {mascota.condicion_ingreso && (
                    <div>
                      <dt className="font-semibold text-slate-700">
                        Condición De Ingreso
                      </dt>
                      <dd className="capitalize">
                        {mascota.condicion_ingreso}
                      </dd>
                    </div>
                  )}
                </dl>

                {mascota.observaciones_medicas && (
                  <p className="mt-3 text-sm text-[#2B1B12]">
                    <strong>Observaciones:</strong>{" "}
                    {mascota.observaciones_medicas}
                  </p>
                )}
              </section>
            )}

            {/* Fecha de ingreso */}
            <p className="text-xs text-slate-500 mt-4">
              Fecha De Ingreso:{" "}
              {new Date(mascota.fecha_ingreso).toLocaleDateString("es-MX")}
            </p>
          </div>
        </article>

        {mascota.disponible_adopcion && (
          <MascotaPublicAdoptButton mascota={mascota} />
        )}
      </main>
    </>
  );
}
