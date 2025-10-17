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

import {listarMascotas} from "@/mascotas/mascotas-actions";

export default function MascotasPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);

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

    const dataParaTabla = items.map((m) => {
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
                        await fetchMascotas(); // 👈 recarga la tabla desde la BD
                        setOpenForm(false); // 👈 cierra el modal
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
                q=""
                onQ={() => {}}
                especie="Todas"
                onEspecie={() => {}}
                sexo="Todos"
                onSexo={() => {}}
                ESPECIES={["Perro", "Gato", "Otro"]}
            />

            {loading ? (
                <div className="text-center py-10">Cargando mascotas...</div>
            ) : (
                <div className="p-4">
                    <MascotasTable
                        data={dataParaTabla as any}
                        actions={{
                            onViewCard: () => {},
                            onEdit: () => {},
                            onDelete: () => {},
                        }}
                        deleteDisabledForId={() => false}
                    />
                </div>
            )}

            <MascotaCardFull
                m={{
                    id: "",
                    nombre: "",
                    especie: "",
                    raza: "",
                    sexo: "Macho",
                    tamano: "pequeño",
                    edadMeses: 0,
                    descripcion: "",
                    foto: "",
                    activo: true,
                }}
                open={false}
                onClose={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
            />
        </>
    );
}
