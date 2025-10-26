"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar,
  ClipboardList,
  PawPrint,
  Users,
  Loader2,
  FileText,
  CalendarDays,
} from "lucide-react";

function formatTimeAgo(fechaStr: string) {
  const fecha = new Date(fechaStr);
  const diffMs = Date.now() - fecha.getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return "justo ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} día${dias > 1 ? "s" : ""}`;
}

/* ---------------------------------------------------------------------- */
/* COMPONENTE DE TARJETA DE ESTADÍSTICA */
/* ---------------------------------------------------------------------- */
function StatCard({
  label,
  value,
  icon,
  color,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}) {
  const hasAlert = value > 0 && label !== "Mascotas adoptables";
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 transition hover:shadow-md cursor-pointer ${
        hasAlert
          ? "border-[#BC5F36]/40 bg-[#fff8f4]"
          : "border-slate-100 bg-white"
      }`}
      style={{ boxShadow: "0 10px 30px rgba(2,6,23,.05)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{label}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-xl ${
            color ?? "bg-orange-100 text-[#BC5F36]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* COMPONENTE DE ITEM DE ACTIVIDAD */
/* ---------------------------------------------------------------------- */
function ActivityItem({
  tipo,
  mensaje,
  fecha,
}: {
  tipo: string;
  mensaje: string;
  fecha: string;
}) {
  const iconos: Record<string, React.ReactNode> = {
    documento: <FileText className="h-4 w-4 text-[#BC5F36]" />,
    cita: <CalendarDays className="h-4 w-4 text-[#BC5F36]" />,
    mascota: <PawPrint className="h-4 w-4 text-[#BC5F36]" />,
  };

  return (
    <li className="flex items-start gap-3 border-b pb-2">
      <span className="mt-1">{iconos[tipo]}</span>
      <div>
        <p className="text-sm text-slate-700">{mensaje}</p>
        <p className="text-xs text-slate-400">{formatTimeAgo(fecha)}</p>
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL */
/* ---------------------------------------------------------------------- */
export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [stats, setStats] = useState({
    documentosPendientes: 0,
    citasHoy: 0,
    citasSemana: 0,
    usuariosProceso: 0,
    mascotasAdoptables: 0,
  });
  const [pendientes, setPendientes] = useState<
    { id: number; descripcion: string; link: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todo");
  const [actividad, setActividad] = useState<
    { tipo: "documento" | "cita" | "mascota"; mensaje: string; fecha: string }[]
  >([]);
  const [loadingAct, setLoadingAct] = useState(true);

  /* ------------------------------------------------------------------ */
  /* Cargar estadísticas + pendientes */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        const { count: docs } = await supabase
          .from("documentos")
          .select("*", { count: "exact", head: true })
          .eq("status", "pendiente");

        const hoyStr = hoy.toISOString().split("T")[0];
        const { count: citasHoy } = await supabase
          .from("citas")
          .select("*", { count: "exact", head: true })
          .eq("fecha_cita", hoyStr);

        const { count: citasSemana } = await supabase
          .from("citas")
          .select("*", { count: "exact", head: true })
          .gte("fecha_cita", inicioSemana.toISOString().split("T")[0])
          .lte("fecha_cita", finSemana.toISOString().split("T")[0]);

        const { count: usuarios } = await supabase
          .from("perfiles")
          .select("*", { count: "exact", head: true })
          .eq("estado_proceso", "en_revision");

        const { count: adoptables } = await supabase
          .from("mascotas")
          .select("*", { count: "exact", head: true })
          .eq("estado", "disponible");

        setStats({
          documentosPendientes: docs ?? 0,
          citasHoy: citasHoy ?? 0,
          citasSemana: citasSemana ?? 0,
          usuariosProceso: usuarios ?? 0,
          mascotasAdoptables: adoptables ?? 0,
        });

        const tareas = [
          docs && docs > 0
            ? {
                id: 1,
                descripcion: `${docs} documentos por validar`,
                link: "/dashboards/administrador/documentos",
              }
            : null,
          citasHoy && citasHoy > 0
            ? {
                id: 2,
                descripcion: `${citasHoy} citas programadas para hoy`,
                link: "/dashboards/administrador/gestion_citas",
              }
            : null,
          usuarios && usuarios > 0
            ? {
                id: 3,
                descripcion: `${usuarios} usuarios con proceso en revisión`,
                link: "/dashboards/administrador/usuarios",
              }
            : null,
        ].filter(Boolean) as {
          id: number;
          descripcion: string;
          link: string;
        }[];

        setPendientes(tareas);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Cargar actividad reciente + realtime */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    async function fetchActividad() {
      setLoadingAct(true);
      try {
        const eventos: any[] = [];

        // Documentos
        if (filtro === "todo" || filtro === "documento") {
          const { data: docs } = await supabase
            .from("documentos")
            .select("created_at, tipo, perfiles(nombres)")
            .order("created_at", { ascending: false })
            .limit(5);
          docs?.forEach((d) =>
            eventos.push({
              tipo: "documento",
              mensaje: `${d.perfiles?.nombres || "Un usuario"} subió ${d.tipo}`,
              fecha: d.created_at,
            })
          );
        }

        // Citas
        if (filtro === "todo" || filtro === "cita") {
          const { data: citas } = await supabase
            .from("citas")
            .select("created_at, estado, perfiles(nombres), mascotas(nombre)")
            .order("created_at", { ascending: false })
            .limit(5);
          citas?.forEach((c) =>
            eventos.push({
              tipo: "cita",
              mensaje: `${c.perfiles?.nombres || "Un usuario"} ${
                c.estado === "programada" ? "agendó" : "actualizó"
              } una cita para "${c.mascotas?.nombre || "una mascota"}"`,
              fecha: c.created_at,
            })
          );
        }

        // Mascotas adoptadas
        if (filtro === "todo" || filtro === "mascota") {
          const { data: masc } = await supabase
            .from("mascotas")
            .select("nombre, estado, updated_at")
            .eq("estado", "adoptada")
            .order("updated_at", { ascending: false })
            .limit(5);
          masc?.forEach((m) =>
            eventos.push({
              tipo: "mascota",
              mensaje: `Mascota "${m.nombre}" fue marcada como adoptada`,
              fecha: m.updated_at,
            })
          );
        }

        eventos.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        setActividad(eventos.slice(0, 8));
      } catch (err) {
        console.error("Error cargando actividad:", err);
      } finally {
        setLoadingAct(false);
      }
    }

    fetchActividad();

    // 🔴 Suscripción en tiempo real
    const channel = supabase
      .channel("realtime-actividad")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documentos" },
        () => fetchActividad()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "citas" },
        () => fetchActividad()
      )
      .on(
        "postgres_changes",
        { event: "update", schema: "public", table: "mascotas" },
        () => fetchActividad()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filtro]);

  /* ------------------------------------------------------------------ */
  /* RENDER PRINCIPAL */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Panel de gestión 🐾
        </h1>
        <p className="text-sm text-slate-500">
          Bienvenido, administrador. Revisa los pendientes del día.
        </p>
      </div>
      {/* Indicador de pendientes global */}
      <div className="flex items-center justify-between rounded-xl bg-[#fff4ed] border border-[#eadacb] p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#BC5F36] font-semibold">🔔 Pendientes:</span>
          <span className="text-slate-700 text-sm">
            {stats.documentosPendientes +
              stats.citasHoy +
              stats.usuariosProceso >
            0
              ? `${
                  stats.documentosPendientes +
                  stats.citasHoy +
                  stats.usuariosProceso
                } tareas por revisar`
              : "Sin pendientes"}
          </span>
        </div>
        <div className="flex gap-2 text-xs text-[#7a5c49]">
          <span>📄 {stats.documentosPendientes} docs</span>
          <span>📅 {stats.citasHoy} citas</span>
          <span>👥 {stats.usuariosProceso} usuarios</span>
        </div>
      </div>

      {/* Botones de acción rápida */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/dashboards/admin/documentos")}
          className="px-4 py-2 rounded-lg bg-[#BC5F36] text-white text-sm hover:bg-[#a34f2e]"
        >
          Validar documentos
        </button>
        <button
          onClick={() => router.push("/dashboards/admin/gestion_citas")}
          className="px-4 py-2 rounded-lg bg-orange-100 text-[#BC5F36] text-sm hover:bg-orange-200"
        >
          Ver citas
        </button>
        <button
          onClick={() => router.push("/dashboards/admin/usuarios")}
          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
        >
          Usuarios
        </button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Documentos pendientes"
          value={stats.documentosPendientes}
          icon={<ClipboardList className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/admin/documentos")}
        />
        <StatCard
          label="Citas hoy"
          value={stats.citasHoy}
          icon={<CalendarDays className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/admin/gestion_citas")}
        />
        <StatCard
          label="Citas esta semana"
          value={stats.citasSemana}
          icon={<Calendar className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/admin/gestion_citas")}
        />
        <StatCard
          label="Usuarios en revisión"
          value={stats.usuariosProceso}
          icon={<Users className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/admin/usuarios")}
        />
        <StatCard
          label="Mascotas adoptables"
          value={stats.mascotasAdoptables}
          icon={<PawPrint className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/admin/mascotas")}
        />
      </div>

      {/* Tareas pendientes */}
      <section className="rounded-2xl border border-[#eadacb] bg-[#fffaf7] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Tareas pendientes
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin h-4 w-4" /> Cargando tareas...
          </div>
        ) : pendientes.length > 0 ? (
          <ul className="space-y-3">
            {pendientes.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between border-b pb-2 text-sm text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-[#BC5F36]" />
                  <span>{p.descripcion}</span>
                </div>
                <button
                  onClick={() => router.push(p.link)}
                  className="text-[#BC5F36] font-medium hover:underline"
                >
                  Revisar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">
            No hay tareas pendientes por ahora 🐶
          </p>
        )}
      </section>

      {/* Actividad reciente */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Actividad reciente
          </h2>
          <div className="flex gap-2">
            {["todo", "documento", "cita", "mascota"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-3 py-1 text-xs rounded-md border ${
                  filtro === f
                    ? "bg-[#BC5F36] text-white border-[#BC5F36]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f === "todo"
                  ? "Todo"
                  : f === "documento"
                  ? "Documentos"
                  : f === "cita"
                  ? "Citas"
                  : "Mascotas"}
              </button>
            ))}
          </div>
        </div>

        {loadingAct ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin h-4 w-4" /> Cargando actividad...
          </div>
        ) : actividad.length > 0 ? (
          <ul className="space-y-3">
            {actividad.map((a, i) => (
              <ActivityItem
                key={i}
                tipo={a.tipo}
                mensaje={a.mensaje}
                fecha={a.fecha}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Sin actividad reciente 🐾</p>
        )}
      </section>
    </div>
  );
}
