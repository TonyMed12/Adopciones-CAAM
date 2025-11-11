"use client";
import type {Mascota} from "@/types/mascotas.types";
import {X} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {motion, AnimatePresence} from "framer-motion";
import {supabase} from "@/lib/supabase/client";
import React, {useState} from "react";

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

type Props = {
    m: Mascota | null;
    open: boolean;
    onClose: () => void;
    onAdopt: () => void;
    adoptDisabled?: boolean;
};

export default function MascotaCardUsuario({m, open, onClose, onAdopt, adoptDisabled = false}: Props) {
    const [loading, setLoading] = useState(false);
    if (!m) return null;

    const fotoSrc = getFotoSrc(m);

    // ✅ Obtener el URL público del QR (igual que en MascotaCardFull)
    const {data: qrData} = supabase.storage.from("mascotas-qr").getPublicUrl(m.qr_code || "");

    const qrUrl = qrData?.publicUrl || null;

    // 🐶 Fallbacks para raza y especie
    const razaNombre = m.raza || "Mestizo";
    const especieNombre =
        m.raza?.especie || (typeof (m as any).especie === "string" ? (m as any).especie : "Desconocido");

    // ✅ Abrir QR en una nueva pestaña
    const handleVerQR = () => {
        if (qrUrl) window.open(qrUrl, "_blank");
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm px-4 py-8"
                    onClick={onClose}
                >
                    <motion.article
                        key="card"
                        initial={{opacity: 0, scale: 0.95, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.95, y: 20}}
                        transition={{duration: 0.25}}
                        className="relative z-10 w-[min(1100px,92vw)] max-h-[90vh] bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden border-[4px] border-[#FF8414]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 📸 Imagen */}
                        <div className="relative h-full bg-gray-100">
                            <img src={fotoSrc} alt={m.nombre} className="w-full h-full object-cover" />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow transition"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5 text-gray-700" />
                            </button>
                            <span
                                className={`absolute left-4 top-4 px-3 py-1 rounded-full text-white font-semibold text-sm shadow ${
                                    m.sexo === "Hembra" ? "bg-pink-500" : "bg-blue-500"
                                }`}
                            >
                                {m.sexo}
                            </span>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-6 py-4">
                                <h2 className="text-3xl font-bold">{m.nombre}</h2>
                                <p className="text-sm text-gray-200">
                                    {razaNombre} • {especieNombre}
                                </p>
                            </div>
                        </div>

                        {/* 🐾 Info */}
                        <div className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[90vh] text-[#2b1b12]">
                            <section className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {m.disponible_adopcion === false && (
                                        <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm font-semibold">
                                            No disponible
                                        </span>
                                    )}
                                    {m.estado && (
                                        <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">
                                            {m.estado}
                                        </span>
                                    )}
                                </div>

                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div>
                                        <dt className="font-semibold text-slate-700">Tamaño</dt>
                                        <dd>{m.tamano || "—"}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-700">Edad</dt>
                                        <dd>{m.edad ? `${m.edad} meses` : "—"}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-700">Peso</dt>
                                        <dd>{m.peso_kg ? `${m.peso_kg} kg` : "—"}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-700">Altura</dt>
                                        <dd>{m.altura_cm ? `${m.altura_cm} cm` : "—"}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-700">Esterilizado</dt>
                                        <dd>{m.esterilizado ? "Sí" : "No"}</dd>
                                    </div>
                                </dl>

                                {m.colores?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mt-2 text-slate-800">Colores</h3>
                                        <p>{m.colores.join(", ")}</p>
                                    </div>
                                )}

                                {m.personalidad && (
                                    <div>
                                        <h3 className="font-semibold mt-2 text-slate-800">Personalidad</h3>
                                        <p className="capitalize">{m.personalidad}</p>
                                    </div>
                                )}

                                {m.descripcion_fisica && (
                                    <div>
                                        <h3 className="font-semibold mt-2 text-slate-800">Descripción Física</h3>
                                        <p>{m.descripcion_fisica}</p>
                                    </div>
                                )}

                                {(m.lugar_rescate || m.condicion_ingreso || m.observaciones_medicas) && (
                                    <div className="border-t border-slate-200 pt-3 mt-3">
                                        <h3 className="font-semibold text-slate-800 mb-1">
                                            Datos Médicos y de Rescate
                                        </h3>
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            {m.lugar_rescate && (
                                                <div>
                                                    <dt className="font-semibold text-slate-700">Lugar de rescate</dt>
                                                    <dd>{m.lugar_rescate}</dd>
                                                </div>
                                            )}
                                            {m.condicion_ingreso && (
                                                <div>
                                                    <dt className="font-semibold text-slate-700">
                                                        Condición al ingreso
                                                    </dt>
                                                    <dd>{m.condicion_ingreso}</dd>
                                                </div>
                                            )}
                                        </dl>
                                        {m.observaciones_medicas && (
                                            <p className="mt-2 text-slate-700 text-sm">
                                                <strong>Observaciones:</strong> {m.observaciones_medicas}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {m.fecha_ingreso && (
                                    <p className="text-xs text-slate-500 mt-4">
                                        Fecha de ingreso: {new Date(m.fecha_ingreso).toLocaleDateString("es-MX")}
                                    </p>
                                )}

                                {/* 🧾 QR + botón “Ver QR” */}
                                {qrUrl && (
                                    <div className="flex flex-col items-center mt-6">
                                        <h3 className="font-semibold text-slate-800 mb-2">Código QR</h3>
                                        <img
                                            src={qrUrl}
                                            alt="Código QR"
                                            className="w-32 h-32 object-contain border rounded-xl p-2 bg-white shadow"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 text-[#FF8414]"
                                            onClick={handleVerQR}
                                        >
                                            Ver QR
                                        </Button>
                                    </div>
                                )}
                            </section>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => {
                                        if (loading || adoptDisabled) return;
                                        setLoading(true);

                                        // ✅ Esperar un pequeño frame antes de llamar al padre
                                        setTimeout(() => {
                                            onAdopt();
                                        }, 150);
                                    }}
                                    disabled={adoptDisabled || loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Procesando...
                                        </div>
                                    ) : (
                                        "Adoptar"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.article>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
