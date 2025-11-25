"use client";
import { useMemo, useState } from "react";
import Topbar from "@/features/citas/components/client/TopBar";
import Filtros from "@/features/citas/components/client/Filtros";
import EmptyState from "@/features/citas/components/client/VAcio";
import DayGroups from "@/features/citas/components/client/Dgroup";
import Resumen from "@/features/citas/components/client/Resumen";
import VeterinarioDestacado from "@/features/citas/components/client/Vet";
import NuevoModal from "@/features/citas/components/client/ModalCita";

import { Cita } from "@/features/citas/types/types";
import { agrupaPorDia, filtraCitas, seedCitas, useFechasBase } from "@/features/citas/components/client/Helper";

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
