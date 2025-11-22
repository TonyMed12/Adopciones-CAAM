"use client";

import { useMemo, useState, useEffect } from "react";
import AdopcionesTable from "@/features/adopciones/components/client/AdopcionesTable";
import {
  listarAdopcionesAdmin,
  cambiarEstadoAdopcion,
} from "@/features/adopciones/actions/adopciones-actions";
import type { AdopcionAdminRow } from "@/features/adopciones/types/adopciones";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";
import PageHead from "@/components/layout/PageHead";
import { useIsMobile } from "@/hooks/useIsMobile";
import Pagination from "@/components/ui/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";

export default function GestionAdopcionesPage() {
  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  const [rows, setRows] = useState<AdopcionAdminRow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rechazoOpen, setRechazoOpen] = useState(false);
  const [rechazoMotivo, setRechazoMotivo] = useState("");
  const [rechazoId, setRechazoId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<
    "todas" | AdopcionAdminRow["estado"]
  >("todas");

  /* =============================
     FETCH ADOPCIONES
  ============================= */
  useEffect(() => {
    async function fetchAdopciones() {
      try {
        console.log("ROWS:", rows);

        const data = await listarAdopcionesAdmin();
        console.log(
          "ADOPCIONES QUE LLEGAN DESDE listarAdopcionesAdmin():",
          data
        );

        setRows(data);
      } catch (error) {
        console.error("Error cargando adopciones:", error);
        toast.error("Error al cargar las adopciones.");
      } finally {
        setLoading(false);
      }
    }
    fetchAdopciones();
  }, []);

  /* =============================
     APROBAR / RECHAZAR
  ============================= */
  const aprobar = async (id: string) => {
    const confirmed = await toastConfirm(
      "¿Estás seguro de aprobar esta adopción?"
    );
    if (!confirmed) return;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay sesión activa.");

      // 1️⃣ BUSCAR LA ADOPCIÓN ANTES DE MODIFICAR EL ESTADO
      const adopcion = rows.find((r) => r.id === id);

      console.log("ADOPCIÓN PARA EL CORREO:", adopcion);

      if (!adopcion) {
        toast.error("No se encontró la adopción.");
        return;
      }

      // CAMPOS REALES SEGÚN TU LOG
      const email = adopcion?.usuarioCorreo || "";
      const nombre = adopcion.usuarioNombre || "Adoptante";
      const nombreMascota = adopcion.mascotaNombre || "tu mascota";
      const fotoMascota = adopcion.mascotaImagen;
      const adopcionId = adopcion.id;

      // 2️⃣ CAMBIAR ESTADO EN BD
      await cambiarEstadoAdopcion({
        id,
        estado: "aprobada",
        admin_responsable: user.id,
        observaciones_admin: "Adopción aprobada por el administrador.",
      });

      // 3️⃣ ACTUALIZAR UI
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "aprobada" } : r))
      );

      // 4️⃣ ENVIAR CORREO (SOLO SI TENEMOS EMAIL)
      if (email) {
        console.log("📧 Enviando correo a:", email);
        console.log("📦 PAYLOAD QUE SE ENVÍA:", {
          email,
          adoptante: nombre,
          nombreMascota,
          fotoMascota,
          adopcionId,
        });

        await fetch("/api/email/adopcion-aprobada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            email,
            adoptante: nombre,
            nombreMascota,
            fotoMascota,
            adopcionId,
          }),
        });
      } else {
        console.warn("⚠ No se encontró correo del adoptante.");
      }

      //toast.success("Adopción aprobada y correo enviado.");
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar la adopción.");
    }
  };

  const rechazar = (id: string) => {
    setRechazoId(id);
    setRechazoMotivo("");
    setRechazoOpen(true);
  };

  const confirmarRechazo = async () => {
    if (!rechazoId) return;

    const motivoLimpio = rechazoMotivo.trim();

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay sesión activa.");

      // 1️⃣ Tomar datos de la adopción ANTES de cambiar estado
      const adopcion = rows.find((r) => r.id === rechazoId);

      const email =
        (adopcion as any)?.usuarioCorreo ||
        (adopcion as any)?.adoptante_correo ||
        (adopcion as any)?.email ||
        "";

      const adoptante = adopcion?.usuarioNombre || "Adoptante";
      const nombreMascota = adopcion?.mascotaNombre || "tu mascota";
      const fotoMascota = adopcion?.mascotaImagen || "";

      // 2️⃣ Cambiar estado en BD
      await cambiarEstadoAdopcion({
        id: rechazoId,
        estado: "rechazada",
        admin_responsable: user.id,
        observaciones_admin: motivoLimpio || "Sin motivo.",
      });

      // 3️⃣ Actualizar UI
      setRows((prev) =>
        prev.map((r) =>
          r.id === rechazoId ? { ...r, estado: "rechazada" } : r
        )
      );

      // 4️⃣ Enviar correo de rechazo
      if (email) {
        await fetch("/api/email/adopcion-rechazada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            adoptante,
            nombreMascota,
            fotoMascota,
            motivo: motivoLimpio || "Sin motivo.",
          }),
        });
      } else {
        console.warn("⚠ No se encontró correo del adoptante.");
      }

      toast.success("Adopción rechazada y correo enviado.");
      setRechazoOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error al rechazar la adopción.");
    }
  };

  /* =============================
     FILTRO + BUSQUEDA
  ============================= */
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((r) => {
      const matchTexto =
        !q ||
        r.usuarioNombre?.toLowerCase().includes(q) ||
        r.mascotaNombre?.toLowerCase().includes(q);

      const matchEstado = filtroEstado === "todas" || r.estado === filtroEstado;

      return matchTexto && matchEstado;
    });
  }, [rows, query, filtroEstado]);

  /* Resetear a página 1 cuando cambia filtro/búsqueda/móvil */
  useEffect(() => {
    setPage(1);
  }, [query, filtroEstado, isMobile]);

  /* =============================
     PAGINACIÓN
  ============================= */
  const totalPages = Math.ceil(filtrados.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    return filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [filtrados, page, ITEMS_PER_PAGE]);

  /* =============================
     KPIS
  ============================= */
  const totales = {
    pendientes: rows.filter((r) => r.estado === "pendiente").length,
    aprobadas: rows.filter((r) => r.estado === "aprobada").length,
    rechazadas: rows.filter((r) => r.estado === "rechazada").length,
  };

  /* =============================
     RENDER
  ============================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-[#7a5c49] animate-pulse">
        Cargando adopciones...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* MODAL RECHAZO */}
      <Dialog open={rechazoOpen} onOpenChange={setRechazoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">
              Rechazar adopción
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-2">
            Escribe el motivo del rechazo. Este texto se guardará en el sistema
            y se enviará al adoptante por correo.
          </p>
          <Textarea
            placeholder="Ej. El espacio del hogar no es suficiente para esta mascota…"
            value={rechazoMotivo}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setRechazoMotivo(e.target.value)
            }
            className="min-h-[120px]"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setRechazoOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="button" onClick={confirmarRechazo}>
              Confirmar rechazo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* FIN MODAL */}

      <PageHead
        title="Gestión de Adopciones"
        subtitle="Revisa y administra las solicitudes de adopción."
      />

      {/* =============================
          KPI CHIPS con mismo estilo
      ============================= */}
      <div className="flex flex-wrap gap-3 pt-1">
        {/* Pendientes */}
        <button
          onClick={() => setFiltroEstado("pendiente")}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
            ${
              filtroEstado === "pendiente"
                ? "bg-yellow-200 text-yellow-900 border-yellow-500 shadow-sm scale-[1.03]"
                : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
            }
          `}
        >
          Pendientes: {totales.pendientes}
        </button>

        {/* Aprobadas */}
        <button
          onClick={() => setFiltroEstado("aprobada")}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
            ${
              filtroEstado === "aprobada"
                ? "bg-green-200 text-green-900 border-green-600 shadow-sm scale-[1.03]"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }
          `}
        >
          Aprobadas: {totales.aprobadas}
        </button>

        {/* Rechazadas */}
        <button
          onClick={() => setFiltroEstado("rechazada")}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
            ${
              filtroEstado === "rechazada"
                ? "bg-red-200 text-red-900 border-red-600 shadow-sm scale-[1.03]"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            }
          `}
        >
          Rechazadas: {totales.rechazadas}
        </button>

        {/* Mostrar todas */}
        {filtroEstado !== "todas" && (
          <button
            onClick={() => setFiltroEstado("todas")}
            className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-white text-[#6b4f40] hover:bg-gray-50"
          >
            Mostrar todas
          </button>
        )}
      </div>

      {/* =============================
          TABLA + MOBILE CARDS
      ============================= */}
      <AdopcionesTable
        items={paginated}
        query={query}
        onQueryChange={setQuery}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onAprobar={aprobar}
        onRechazar={rechazar}
      />

      {/* =============================
          PAGINACIÓN
      ============================= */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={filtrados.length}
        itemsPerPage={ITEMS_PER_PAGE}
        itemsLabel="adopciones"
        onChange={(n) => {
          setPage(n);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 10);
        }}
      />
    </div>
  );
}
