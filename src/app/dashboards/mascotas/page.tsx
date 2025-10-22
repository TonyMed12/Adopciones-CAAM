"use client";
import React, {useEffect, useState} from "react";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/components/masc/Filters";
import MascotaCard2 from "@/components/masc/MascotaCard2";
import MascotaCardUsuario from "@/components/masc/MascotaCardUsuario";

import {listarMascotas} from "@/mascotas/mascotas-actions";

export default function MascotasPublicPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMascota, setSelectedMascota] = useState<any | null>(null);
    const [openCard, setOpenCard] = useState(false);

    // Filtros
    const [q, setQ] = useState("");
    const [especie, setEspecie] = useState("Todas");
    const [sexo, setSexo] = useState("Todos");

    async function fetchMascotas() {
        try {
            const data = await listarMascotas();

            if (!data || data.length === 0) {
                console.warn("No se encontraron mascotas en listarMascotas()");
                setItems([]);
                return;
            }

            // Solo las disponibles para adopción
            const disponibles = data.filter(
                (m) => m.disponible_adopcion === true || m.estado === "disponible" || m.activo === true
            );

            // Formatear campos para el card
            const formateadas = disponibles.map((m) => {
                const totalMeses = Number(m.edad ?? 0);
                const años = Math.floor(totalMeses / 12);
                const meses = totalMeses % 12;
                const edadFormateada =
                    años > 0
                        ? `${años} año${años > 1 ? "s" : ""}${
                              meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
                          }`
                        : `${meses} mes${meses !== 1 ? "es" : ""}`;

                const razaNombre = m.raza?.nombre || m.raza || "Mestizo";
                const especieNombre = m.raza?.especie || m.especie || "Desconocido";

                return {
                    ...m,
                    raza: razaNombre,
                    especie: especieNombre,
                    edadMeses: edadFormateada,
                    descripcion: m.personalidad || m.descripcion_fisica || m.descripcion || "Sin descripción",
                    foto: m.imagen_url || m.foto || m.imagen || m.image || m.fotoUrl || null,
                };
            });

            setItems(formateadas);
        } catch (err) {
            console.error("Error cargando mascotas:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMascotas();
    }, []);

    // Aplicar filtros
    const filteredItems = items.filter((m) => {
        const matchQ =
            q.trim() === "" ||
            m.nombre?.toLowerCase().includes(q.toLowerCase()) ||
            m.raza?.toLowerCase().includes(q.toLowerCase());

        const matchEspecie = especie === "Todas" || (m.especie && m.especie.toLowerCase() === especie.toLowerCase());

        const matchSexo = sexo === "Todos" || (m.sexo && m.sexo.toLowerCase() === sexo.toLowerCase());

        return matchQ && matchEspecie && matchSexo;
    });

    return (
        <>
            <PageHead title="Mascotas" subtitle="Explora a nuestros adorables compañeros 🐾" />

            <Filters
                q={q}
                onQ={setQ}
                especie={especie}
                onEspecie={setEspecie}
                sexo={sexo}
                onSexo={setSexo}
                ESPECIES={["Perro", "Gato", "Otro"]}
            />

            {loading ? (
                <div className="text-center py-10 text-[#7a5c49]">Cargando mascotas...</div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-10 text-[#7a5c49]">No hay resultados con esos filtros 🐾</div>
            ) : (
                <section className="grid gap-3 p-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                    {filteredItems.map((m) => (
                        <MascotaCard2
                            key={m.id}
                            m={m}
                            onView={() => {
                                setSelectedMascota(m);
                                setOpenCard(true);
                            }}
                            onAdopt={() => {
                                alert(`Solicitud de adopción para ${m.nombre}`);
                            }}
                        />
                    ))}
                </section>
            )}

            {/* Modal con la tarjeta completa */}
            <MascotaCardUsuario
                m={selectedMascota}
                open={openCard}
                onClose={() => setOpenCard(false)}
                onEdit={undefined}
                onDelete={undefined}
            />
        </>
    );
}
