"use client";
import React, {useEffect, useState} from "react";
import {Plus} from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import Button from "@/components/ui/Button2";
import Modal from "@/components/ui/Modal";

import Filters from "@/components/masc/Filters";
import FormMascota from "@/components/masc/FormMascota";
import MascotasTable from "@/components/masc/MascotasTable";
import MascotaCardFull from "@/components/masc/MascotaCardFull";

import {listarMascotas, eliminarMascota} from "@/mascotas/mascotas-actions";

export default function MascotasPage() {
    const [openForm, setOpenForm] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMascota, setSelectedMascota] = useState<any | null>(null);
    const [openCard, setOpenCard] = useState(false);

    // Pa los filtros
    const [q, setQ] = useState("");
    const [especie, setEspecie] = useState("Todas");
    const [sexo, setSexo] = useState("Todos");

    async function fetchMascotas() {
        try {
            const data = await listarMascotas();
            setItems(data);
        } catch (err) {
            console.error("Error cargando mascotas:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMascotas();
    }, []);

    const filteredItems = items.filter((m) => {
        const matchQ =
            q.trim() === "" ||
            m.nombre?.toLowerCase().includes(q.toLowerCase()) ||
            m.raza?.nombre?.toLowerCase().includes(q.toLowerCase());

        const matchEspecie =
            especie === "Todas" || (m.raza?.especie && m.raza.especie.toLowerCase() === especie.toLowerCase());

        const matchSexo = sexo === "Todos" || m.sexo?.toLowerCase() === sexo.toLowerCase();

        return matchQ && matchEspecie && matchSexo;
    });

    const dataParaTabla = filteredItems.map((m) => {
        const totalMeses = Number(m.edad ?? 0);
        const años = Math.floor(totalMeses / 12);
        const meses = totalMeses % 12;
        const edadFormateada =
            años > 0
                ? `${años} año${años > 1 ? "s" : ""}${meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""}`
                : `${meses} mes${meses !== 1 ? "es" : ""}`;

        const especie = m.raza?.especie || "Desconocido";
        const raza = m.raza?.nombre || "Mestizo";

        return {
            id: m.id,
            nombre: m.nombre,
            especie,
            raza,
            sexo: m.sexo,
            tamano: m.tamano,
            edadMeses: edadFormateada,
            descripcion: m.personalidad || m.descripcion_fisica || "",
            foto: m.imagen_url,
        };
    });

    return (
        <>
            <Modal open={openForm} onClose={() => setOpenForm(false)} title="Agregar Mascota">
                <FormMascota
                    onCancel={() => setOpenForm(false)}
                    onSubmit={async (nuevaMascota) => {
                        await fetchMascotas();
                        setOpenForm(false);
                    }}
                />
            </Modal>

            <PageHead
                title="Mascotas"
                subtitle="Explora a nuestros adorables compañeros 🐾"
                right={
                    <Button onClick={() => setOpenForm(true)}>
                        <Plus size={18} /> Agregar
                    </Button>
                }
            />

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
                <div className="text-center py-10">Cargando mascotas...</div>
            ) : (
                <div className="p-4">
                    <MascotasTable
                        data={dataParaTabla as any}
                        actions={{
                            onViewCard: (rowMascota) => {
                                const mascotaCompleta = items.find((item) => item.id === rowMascota.id);
                                setSelectedMascota(mascotaCompleta);
                                setOpenCard(true);
                            },
                            onEdit: () => {},
                            onDelete: async (item: any) => {
                                const id = typeof item === "string" ? item : item?.id;
                                if (!id) {
                                    alert("No se pudo determinar el ID de la mascota 😿");
                                    return;
                                }

                                if (!confirm("¿Seguro que quieres eliminar esta mascota? 🐾")) return;

                                try {
                                    await eliminarMascota(id);
                                    alert("Mascota eliminada correctamente 🗑️");
                                    await fetchMascotas();
                                } catch (err: any) {
                                    console.error("Error eliminando mascota:", err);
                                    alert(err.message || "No se pudo eliminar la mascota");
                                }
                            },
                        }}
                        deleteDisabledForId={() => false}
                    />
                </div>
            )}

            <MascotaCardFull
                m={selectedMascota}
                open={openCard}
                onClose={() => setOpenCard(false)}
                onEdit={() => {
                    console.log("Editar mascota:", selectedMascota);
                }}
                onDelete={async () => {
                    if (!selectedMascota) return;
                    if (!confirm("¿Seguro que quieres eliminar esta mascota? 🐾")) return;

                    try {
                        await eliminarMascota(selectedMascota.id);
                        setItems((prev) => prev.filter((m) => m.id !== selectedMascota.id));
                        setOpenCard(false);
                        alert("Mascota eliminada correctamente 🗑️");
                    } catch (err: any) {
                        console.error("Error eliminando mascota:", err);
                        alert(err.message || "Error eliminando mascota");
                    }
                }}
            />
        </>
    );
}
