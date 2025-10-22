"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {supabase} from "@/lib/supabase/client";
import type {Mascota} from "@/mascotas/mascotas";

export default function MascotaPublicPage() {
    const {id} = useParams();
    const [mascota, setMascota] = useState<Mascota | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMascota() {
            const {data, error} = await supabase
            .from("mascotas")
            .select("*, raza:raza_id(id, nombre, especie)")
            .eq("id", id)
            .single();

            if (error) {
                console.error("❌ Error al cargar mascota:", error.message);
            } else {
                setMascota(data as Mascota);
            }
            setLoading(false);
        }

        if (id) fetchMascota();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Cargando información de la mascota...
            </div>
        );
    }

    if (!mascota) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">Mascota no encontrada 🐾</div>
        );
    }

    const fotoSrc = mascota.imagen_url || "/no-image.png";

    return (
        <main className="min-h-screen bg-[#fff4e7] flex flex-col items-center justify-center p-6">
            <article className="relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-xl border-[4px] border-[#FF8414] bg-white">
                {/* 📸 Imagen principal */}
                <div className="relative">
                    <img
                        src={fotoSrc}
                        alt={mascota.nombre}
                        className="w-full h-[500px] object-cover brightness-[0.8]"
                    />

                    {/* 🏷️ Información superpuesta */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent text-white p-8">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-4xl font-bold">{mascota.nombre}</h1>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    mascota.disponible_adopcion ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                }`}
                            >
                                {mascota.disponible_adopcion ? "Disponible" : "No disponible"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-200 mb-2">
                            {mascota.raza?.nombre || "Mestizo"} • {mascota.raza?.especie || "Desconocido"}
                        </p>
                        <div className="flex gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-white font-semibold text-sm shadow ${
                                    mascota.sexo === "Hembra" ? "bg-pink-500" : "bg-blue-500"
                                }`}
                            >
                                {mascota.sexo}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold shadow">
                                {mascota.tamano}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 📋 Detalles */}
                <div className="p-6 md:p-8 text-[#2b1b12]">
                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                        <div>
                            <dt className="font-semibold text-slate-700">Edad</dt>
                            <dd>{mascota.edad ? `${mascota.edad} meses` : "—"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">Peso</dt>
                            <dd>{mascota.peso_kg ? `${mascota.peso_kg} kg` : "—"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">Altura</dt>
                            <dd>{mascota.altura_cm ? `${mascota.altura_cm} cm` : "—"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">Esterilizado</dt>
                            <dd>{mascota.esterilizado ? "Sí" : "No"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">Personalidad</dt>
                            <dd className="capitalize">{mascota.personalidad || "Por evaluar"}</dd>
                        </div>
                        {mascota.colores?.length > 0 && (
                            <div>
                                <dt className="font-semibold text-slate-700">Colores</dt>
                                <dd>{mascota.colores.join(", ")}</dd>
                            </div>
                        )}
                    </dl>

                    {mascota.descripcion_fisica && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-slate-800 mb-1">Descripción Física</h3>
                            <p>{mascota.descripcion_fisica}</p>
                        </div>
                    )}

                    {(mascota.lugar_rescate || mascota.condicion_ingreso || mascota.observaciones_medicas) && (
                        <div className="mt-6 border-t border-slate-200 pt-4">
                            <h3 className="font-semibold text-slate-800 mb-1">Datos Médicos y de Rescate</h3>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {mascota.lugar_rescate && (
                                    <div>
                                        <dt className="font-semibold text-slate-700">Lugar de rescate</dt>
                                        <dd>{mascota.lugar_rescate}</dd>
                                    </div>
                                )}
                                {mascota.condicion_ingreso && (
                                    <div>
                                        <dt className="font-semibold text-slate-700">Condición al ingreso</dt>
                                        <dd>{mascota.condicion_ingreso}</dd>
                                    </div>
                                )}
                            </dl>
                            {mascota.observaciones_medicas && (
                                <p className="mt-2 text-slate-700 text-sm">
                                    <strong>Observaciones:</strong> {mascota.observaciones_medicas}
                                </p>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-slate-500 mt-6">
                        Fecha de ingreso: {new Date(mascota.fecha_ingreso).toLocaleDateString("es-MX")}
                    </p>
                </div>
            </article>
        </main>
    );
}
