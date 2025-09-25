"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import PageHead from "@/components/layout/PageHead";
import Button from "@/components/ui/Button2";
import Modal from "@/components/ui/Modal";

import Filters from "@/components/masc/Filters";
import FormMascota from "@/components/masc/FormMascota";
import MascotasTable from "@/components/masc/MascotasTable";
import MascotaCardFull from "@/components/masc/MascotaCardFull";

import { ESPECIES, MOCK } from "@/data/masc/constants";
import type { Mascota, Sexo } from "@/data/masc/types";

export default function MascotasPage() {
  const searchParams = useSearchParams();
  const especieQS = searchParams.get("especie");

  const [items, setItems] = useState<Mascota[]>(MOCK);
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState<string>(() => {
    const val = (especieQS || "").trim();
    if (val && (val === "Todas" || (ESPECIES as readonly string[]).includes(val))) return val;
    return "Todas";
  });
  const [sexo, setSexo] = useState<string>("Todos");
  const [openForm, setOpenForm] = useState(false);
  const [sel, setSel] = useState<Mascota | null>(null);

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
      const matchesSexo = sexo === "Todos" || m.sexo === (sexo as Sexo);
      return matchesQ && matchesEsp && matchesSexo;
    });
  }, [items, q, especie, sexo]);

  function onSubmit(form: Mascota) {
    setItems((prev) => [{ ...form, id: crypto.randomUUID(), activo: true }, ...prev]);
    setOpenForm(false);
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
        ESPECIES={ESPECIES}
      />

      {/* Tabla reutilizable */}
      <MascotasTable
        data={data}
        actions={{
          onViewCard: (m) => setSel(m),
          onEdit: (m) => setSel(m),          
          onDelete: (m) => {
            if (!confirm(`¿Eliminar a ${m.nombre}?`)) return;
            setItems((prev) => prev.filter((x) => x.id !== m.id));
          },
        }}
        deleteDisabledForId={() => false}
      />

      {/* Tarjeta grande reutilizable (abre como modal) */}
      <MascotaCardFull
        m={sel as any}
        open={!!sel}
        onClose={() => setSel(null)}
        onEdit={() => sel && setSel(sel)}
        onDelete={() => {
          if (!sel) return;
          if (!confirm(`¿Eliminar a ${sel.nombre}?`)) return;
          setItems((prev) => prev.filter((x) => x.id !== sel.id));
          setSel(null);
        }}
      />

      {/* Modal de “Agregar” (tu componente existente) */}
      <Modal open={openForm} onClose={() => setOpenForm(false)} title="Agregar mascota">
        <FormMascota onCancel={() => setOpenForm(false)} onSubmit={onSubmit} />
      </Modal>
    </>
  );
}
