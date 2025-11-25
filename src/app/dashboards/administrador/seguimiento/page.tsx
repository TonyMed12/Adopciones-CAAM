"use client";

import React, { useMemo, useState } from "react";
import PageHead from "@/components/layout/PageHead";
import Filters from "@/features/mascotas/components/client/Filters";
import MascotasTable from "@/features/mascotas/components/client/MascotasTable";
import { useMascotasQuery } from "@/features/mascotas/hooks/useMascotasQuery";
import { useRouter } from "next/navigation";
import { formatearMascotaParaTabla } from "@/features/seguimiento/utils/formatearMascotaParaTabla";
import UserTableSkeleton from "@/components/ui/UserTableSkeleton";

export default function SeguimientoAdminPage() {
  const router = useRouter();
  const { data: mascotas = [], isLoading } = useMascotasQuery();

  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");

  const mascotasFiltradas = useMemo(() => {
    return mascotas.filter((m) => {
      const matchQ =
        q.trim() === "" ||
        m.nombre?.toLowerCase().includes(q.toLowerCase()) ||
        m.raza?.nombre?.toLowerCase().includes(q.toLowerCase());

      const matchEspecie =
        especie === "Todas" ||
        m.raza?.especie?.toLowerCase() === especie.toLowerCase();

      const matchSexo =
        sexo === "Todos" || m.sexo?.toLowerCase() === sexo.toLowerCase();

      return matchQ && matchEspecie && matchSexo;
    });
  }, [mascotas, q, especie, sexo]);

  const dataTabla = useMemo(() => {
    return mascotasFiltradas.map(formatearMascotaParaTabla);
  }, [mascotasFiltradas]);

  return (
    <>
      <PageHead
        title="Seguimiento de Mascotas"
        subtitle="Administra y revisa los seguimientos de cada mascota 🐾"
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

      {isLoading ? (
        <div className="text-center py-10 text-[#7a5c49]">
          <UserTableSkeleton />
        </div>
      ) : (
        <div className="p-4">
          <MascotasTable
            mode="seguimiento"
            data={dataTabla}
            actions={{
              onViewCard: (rowMascota) =>
                router.push(
                  `/dashboards/administrador/seguimiento/${rowMascota.id}`
                ),
            }}
            deleteDisabledForId={() => true}
          />
        </div>
      )}
    </>
  );
}
