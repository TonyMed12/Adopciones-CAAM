"use client";
import type { Mascota } from "@/types/mascotas.types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import React, { useState } from "react";

function getFotoSrc(m: Partial<Mascota>) {
  return (
    (m as any).foto ||
    (m as any).fotoUrl ||
    (m as any).imagen ||
    (m as any).image ||
    (m as any).img ||
    m.imagen_url ||
    "/no-image.png"
  );
}

export default function MascotaCardUsuario({
  m,
  open,
  onClose,
  onAdopt,
  adoptDisabled = false,
}: {
  m: Mascota | null;
  open: boolean;
  onClose: () => void;
  onAdopt: () => void;
  adoptDisabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!m) return null;

  const fotoSrc = getFotoSrc(m);

  const { data: qrData } = supabase.storage
    .from("mascotas-qr")
    .getPublicUrl(m.qr_code || "");

  const qrUrl = qrData?.publicUrl || null;

  const razaNombre =
    typeof m.raza === "string" ? m.raza : (m.raza as any)?.nombre || "Mestizo";

  const especieNombre =
    (m.raza as any)?.especie ||
    (typeof (m as any).especie === "string"
      ? (m as any).especie
      : "Desconocido");

  const esHembra =
    m.sexo?.toLowerCase().startsWith("he") ||
    m.sexo?.toLowerCase().startsWith("fe") ||
    ["h", "f"].includes(m.sexo?.toLowerCase());

  const sexoLabel = m.sexo
    ? m.sexo.charAt(0).toUpperCase() + m.sexo.slice(1).toLowerCase()
    : "Sin dato";

  const coloresFormatted =
    m.colores?.length > 0
      ? m.colores.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
      : null;

  const handleVerQR = () => {
    if (!qrUrl) return;
    setShowQrModal(true);
  };

  // Descargar QR (PC y la mayoría de Android)
  const handleDescargarQR = async () => {
    if (!qrUrl) return;

    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${m.nombre}-qr.png`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar QR", err);
    }
  };

  // Compartir QR (PC compatible + Android + iOS)
  const handleCompartirQR = async () => {
    const linkQR = `https://caamorelia.vercel.app/mascota/${m.id}`;

    // 📱 ANDROID / iOS — con archivo adjunto
    if (navigator.share) {
      try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const file = new File([blob], `${m.nombre}-qr.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: `Conoce a ${m.nombre}`,
          text: `🐾 *Conoce a ${m.nombre}\n\nAquí tienes su código QR y su enlace directo:\n${linkQR}\n\nSi deseas adoptarla o ver más información, abre el enlace o escanea el QR.`,
          files: [file],
        });

        return;
      } catch (err) {
        console.warn("El usuario canceló compartir:", err);
      }
    }

    // 💻 PC — Copiar enlace al portapapeles
    try {
      const mensajePC = `🐾 Conoce a ${m.nombre}\n\nAquí está su enlace directo:\n${linkQR}\n\nDesde este link puedes ver toda su información y adoptarla.`;

      await navigator.clipboard.writeText(mensajePC);
      console.log("🔗 Link copiado:", linkQR);

      // Pequeño toast visual
      const t = document.createElement("div");
      t.innerHTML = `Información copiada al portapapeles`;
      t.className = `
      fixed bottom-6 left-1/2 -translate-x-1/2 
      bg-black text-white px-4 py-2 
      rounded-xl shadow-lg text-sm opacity-0
      transition-all duration-300 z-[99999]
    `;
      document.body.appendChild(t);

      requestAnimationFrame(() => (t.style.opacity = "1"));
      setTimeout(() => {
        t.style.opacity = "0";
        setTimeout(() => t.remove(), 300);
      }, 2000);
    } catch (err) {
      console.error("No se pudo copiar:", err);
    }
  };

  // 🎨 Títulos de sección suaves
  const tituloSuave = {
    color: "#CDA285",
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: "0.2px",
    marginBottom: "10px",
    display: "inline-block",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8"
          onClick={onClose}
        >
          <motion.article
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-[#FFF8F2] rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden border-[4px] border-[#FF8414] font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <div className="relative h-full bg-[#F4E5D5]">
              <img
                src={fotoSrc}
                alt={m.nombre}
                className="w-full h-full object-cover"
              />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg
                    ${esHembra ? "bg-pink-500/90" : "bg-blue-500/90"}
                  `}
                >
                  {sexoLabel}
                </span>

                {m.estado?.toLowerCase() === "disponible" && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow">
                    Disponible
                  </span>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent text-white px-6 py-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {m.nombre}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200">
                  {razaNombre} • {especieNombre}
                </p>
              </div>
            </div>

            {/* Info con SCROLL */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh] text-[#2B1B12] text-base">
              {/* ⭐ SECCIÓN 1 */}
              <h3 style={tituloSuave}>Información general</h3>

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mb-6 mt-2">
                <div>
                  <dt className="font-semibold text-slate-700">Tamaño</dt>
                  <dd className="capitalize mt-1">{m.tamano || "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Edad</dt>
                  <dd className="mt-1">{m.edad ? `${m.edad} meses` : "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Peso</dt>
                  <dd className="mt-1">
                    {m.peso_kg ? `${m.peso_kg} kg` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Altura</dt>
                  <dd className="mt-1">
                    {m.altura_cm ? `${m.altura_cm} cm` : "—"}
                  </dd>
                </div>
              </dl>

              {/* ⭐ SECCIÓN 2 */}
              <h3 style={tituloSuave}>Detalles adicionales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6 mt-2">
                <div>
                  <h4 className="font-semibold text-slate-700">Esterilizado</h4>
                  <p className="mt-1">{m.esterilizado ? "Sí" : "No"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700">Colores</h4>
                  <p className="mt-1">{coloresFormatted || "—"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700">Personalidad</h4>
                  <p className="capitalize mt-1">{m.personalidad || "—"}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700">
                    Descripción física
                  </h4>
                  <p className="mt-1">{m.descripcion_fisica || "—"}</p>
                </div>
              </div>

              {/* ⭐ SECCIÓN 3 */}
              {(m.lugar_rescate ||
                m.condicion_ingreso ||
                m.observaciones_medicas) && (
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <h3 style={tituloSuave}>Datos médicos y rescate</h3>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
                    {m.lugar_rescate && (
                      <div>
                        <dt className="font-semibold text-slate-700">
                          Lugar de rescate
                        </dt>
                        <dd className="mt-1">{m.lugar_rescate}</dd>
                      </div>
                    )}

                    {m.condicion_ingreso && (
                      <div>
                        <dt className="font-semibold text-slate-700">
                          Condición al ingreso
                        </dt>
                        <dd className="mt-1">{m.condicion_ingreso}</dd>
                      </div>
                    )}
                  </dl>

                  {m.observaciones_medicas && (
                    <p className="mt-2">
                      <strong className="font-semibold text-slate-700">
                        Observaciones:
                      </strong>{" "}
                      {m.observaciones_medicas}
                    </p>
                  )}
                </div>
              )}

              {m.fecha_ingreso && (
                <p className="text-xs text-slate-500 mt-4">
                  Fecha de ingreso:{" "}
                  {new Date(m.fecha_ingreso).toLocaleDateString("es-MX")}
                </p>
              )}

              {qrUrl && (
                <div className="flex flex-col items-center mt-6">
                  <h3 style={tituloSuave}>Código QR</h3>
                  <img
                    src={qrUrl}
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain border rounded-xl p-2 bg-white shadow-md mt-2"
                  />
                  <Button
                    variant="ghost"
                    className="mt-2 text-[#FF8414]"
                    onClick={handleVerQR}
                  >
                    Ver QR
                  </Button>

                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="ghost"
                      className="text-[#FF8414]"
                      onClick={handleDescargarQR}
                    >
                      Descargar
                    </Button>

                    <Button
                      variant="ghost"
                      className="text-[#FF8414]"
                      onClick={handleCompartirQR}
                    >
                      Compartir
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
                <Button
                  variant="primary"
                  className="bg-[#FF8414] hover:bg-[#e6730f]"
                  disabled={loading || adoptDisabled}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => onAdopt(), 150);
                  }}
                >
                  {loading ? "Procesando..." : "Adoptar"}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {showQrModal && qrUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4"
                  onClick={() => setShowQrModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col items-center"
                  >
                    <div className="w-full flex justify-between items-center mb-4">
                      <h4 className="text-sm font-extrabold text-[#2B1B12]">
                        Código QR de {m.nombre}
                      </h4>
                      <button
                        onClick={() => setShowQrModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 transition"
                      >
                        <X className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                    <img
                      src={qrUrl}
                      alt={`QR de ${m.nombre}`}
                      className="w-48 h-48 object-contain border rounded-xl p-3 bg-white shadow-md"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
