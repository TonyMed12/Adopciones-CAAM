function Stat({ label, value, tag }: { label: string; value: string | number; tag?: string }) {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-5"
      style={{ boxShadow: "0 10px 30px rgba(2,6,23,.05)" }}
    >
      <div className="text-slate-500 text-sm flex items-center gap-2">
        {label}
        {tag && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{tag}</span>
        )}
      </div>
      <div className="mt-1 text-3xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

function Chip({ text, color = "emerald" }: { text: string; color?: "emerald" | "violet" | "amber" }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
  } as const;
  return <span className={`text-[11px] px-2 py-0.5 rounded-full ${map[color]}`}>{text}</span>;
}

export default function AdminHome() {
  return (
    <div className="space-y-8">
      {/* Top bar visual */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Bienvenido</h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Buscar…"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white/70"
          />
          <button className="rounded-xl px-4 py-2 text-sm bg-[#00375F] text-white">+ Nueva cita</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Mascotas registradas" value={128} tag="hoy" />
        <Stat label="Adoptables" value={64} tag="hoy" />
        <Stat label="Adoptadas (mes)" value={12} />
        <Stat label="Usuarios activos" value={23} />
      </div>

      {/* Sección estilo “cards” */}
      <div className="space-y-4">
        <h2 className="font-semibold text-slate-700">Próximas atenciones</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { nombre: "Luna", tipo: "Perro", hora: "12:30 PM", chip: <Chip text="Confirmada" color="amber" /> },
            { nombre: "Milo", tipo: "Gato", hora: "01:00 PM", chip: <Chip text="Llegó" color="violet" /> },
            { nombre: "Nala", tipo: "Perro", hora: "01:30 PM", chip: <Chip text="Adoptable" color="emerald" /> },
          ].map((c) => (
            <div
              key={c.nombre}
              className="rounded-2xl border border-slate-100 bg-white p-5"
              style={{ boxShadow: "0 10px 30px rgba(2,6,23,.05)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{c.nombre}</div>
                  <div className="text-sm text-slate-500">{c.tipo}</div>
                </div>
                {c.chip}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-slate-500">
                  <span className="text-slate-400">Hora:</span> {c.hora}
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                    Reprogramar
                  </button>
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda de estados (barra inferior visual) */}
      <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-300" /> No show
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-500" /> Completado
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Pendiente
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> En curso
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-600" /> Confirmado
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> Llegó
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> Cancelado
        </span>
      </div>
    </div>
  );
}
