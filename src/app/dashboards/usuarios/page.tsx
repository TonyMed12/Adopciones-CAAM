"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import PageHead from "@/components/layout/PageHead";

import Filters from "@/components/masc/Filters";
import MascotaCard from "@/components/masc/MascotaCard";

import { ESPECIES, MOCK } from "@/data/masc/constants";
import type { Mascota, Sexo } from "@/data/masc/types";

export default function MascotasPage() {
  const searchParams = useSearchParams();
  const especieQS = searchParams.get("especie");

  const [items, setItems] = useState<Mascota[]>(MOCK);
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState<string>(() => {
    const val = (especieQS || "").trim();
    if (
      val &&
      (val === "Todas" || (ESPECIES as readonly string[]).includes(val))
    )
      return val;
    return "Todas";
  });
  const [sexo, setSexo] = useState<string>("Todos");
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const val = (especieQS || "").trim();
    if (
      val &&
      (val === "Todas" || (ESPECIES as readonly string[]).includes(val))
    ) {
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
    setItems((prev) => [
      { ...form, id: crypto.randomUUID(), activo: true },
      ...prev,
    ]);
    setOpenForm(false);
  }

  return (
    <>
      <PageHead
        title="Mascotas"
        subtitle="Explora a nuestros adorables compañeros 🐾"
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

      <section className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {data.map((m) => (
          <MascotaCard key={m.id} m={m} onView={() => {}} onAdopt={() => {}} />
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center text-[#7a5c49] py-10">
            No hay resultados con esos filtros
          </div>
        )}
      </section>
    </>
  );
}
