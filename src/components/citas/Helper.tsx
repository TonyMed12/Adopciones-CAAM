import type { Cita } from "../../data/citas/types";

export function useFechasBase() {
  const hoyISO = new Date().toISOString().slice(0, 10);

  const inicioSemanaISO = (() => {
    const d = new Date();
    const day = d.getDay(); // 0=Domingo
    const diff = day === 0 ? 6 : day - 1; // Lunes inicio
    d.setDate(d.getDate() - diff);
    return d.toISOString().slice(0, 10);
  })();

  const finSemanaISO = (() => {
    const d = new Date(inicioSemanaISO);
    d.setDate(d.getDate() + 6);
    return d.toISOString().slice(0, 10);
  })();

  return { hoyISO, inicioSemanaISO, finSemanaISO };
}

export function filtraCitas(
  citas: Cita[],
  params: {
    query: string;
    vista: "hoy" | "semana" | "mes";
    hoyISO: string;
    inicioSemanaISO: string;
    finSemanaISO: string;
  }
) {
  const { query, vista, hoyISO, inicioSemanaISO, finSemanaISO } = params;

  const filtraVista = (c: Cita) => {
    if (vista === "hoy") return c.fecha === hoyISO;
    if (vista === "semana") return c.fecha >= inicioSemanaISO && c.fecha <= finSemanaISO;
    return true; // mes (todas)
  };

  const filtraTexto = (c: Cita) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [c.mascota, c.veterinario, c.motivo, c.lugar, c.notas]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  };

  return citas.filter((c) => filtraVista(c) && filtraTexto(c));
}

export function agrupaPorDia(citas: Cita[]) {
  const map: Record<string, Cita[]> = {};
  for (const c of citas) {
    if (!map[c.fecha]) map[c.fecha] = [];
    map[c.fecha].push(c);
  }
  for (const k of Object.keys(map)) map[k].sort((a, b) => a.hora.localeCompare(b.hora));
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

export function formateaFechaHumana(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const f = new Date(y, m - 1, d);
  return f.toLocaleDateString("es-MX", { weekday: "long", day: "2-digit", month: "long" });
}

export function seedCitas(): Cita[] {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");

  const maniana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
  const mm2 = String(maniana.getMonth() + 1).padStart(2, "0");
  const dd2 = String(maniana.getDate()).padStart(2, "0");

  return [
    { id: crypto.randomUUID(), mascota: "Luna",  veterinario: "Dra. Gómez", motivo: "Vacunación anual", fecha: `${yyyy}-${mm}-${dd}`, hora: "10:30", duracionMin: 30, telefono: "+52 55 1234 5678", lugar: "Clínica Patitas #12", notas: "Traer cartilla de vacunación" },
    { id: crypto.randomUUID(), mascota: "Rocky", veterinario: "Dr. Pérez",  motivo: "Post-operatorio",     fecha: `${yyyy}-${mm}-${dd}`, hora: "16:00", duracionMin: 20, telefono: "+52 55 9876 5432", lugar: "Vet Centro" },
    { id: crypto.randomUUID(), mascota: "Milo",  veterinario: "Dra. Gómez", motivo: "Dermatitis",          fecha: `${maniana.getFullYear()}-${mm2}-${dd2}`, hora: "12:15", duracionMin: 40, lugar: "Clínica Patitas #12" },
  ];
}
