"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
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

    citasAdopPend: 0,
    citasVetPend: 0,
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

        /* -------------------- DOCUMENTOS PENDIENTES -------------------- */
        const { count: docs } = await supabase
          .from("documentos")
          .select("*", { count: "exact", head: true })
          .eq("status", "pendiente");

        const hoyStr = hoy.toISOString().split("T")[0];

        /* -------------------- CITAS DE ADOPCIÓN HOY -------------------- */
        const { count: citasAdopHoy } = await supabase
          .from("citas_adopcion")
          .select("*", { count: "exact", head: true })
          .eq("fecha_cita", hoyStr);

        /* -------------------- CITAS VETERINARIAS HOY -------------------- */
        const { count: citasVetHoy } = await supabase
          .from("citas_veterinarias")
          .select("*", { count: "exact", head: true })
          .gte("fecha_cita", hoyStr + "T00:00:00")
          .lte("fecha_cita", hoyStr + "T23:59:59");

        const citasHoy = (citasAdopHoy ?? 0) + (citasVetHoy ?? 0);

        /* -------------------- CITAS SEMANA (AMBOS TIPOS) -------------------- */
        const { count: citasAdopSemana } = await supabase
          .from("citas_adopcion")
          .select("*", { count: "exact", head: true })
          .gte("fecha_cita", inicioSemana.toISOString().split("T")[0])
          .lte("fecha_cita", finSemana.toISOString().split("T")[0]);

        const { count: citasVetSemana } = await supabase
          .from("citas_veterinarias")
          .select("*", { count: "exact", head: true })
          .gte("fecha_cita", inicioSemana.toISOString())
          .lte("fecha_cita", finSemana.toISOString());

        const citasSemana = (citasAdopSemana ?? 0) + (citasVetSemana ?? 0);

        /* -------------------- USUARIOS EN REVISIÓN -------------------- */
        const { count: usuarios } = await supabase
          .from("perfiles")
          .select("*", { count: "exact", head: true })
          .eq("estado_proceso", "en_revision");

        /* -------------------- MASCOTAS ADOPTABLES -------------------- */
        const { count: adoptables } = await supabase
          .from("mascotas")
          .select("*", { count: "exact", head: true })
          .eq("estado", "disponible");

        /* -------------------- CITAS PENDIENTES POR APROBAR -------------------- */
        const { count: citasAdopPend } = await supabase
          .from("citas_adopcion")
          .select("*", { count: "exact", head: true })
          .eq("estado", "programada");

        const { count: citasVetPend } = await supabase
          .from("citas_veterinarias")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente");

        /* -------------------- SET STATS -------------------- */
        setStats({
          documentosPendientes: docs ?? 0,
          citasHoy: citasHoy ?? 0,
          citasSemana: citasSemana ?? 0,
          usuariosProceso: usuarios ?? 0,
          mascotasAdoptables: adoptables ?? 0,
          citasAdopPend: citasAdopPend ?? 0,
          citasVetPend: citasVetPend ?? 0,
        });

        /* -------------------- ARMADO DE TAREAS PENDIENTES -------------------- */
        const tareas = [
          docs! > 0
            ? {
                id: 1,
                descripcion: `${docs} documentos por validar`,
                link: "/dashboards/administrador/documentos",
              }
            : null,
          citasAdopPend! > 0
            ? {
                id: 2,
                descripcion: `${citasAdopPend} citas de adopción por aprobar`,
                link: "/dashboards/administrador/gestion_citas",
              }
            : null,
          citasVetPend! > 0
            ? {
                id: 3,
                descripcion: `${citasVetPend} citas veterinarias por aprobar`,
                link: "/dashboards/administrador/gestion_citas",
              }
            : null,
          usuarios! > 0
            ? {
                id: 4,
                descripcion: `${usuarios} usuarios con proceso en revisión`,
                link: "/dashboards/administrador/usuarios",
              }
            : null,
        ].filter(Boolean) as any;

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
  /* Cargar nombre del usuario logueado */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    async function fetchUsuario() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombres")
        .eq("id", user.id)
        .single();

      if (perfil?.nombres) setNombreUsuario(perfil.nombres);
    }

    fetchUsuario();
  }, []);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
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
              mensaje: `${d.perfiles?.nombres || "Un usuario"} ha subido su ${
                d.tipo
              }`,
              fecha: d.created_at,
            })
          );
        }

        // Citas (veterinarias + adopción)
        if (filtro === "todo" || filtro === "cita") {
          /* --------------------- CITAS DE ADOPCIÓN --------------------- */
          const { data: citasAdop } = await supabase
            .from("citas_adopcion")
            .select(
              `
      id,
      estado,
      fecha_cita,
      hora_cita,
      creada_en,
      perfiles:usuario_id(nombres),
      mascotas:mascota_id(nombre)
    `
            )
            .order("creada_en", { ascending: false })
            .limit(5);

          citasAdop?.forEach((c) =>
            eventos.push({
              tipo: "cita",
              mensaje: `${c.perfiles?.nombres || "Un adoptante"} ${
                c.estado === "programada" ? "agendó" : "actualizó"
              } una **cita de adopción** para "${
                c.mascotas?.nombre || "una mascota"
              }"`,
              fecha: c.creada_en,
            })
          );

          /* --------------------- CITAS VETERINARIAS --------------------- */
          const { data: citasVet } = await supabase
            .from("citas_veterinarias")
            .select(
              `
      id,
      estado,
      fecha_cita,
      created_at,
      adopciones:adopcion_id(
        adoptante:adoptante_id(nombres),
        mascota:mascota_id(nombre)
      )
    `
            )
            .order("created_at", { ascending: false })
            .limit(5);

          citasVet?.forEach((c) =>
            eventos.push({
              tipo: "cita",
              mensaje: `${c.adopciones?.adoptante?.nombres || "Un usuario"} ${
                c.estado === "pendiente" ? "agendó" : "actualizó"
              } una cita veterinaria para "${
                c.adopciones?.mascota?.nombre || "una mascota"
              }."`,
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
              mensaje: `Mascota "${m.nombre}" ha sido adoptada!`,
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

    // Suscripción en tiempo real
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
      <PageHead
        title={nombreUsuario ? `Panel de gestión` : "Panel de gestión"}
        subtitle={
          nombreUsuario ? (
            <>
              Bienvenido a tu panel de gestión,{" "}
              <span className="font-bold text-[#BC5F36]">{nombreUsuario}</span>.
              Revisa los pendientes del día.
            </>
          ) : (
            "Bienvenido a tu panel de gestión. Revisa los pendientes del día."
          )
        }
      />

      {/* Botones de acción rápida */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        <button
          onClick={() => router.push("/dashboards/administrador/documentos")}
          className="px-4 py-2 rounded-lg bg-[#BC5F36] text-white text-sm hover:bg-[#a34f2e]"
        >
          Validar documentos
        </button>
        <button
          onClick={() => router.push("/dashboards/administrador/gestion_citas")}
          className="px-4 py-2 rounded-lg bg-orange-100 text-[#BC5F36] text-sm hover:bg-orange-200"
        >
          Ver citas
        </button>
        <button
          onClick={() => router.push("/dashboards/administrador/usuarios")}
          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
        >
          Usuarios
        </button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Documentos pendientes"
          value={stats.documentosPendientes}
          icon={<ClipboardList className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/administrador/documentos")}
        />
        <StatCard
          label="Citas hoy"
          value={stats.citasHoy}
          icon={<CalendarDays className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/administrador/gestion_citas")}
        />
        <StatCard
          label="Citas esta semana"
          value={stats.citasSemana}
          icon={<Calendar className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/administrador/gestion_citas")}
        />
        <StatCard
          label="Usuarios en revisión"
          value={stats.usuariosProceso}
          icon={<Users className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/administrador/usuarios")}
        />
        <StatCard
          label="Mascotas adoptables"
          value={stats.mascotasAdoptables}
          icon={<PawPrint className="h-6 w-6" />}
          onClick={() => router.push("/dashboards/administrador/mascotas")}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#2b1b12]">
            Actividad reciente
          </h2>

          {/* Contenedor de filtros */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-2 sm:gap-3 min-w-max px-1 pb-1 border-b border-[#eadacb]">
              {["todo", "documento", "cita", "mascota"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-t-md text-sm font-semibold transition-all duration-200 border-b-2 ${
                    filtro === f
                      ? "border-[#BC5F36] text-[#BC5F36] bg-[#fff8f4]"
                      : "border-transparent text-[#7a5c49] hover:text-[#BC5F36]"
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
