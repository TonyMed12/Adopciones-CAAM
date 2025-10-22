"use client";
import { useMemo, useState } from "react";
import Topbar from "@/components/citas/TopBar";
import Filtros from "@/components/citas/Filtros";
import EmptyState from "@/components/citas/VAcio";
import DayGroups from "@/components/citas/Dgroup";
import Resumen from "@/components/citas/Resumen";
import VeterinarioDestacado from "@/components/citas/Vet";
import NuevoModal from "@/components/citas/ModalCita";

import { Cita } from "@/data/citas/types";
import { agrupaPorDia, filtraCitas, seedCitas, useFechasBase } from "@/components/citas/Helper";

export default function CitasPage() {
  const [query, setQuery] = useState("");
  const [vista, setVista] = useState<"hoy" | "semana" | "mes">("hoy");
  const [openNew, setOpenNew] = useState(false);
  const [citas, setCitas] = useState<Cita[]>(() => seedCitas());

  const { hoyISO, inicioSemanaISO, finSemanaISO } = useFechasBase();

  const citasFiltradas = useMemo(
    () => filtraCitas(citas, { query, vista, hoyISO, inicioSemanaISO, finSemanaISO }),
    [citas, query, vista, hoyISO, inicioSemanaISO, finSemanaISO]
  );
  const grupos = useMemo(() => agrupaPorDia(citasFiltradas), [citasFiltradas]);

  const eliminar = (id: string) => setCitas((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="bg-[#fff7ef]">
      <Topbar onNueva={() => setOpenNew(true)} />

      <main className="mx-auto w-full max-w-5xl px-3 sm:px-6 pb-8 md:pb-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            <Filtros
              vista={vista}
              onChangeVista={setVista}
              query={query}
              onChangeQuery={setQuery}
              onNueva={() => setOpenNew(true)}
            />

            {grupos.length === 0 ? (
              <EmptyState onNueva={() => setOpenNew(true)} />
            ) : (
              <DayGroups grupos={grupos} onEliminar={eliminar} />
            )}
          </section>

          <aside className="space-y-4">
            <Resumen
              hoyISO={hoyISO}
              inicioSemanaISO={inicioSemanaISO}
              finSemanaISO={finSemanaISO}
              total={citas.length}
              citas={citas}
            />
            <VeterinarioDestacado onNueva={() => setOpenNew(true)} />
          </aside>
        </div>
      </main>

      <NuevoModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        onSave={(c) => {
          setCitas((prev) => [...prev, { ...c, id: crypto.randomUUID() }]);
          setOpenNew(false);
        }}
      />
    </div>
  );
}
