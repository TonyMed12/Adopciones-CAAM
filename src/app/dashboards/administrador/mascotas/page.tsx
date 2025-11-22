"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import Button from "@/components/ui/Button2";
import Modal from "@/components/ui/Modal";

import Filters from "@/features/mascotas/components/client/Filters";
import FormMascota from "@/features/mascotas/components/client/FormMascota";
import MascotasTable from "@/features/mascotas/components/client/MascotasTable";
import MascotaCardFull from "@/features/mascotas/components/client/MascotaCardFull";
import GestionRazas from "@/features/mascotas/razas/GestionRazas";

import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";

import { createPortal } from "react-dom";

import { useMascotasQuery } from "@/features/mascotas/hooks/useMascotasQuery";
import { useDeleteMascota } from "@/features/mascotas/hooks/useDeleteMascota";
import { useMascotasPageState } from "@/features/mascotas/hooks/useMascotasPageState";

export default function MascotasPage() {
  const {
    openForm, setOpenForm,
    selectedMascota, setSelectedMascota,
    openCard, setOpenCard,
    openRazas, setOpenRazas,
    q, setQ,
    especie, setEspecie,
    sexo, setSexo,
  } = useMascotasPageState();

  const { data: items = [], isLoading } = useMascotasQuery();
  const deleteMascota = useDeleteMascota();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    const html = document.documentElement;

    if (openCard) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
    } else {
      const prevY = Number(body.dataset.scrollY || 0);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      delete body.dataset.scrollY;
      html.style.overscrollBehavior = "";
      if (!isNaN(prevY)) window.scrollTo(0, prevY);
    }
  }, [openCard]);

  /* 🔍 Filtrado */
  const filteredItems = items.filter((m) => {
    const matchQ =
      q.trim() === "" ||
      m.nombre.toLowerCase().includes(q.toLowerCase()) ||
      m.raza?.nombre?.toLowerCase().includes(q.toLowerCase());

    const matchEspecie =
      especie === "Todas" ||
      m.raza?.especie?.toLowerCase() === especie.toLowerCase();

    const matchSexo =
      sexo === "Todos" || m.sexo.toLowerCase() === sexo.toLowerCase();

    return matchQ && matchEspecie && matchSexo;
  });

  /* 👉 Formato para tabla */
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

    return {
      id: m.id,
      nombre: m.nombre,
      especie: m.raza?.especie ?? "Desconocido",
      raza: m.raza?.nombre ?? "Mestizo",
      sexo: m.sexo,
      tamano: m.tamano,
      edadMeses: edadFormateada,
      descripcion: m.personalidad || m.descripcion_fisica || "",
      foto: m.imagen_url ?? null,
      original: m,
    };
  });

  return (
    <>
      {/* Modal para agregar mascota */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title="Agregar Mascota"
      >
        <FormMascota
          onCancel={() => setOpenForm(false)}
          onSubmit={() => {
            setOpenForm(false);
          }}
        />
      </Modal>

      {/* Header */}
      <PageHead
        title="Mascotas"
        subtitle="Explora a nuestros adorables compañeros 🐾"
        right={
          <div className="flex gap-2">
            <Button onClick={() => setOpenForm(true)}>
              <Plus size={18} /> Agregar
            </Button>
            <Button onClick={() => setOpenRazas(true)}>
              🐶 Gestionar Razas
            </Button>
          </div>
        }
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
      {isLoading ? (
        <div className="text-center py-10">Cargando mascotas...</div>
      ) : (
        <div className="p-4">
          <MascotasTable
            data={dataParaTabla}
            actions={{
              onViewCard: (rowMascota) => {
                const m = items.find((item) => item.id === rowMascota.id);
                setSelectedMascota(m ?? null);
                setOpenCard(true);
              },

              onEdited: () => {},

              onDelete: async (item) => {
                const id = typeof item === "string" ? item : item?.id;

                if (!id) {
                  toast.error("No se pudo determinar el ID de la mascota 😿");
                  return;
                }

                const confirmar = await toastConfirm(
                  "¿Estás seguro de que deseas eliminar esta mascota?"
                );
                if (!confirmar) return;

                deleteMascota.mutate(id);
              },
            }}
            deleteDisabledForId={() => false}
          />
        </div>
      )}

      {/* Card en pantalla completa */}
      {openCard &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
              <button
                onClick={() => setOpenCard(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#BC5F36] transition"
              >
                ✕
              </button>

              <div className="flex-1 overflow-y-auto rounded-2xl">
                <MascotaCardFull
                  m={selectedMascota}
                  open={true}
                  onClose={() => setOpenCard(false)}
                  onEdit={() => console.log("Editar mascota:", selectedMascota)}
                  onDelete={async () => {
                    if (!selectedMascota) return;

                    const confirm = await toastConfirm(
                      "¿Seguro que deseas eliminar esta mascota?"
                    );
                    if (!confirm) return;

                    deleteMascota.mutate(selectedMascota.id, {
                      onSuccess: () => {
                        setOpenCard(false);
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Modal de gestión de razas */}
      <GestionRazas open={openRazas} onClose={() => setOpenRazas(false)} />
    </>
  );
}
