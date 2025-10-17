"use client";

import React, {useMemo, useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {Plus} from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import Button from "@/components/ui/Button2";
import Modal from "@/components/ui/Modal";

import Filters from "@/components/masc/Filters";
import FormMascota from "@/components/masc/FormMascota";
import MascotasTable from "@/components/masc/MascotasTable";
import MascotaCardFull from "@/components/masc/MascotaCardFull";

// 1. TIPOS DE DATOS: Importamos los tipos del backend (Entity y DTO)
import {type MascotaEntity} from "@/mascotas/entities/mascota.entity";
import {type CreateMascotaPayload} from "@/mascotas/dto/create-mascota.dto";

// Función para calcular la edad en meses a partir de una fecha de nacimiento
function calcularEdadEnMeses(fechaNacimiento: string | null): number {
    if (!fechaNacimiento) return 0;
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    // Diferencia en milisegundos
    const diffTiempo = hoy.getTime() - fechaNac.getTime();
    // Convertir milisegundos a meses (aproximado)
    return Math.floor(diffTiempo / (1000 * 60 * 60 * 24 * 30.44));
}

export default function MascotasPage() {
    const searchParams = useSearchParams();
    const especieQS = searchParams.get("especie");

    // 2. ESTADO: El estado 'items' ahora guarda MascotaEntity y empieza vacío.
    const [items, setItems] = useState<MascotaEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [q, setQ] = useState("");
    const [especie, setEspecie] = useState<string>("Todas");
    const [sexo, setSexo] = useState<string>("Todos");
    const [openForm, setOpenForm] = useState(false);
    const [sel, setSel] = useState<MascotaEntity | null>(null);

    // 3. CARGA DE DATOS (GET): Obtenemos las mascotas de la API al cargar la página.
    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/mascotas");
                if (!response.ok) {
                    throw new Error("No se pudieron cargar las mascotas.");
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
            } finally {
                setLoading(false);
            }
        };

        fetchMascotas();
    }, []);

    useEffect(() => {
        const val = (especieQS || "").trim();
        if (val) {
            // Suponemos que ESPECIES viene de alguna constante
            // if (val && (val === "Todas" || ESPECIES.includes(val))) {
            setEspecie(val);
        }
    }, [especieQS]);

    // 4. TRANSFORMACIÓN Y FILTRADO: 'useMemo' ahora filtra los datos reales y los adapta para la UI.
    const dataParaTabla = useMemo(() => {
        const filteredItems = items.filter((m) => {
            const qLower = q.trim().toLowerCase();

            const matchesQ =
                qLower === "" ||
                [m.nombre, m.raza?.nombre, m.personalidad, m.raza?.especie].some((v) =>
                    (v ?? "").toLowerCase().includes(qLower)
                );

            const matchesEsp = especie === "Todas" || (m.raza?.especie ?? "").toLowerCase() === especie.toLowerCase();

            const matchesSexo = sexo === "Todos" || m.sexo === sexo;

            return matchesQ && matchesEsp && matchesSexo;
        });

        // Mapeamos los datos filtrados a la estructura que esperan los componentes de la UI
        return filteredItems.map((m) => ({
            id: m.id,
            nombre: m.nombre,
            especie: m.raza?.especie || "Desconocido",
            raza: m.raza?.nombre || "Mestizo",
            sexo: m.sexo, // Ya es "Macho" o "Hembra"
            tamano: m.raza?.tamano || "mediano",
            edadMeses: calcularEdadEnMeses(m.edad),
            descripcion: m.personalidad || m.descripcion_fisica || "",
            foto: m.imagen_url,
            activo: m.disponible_adopcion,
        }));
    }, [items, q, especie, sexo]);

    // 5. CREACIÓN DE MASCOTAS (POST): La función onSubmit ahora es asíncrona y llama a la API.
    async function onSubmit(formData: CreateMascotaPayload) {
        try {
            const response = await fetch("/api/mascotas", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const nuevaMascota = await response.json();

            if (!response.ok) {
                // Si el backend envía errores de validación, podrías mostrarlos aquí
                throw new Error(nuevaMascota.message || "Error al crear la mascota.");
            }

            // Agregamos la nueva mascota (MascotaEntity) al inicio de la lista
            setItems((prevItems) => [nuevaMascota, ...prevItems]);
            setOpenForm(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
        }
    }

    return (
        <>
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
                // Asegúrate de tener una constante ESPECIES disponible
                ESPECIES={["Perro", "Gato", "Otro"]}
            />

            {/* 6. RENDERIZADO CONDICIONAL: Mostramos estados de carga y error */}
            {loading && <div className="text-center py-10">Cargando mascotas...</div>}
            {error && <div className="text-center text-red-600 py-10">{error}</div>}

            {!loading && !error && (
                <MascotasTable
                    data={dataParaTabla}
                    actions={{
                        // Al seleccionar, buscamos la entidad original completa para mostrarla en el modal
                        onViewCard: (m) => setSel(items.find((i) => i.id === m.id) || null),
                        onEdit: (m) => setSel(items.find((i) => i.id === m.id) || null),
                        onDelete: (m) => {
                            if (!confirm(`¿Eliminar a ${m.nombre}?`)) return;
                            // Lógica de borrado (por ahora local, idealmente sería una llamada a la API)
                            setItems((prev) => prev.filter((x) => x.id !== m.id));
                        },
                    }}
                    deleteDisabledForId={() => false}
                />
            )}

            {/* El modal ahora recibe la entidad completa 'sel' y la adapta */}
            {sel && (
                <MascotaCardFull
                    m={{
                        id: sel.id,
                        nombre: sel.nombre,
                        especie: sel.raza?.especie || "Desconocido",
                        raza: sel.raza?.nombre || "Mestizo",
                        sexo: sel.sexo,
                        tamano: sel.raza?.tamano || "mediano",
                        edadMeses: calcularEdadEnMeses(sel.edad),
                        descripcion: sel.personalidad || sel.descripcion_fisica || "",
                        foto: sel.imagen_url,
                        activo: sel.disponible_adopcion,
                    }}
                    open={!!sel}
                    onClose={() => setSel(null)}
                    onEdit={() => sel && setSel(sel)}
                    onDelete={() => {
                        if (!sel || !confirm(`¿Eliminar a ${sel.nombre}?`)) return;
                        setItems((prev) => prev.filter((x) => x.id !== sel.id));
                        setSel(null);
                    }}
                />
            )}

            <Modal open={openForm} onClose={() => setOpenForm(false)} title="Agregar mascota">
                {/* Asegúrate que FormMascota ahora use onSubmit con CreateMascotaPayload */}
                <FormMascota onCancel={() => setOpenForm(false)} onSubmit={onSubmit as any} />
            </Modal>
        </>
    );
}
