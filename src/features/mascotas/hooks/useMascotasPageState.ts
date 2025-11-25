"use client";

import { useState, useEffect } from "react";
import type { Mascota } from "@/features/mascotas/types/mascotas";

export function useMascotasPageState() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
    const [openCard, setOpenCard] = useState(false);
    const [openRazas, setOpenRazas] = useState(false);

    // filtros
    const [q, setQ] = useState("");
    const [especie, setEspecie] = useState("Todas");
    const [sexo, setSexo] = useState("Todos");

    // bloqueo de scroll
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", openCard);
    }, [openCard]);

    return {
        openForm,
        setOpenForm,
        selectedMascota,
        setSelectedMascota,
        openCard,
        setOpenCard,
        openRazas,
        setOpenRazas,

        q,
        setQ,
        especie,
        setEspecie,
        sexo,
        setSexo,
    };
}
