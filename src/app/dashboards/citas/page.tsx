"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import Button from "@/components/ui/Button2";
import Modal from "@/components/ui/Modal";

import Filters from "@/components/masc/Filters";
import FormMascota from "@/components/masc/FormMascota";
import MascotasTableWithEditor from "@/components/masc/MascotasTable";
import MascotaCardFull from "@/components/masc/MascotaCardFull";

import { listarMascotas, eliminarMascota } from "@/mascotas/mascotas-actions";

export default function MascotasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMascota, setSelectedMascota] = useState<any | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");

  // ====================== CARGAR DATOS ======================
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

  // ====================== FILTROS ======================
  const filtered = items.filter((m) => {
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

  const dataParaTabla = filtered.map((m) => {
    const totalMeses = Number(m.edad ?? 0);
    const años = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;
    const edadFormateada =
      años > 0
        ? `${años} año${años > 1 ? "s" : ""}${
            meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
          }`
        : `${meses} mes${meses !== 1 ? "es" : ""}`;

    return {
      id: m.id,
      nombre: m.nombre,
      especie: m.raza?.especie || "Desconocido",
      raza: m.raza?.nombre || "Mestizo",
      sexo: m.sexo,
      tamano: m.tamano,
      edadMeses: edadFormateada,
      descripcion: m.personalidad || m.descripcion_fisica || "",
      foto: m.imagen_url,
      original: m,
    };
  });

  // ====================== ELIMINAR ======================
  async function handleDeleteMascota(id: string) {
    if (!confirm("¿Seguro que quieres eliminar esta mascota? 🐾")) return;
    try {
      await eliminarMascota(id);
      await fetchMascotas();
      alert("Mascota eliminada correctamente 🗑️");
    } catch (err: any) {
      console.error("Error eliminando mascota:", err);
      alert(err.message || "No se pudo eliminar la mascota");
    }
  }

  // ====================== RENDER ======================
  return (
    <>
      {/* MODAL AGREGAR MASCOTA */}
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Agregar Mascota"
      >
        <FormMascota
          key="new"
          onCancel={() => setIsFormOpen(false)}
          onSubmit={async () => {
            await fetchMascotas();
            setIsFormOpen(false);
          }}
        />
      </Modal>

      {/* CARD DETALLE */}
      <MascotaCardFull
        m={selectedMascota}
        open={isCardOpen}
        onClose={() => setIsCardOpen(false)}
        onEdit={() => {
          setIsCardOpen(false);
        }}
        onDelete={async () => {
          if (!selectedMascota) return;
          await handleDeleteMascota(selectedMascota.id);
          setIsCardOpen(false);
          setSelectedMascota(null);
        }}
      />

      <PageHead
        title="Mascotas"
        subtitle="Explora a nuestros adorables compañeros 🐾"
        right={
          <Button
            onClick={() => {
              setSelectedMascota(null);
              setIsFormOpen(true);
            }}
          >
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
          <MascotasTableWithEditor
            data={dataParaTabla}
            actions={{
              onViewCard: (m) => {
                setSelectedMascota(m);
                setIsCardOpen(true);
              },
              onEdited: async () => {
                await fetchMascotas();
              },
              onDeleteClick: async (m) => {
                await handleDeleteMascota(m.id);
              },
            }}
            deleteDisabledForId={() => false}
          />
        </div>
      )}
    </>
  );
}
