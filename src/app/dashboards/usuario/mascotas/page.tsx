"use client";

import React, {useMemo, useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/components/masc/Filters";
import MascotaCard from "@/components/masc/MascotaCard";
import MascotaCardUsuario from "@/components/masc/MascotaCardUsuario";
import {Button} from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {supabase} from "@/lib/supabase/client";

import {listarMascotas} from "@/mascotas/mascotas-actions";
import {ESPECIES} from "@/data/masc/constants";
import type {Mascota, Sexo} from "@/data/masc/types";

type DocEstado = "aprobado" | "en_revision" | "rechazado" | "sin_documentos";

export default function MascotasPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const especieQS = searchParams.get("especie");

    const [items, setItems] = useState<Mascota[]>([]);
    const [loading, setLoading] = useState(true);

    const [q, setQ] = useState("");
    const [especie, setEspecie] = useState<string>(() => {
        const val = (especieQS || "").trim();
        if (val && (val === "Todas" || (ESPECIES as readonly string[]).includes(val))) return val;
        return "Todas";
    });
    const [sexo, setSexo] = useState<string>("Todos");

    // Estado real de documentos
    const [docEstado, setDocEstado] = useState<DocEstado>("sin_documentos");

    // Estados para modales
    const [gateOpen, setGateOpen] = useState(false);
    const [selected, setSelected] = useState<Mascota | null>(null);

    // Modal de card de usuario
    const [openCard, setOpenCard] = useState(false);
    const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
    useEffect(() => {
        async function fetchEstado() {
            const {
                data: {user},
            } = await supabase.auth.getUser();
            if (!user) return;

            const {data: docs, error} = await supabase.from("documentos").select("status").eq("perfil_id", user.id);

            if (error) {
                console.error("Error al obtener estado de documentos:", error);
                return;
            }

            if (!docs || docs.length === 0) {
                setDocEstado("sin_documentos");
                return;
            }

            const estados = docs.map((d) => d.status);
            if (estados.every((s) => s === "aprobado")) setDocEstado("aprobado");
            else if (estados.some((s) => s === "rechazado")) setDocEstado("rechazado");
            else setDocEstado("en_revision");
        }

        fetchEstado();
    }, []);
    useEffect(() => {
        async function fetchMascotas() {
            try {
                setLoading(true);
                const data = await listarMascotas();

                if (!data || data.length === 0) {
                    console.warn("No hay mascotas disponibles");
                    setItems([]);
                    return;
                }

                // Solo mostrar las disponibles
                const disponibles = data.filter(
                    (m: any) => m.disponible_adopcion === true || m.estado === "disponible" || m.activo === true
                );

                // Formatear campos
                const formateadas = disponibles.map((m: any) => {
                    const totalMeses = Number(m.edad ?? 0);
                    const años = Math.floor(totalMeses / 12);
                    const meses = totalMeses % 12;
                    const edadFormateada =
                        años > 0
                            ? `${años} año${años > 1 ? "s" : ""}${
                                  meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
                              }`
                            : `${meses} mes${meses !== 1 ? "es" : ""}`;

                    const especie = m.raza?.especie || m.especie || "Desconocido";
                    const raza = m.raza?.nombre || "Mestizo";

                    return {
                        ...m,
                        edadMeses: edadFormateada,
                        especie,
                        raza,
                        descripcion: m.personalidad || m.descripcion_fisica || "",
                        foto: m.imagen_url,
                    } as Mascota;
                });

                setItems(formateadas);
            } catch (err) {
                console.error("Error al listar mascotas:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchMascotas();
    }, []);
    useEffect(() => {
        const val = (especieQS || "").trim();
        if (val && (val === "Todas" || (ESPECIES as readonly string[]).includes(val))) {
            setEspecie(val);
        }
    }, [especieQS]);

    const data = useMemo(() => {
        return items.filter((m) => {
            const matchesQ = [m.nombre, m.raza, m.descripcion, m.especie].some((v) =>
                v?.toLowerCase().includes(q.toLowerCase())
            );

            const matchesEsp = especie === "Todas" || m.especie === especie;

            const matchesSexo = sexo === "Todos" || m.sexo?.toLowerCase() === sexo.toLowerCase();

            return matchesQ && matchesEsp && matchesSexo;
        });
    }, [items, q, especie, sexo]);

    // ----------------------------------------------------
    // 🐕 Adopción
    // ----------------------------------------------------
    async function handleAdopt(m: Mascota) {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Debes iniciar sesión para adoptar una mascota.");
            return;
        }

        if (docEstado !== "aprobado") {
            setSelected(m);
            setGateOpen(true);
            return;
        }
        // Verificar si ya existe una solicitud pendiente para esta mascota y usuario
        const { data: existente } = await supabase
        .from("solicitudes_adopcion")
        .select("id, estado")
        .eq("usuario_id", user.id)
        .eq("mascota_id", m.id)
        .in("estado", ["pendiente", "aprobada"]);

        if (existente && existente.length > 0) {
        alert("Ya tienes una solicitud activa para esta mascota 🐾");
        return;
        }
        try {
            // Crear solicitud
            const numero = "SOL-" + Math.floor(100000 + Math.random() * 900000); // Ejemplo simple
            const { data: solicitud, error } = await supabase
            .from("solicitudes_adopcion")
            .insert([
                {
                numero_solicitud: numero,
                usuario_id: user.id,
                mascota_id: m.id,
                motivo_adopcion: "Pendiente de llenar",
                estado: "pendiente",
                },
            ])
            .select()
            .single();

            if (error) throw error;

            // Actualizar mascota
            await supabase
            .from("mascotas")
            .update({ estado: "en_proceso", disponible_adopcion: false })
            .eq("id", m.id);

            alert("Tu solicitud fue registrada exitosamente 🐾");
            router.push(`/dashboards/usuario/adopcion/`);
        } catch (err) {
            console.error(err);
            alert("Hubo un error al registrar la solicitud.");
        }
    }
    const estadoText: Record<DocEstado, {title: string; desc: string; tone: "info" | "warn" | "ok" | "error"}> = {
        sin_documentos: {
            title: "Necesitas validar tus documentos para poder solicitar una adopción",
            desc: "Sube identificación, domicilio y carta compromiso.",
            tone: "warn",
        },
        en_revision: {
            title: "Documentos en revisión",
            desc: "Un administrador está revisando tus archivos.",
            tone: "info",
        },
        rechazado: {
            title: "Documentos con observaciones",
            desc: "Corrige lo indicado y vuelve a enviar.",
            tone: "error",
        },
        aprobado: {
            title: "Validación completa",
            desc: "Ya puedes iniciar el proceso de adopción.",
            tone: "ok",
        },
    };

    const toneClasses = {
        info: "border-[#eadacb] bg-[#fff4e7]",
        warn: "border-[#eadacb] bg-[#fff4e7]",
        ok: "border-[#dbead3] bg-[#f3fff3]",
        error: "border-[#f2d6d6] bg-[#fff5f5]",
    } as const;

    return (
        <>
            <PageHead title="Mascotas" subtitle="Encuentra a tu nuevo mejor amigo 🐾" />

            {/* Banner de estado */}
            <div className={`mb-4 rounded-xl border px-4 py-3 ${toneClasses[estadoText[docEstado].tone]} text-sm`}>
                <p className="font-extrabold text-[#2b1b12]">{estadoText[docEstado].title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[#7a5c49]">
                    <span>{estadoText[docEstado].desc}</span>
                    {docEstado !== "aprobado" && (
                        <Button className="px-3 py-2" onClick={() => router.push("/dashboards/usuario/adopcion")}>
                            Completar verificación
                        </Button>
                    )}
                </div>
            </div>

            <Filters
                q={q}
                onQ={setQ}
                especie={especie}
                onEspecie={setEspecie}
                sexo={sexo}
                onSexo={setSexo}
                ESPECIES={ESPECIES}
            />

            {loading ? (
                <div className="py-10 text-center text-[#7a5c49]">Cargando mascotas...</div>
            ) : (
                <section className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                    {data.map((m) => (
                        <MascotaCard
                            key={m.id}
                            m={m}
                            onView={() => {
                                setSelectedMascota(m);
                                setOpenCard(true);
                            }}
                            onAdopt={() => handleAdopt(m)}
                        />
                    ))}
                    {data.length === 0 && (
                        <div className="col-span-full py-10 text-center text-[#7a5c49]">
                            No hay resultados con esos filtros
                        </div>
                    )}
                </section>
            )}

            {/* Modal bloqueo adopción */}
            <Modal open={gateOpen} onClose={() => setGateOpen(false)} title="Antes de adoptar">
                <div className="p-4 text-[#2b1b12]">
                    <p className="text-sm">
                        Para adoptar a <span className="font-extrabold">{selected?.nombre}</span> primero necesitamos
                        validar tus documentos:
                    </p>
                    <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
                        <li>• Identificación oficial (INE / Pasaporte)</li>
                        <li>• Comprobante de domicilio (≤ 3 meses)</li>
                        <li>• Carta compromiso firmada</li>
                    </ul>

                    <div className="mt-5 flex justify-end gap-3">
                        <Button variant="ghost" className="px-4 py-2" onClick={() => setGateOpen(false)}>
                            Luego
                        </Button>
                        <Button
                            className="px-4 py-2"
                            onClick={() => {
                                setGateOpen(false);
                                router.push(`/dashboards/usuario/adopcion?from=${selected?.id ?? ""}`);
                            }}
                        >
                            Completar verificación
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 🐶 Modal con información de la mascota */}
            <MascotaCardUsuario m={selectedMascota} open={openCard} onClose={() => setOpenCard(false)} />
        </>
    );
}
