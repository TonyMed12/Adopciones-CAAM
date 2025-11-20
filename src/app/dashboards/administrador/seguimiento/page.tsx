"use client";

import React, { useEffect, useState } from "react";
import PageHead from "@/components/layout/PageHead";
import Filters from "@/components/masc/Filters";
import MascotasTable from "@/components/masc/MascotasTable";
import { listarMascotas } from "@/mascotas/mascotas-actions";
import { useRouter } from "next/navigation";

export default function SeguimientoAdminPage() {
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
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

  // Filtros
  const filteredItems = items.filter((m) => {
    const matchQ =
      q.trim() === "" ||
      m.nombre?.toLowerCase().includes(q.toLowerCase()) ||
      m.raza?.nombre?.toLowerCase().includes(q.toLowerCase());

    const matchEspecie =
      especie === "Todas" ||
      (m.raza?.especie &&
        m.raza.especie.toLowerCase() === especie.toLowerCase());

    const matchSexo =
      sexo === "Todos" || m.sexo?.toLowerCase() === sexo.toLowerCase();

    return matchQ && matchEspecie && matchSexo;
  });

  // Formateo para tabla
  const dataParaTabla = filteredItems.map((m) => {
    const totalMeses = Number(m.edad ?? 0);
    const años = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;
    const edadFormateada =
      años > 0
        ? `${años} año${años > 1 ? "s" : ""}${
            meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
          }`
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
      original: m,
    };
  });

  return (
    <>
      {/* Header */}
      <PageHead
        title="Seguimiento de Mascotas"
        subtitle="Administra y revisa los seguimientos de cada mascota 🐾"
      />

      {/* Filtros */}
      <Filters
        q={q}
        onQ={setQ}
        especie={especie}
        onEspecie={setEspecie}
        sexo={sexo}
        onSexo={setSexo}
        ESPECIES={["Perro", "Gato", "Otro"]}
      />

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-10">Cargando mascotas...</div>
      ) : (
        <div className="p-4">
          <MascotasTable
            mode="seguimiento"         // 🔥 MODO ADMIN SEGUIMIENTO
            data={dataParaTabla}
            actions={{
              onViewCard: (rowMascota) => {
                router.push(
                  `/dashboards/administrador/seguimiento/${rowMascota.id}`
                );
              },
            }}
            deleteDisabledForId={() => true}
          />
        </div>
      )}
    </>
  );
}
