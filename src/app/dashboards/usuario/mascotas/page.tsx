"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/components/masc/Filters";
import MascotaCard from "@/components/masc/MascotaCard";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import { ESPECIES, MOCK } from "@/data/masc/constants";
import type { Mascota, Sexo } from "@/data/masc/types";

type DocEstado = "aprobado" | "en_revision" | "rechazado" | "sin_documentos";

export default function MascotasPage() {
  const router = useRouter();
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

  // Estado de documentos (simulado)
  const [docEstado, setDocEstado] = useState<DocEstado>("sin_documentos");
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("docEstado")) as DocEstado | null;
    setDocEstado(stored ?? "sin_documentos");
  }, []);

  // Modal de bloqueo al adoptar
  const [gateOpen, setGateOpen] = useState(false);
  const [selected, setSelected] = useState<Mascota | null>(null);

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
  }

  function handleAdopt(m: Mascota) {
    if (docEstado === "aprobado") {
      router.push(`/usuario/mascotas?adoptId=${m.id}`); // ajusta si tienes otro flujo
    } else {
      setSelected(m);
      setGateOpen(true);
    }
  }

  // helpers visuales
  const estadoText: Record<DocEstado, { title: string; desc: string; tone: "info" | "warn" | "ok" | "error" }> = {
    sin_documentos: { title: "Necesitas validar tus documentos", desc: "Sube identificación, domicilio y carta compromiso.", tone: "warn" },
    en_revision:    { title: "Documentos en revisión", desc: "Un administrador está revisando tus archivos.", tone: "info" },
    rechazado:      { title: "Documentos con observaciones", desc: "Corrige lo indicado y vuelve a enviar.", tone: "error" },
    aprobado:       { title: "Validación completa", desc: "Ya puedes iniciar el proceso de adopción.", tone: "ok" },
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

      {/* Banner de estado arriba del listado */}
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

      <section className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {data.map((m) => (
          <MascotaCard key={m.id} m={m} onView={() => {}} onAdopt={() => handleAdopt(m)} />
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-10 text-center text-[#7a5c49]">
            No hay resultados con esos filtros
          </div>
        )}
      </section>

      {/* Modal de gating al adoptar */}
      <Modal open={gateOpen} onClose={() => setGateOpen(false)} title="Antes de adoptar">
        <div className="p-4 text-[#2b1b12]">
          <p className="text-sm">
            Para adoptar a <span className="font-extrabold">{selected?.nombre}</span> primero necesitamos validar tus documentos:
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
            <li>• Identificación oficial (INE/ Pasaporte)</li>
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
    </>
  );
}
