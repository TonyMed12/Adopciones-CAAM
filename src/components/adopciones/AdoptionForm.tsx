"use client";
import { useState } from "react";

export type AdoptionPayload = {
  usuarioId: string;
  usuarioNombre: string;
  mascotaId: string;
  mascotaNombre: string;
  experiencia: "nunca" | "poca" | "mucha";
  evidenciaHogarUrls: string[];
  direccion: string;
  telefono: string;
  compromisoAceptado: boolean;
  observaciones?: string;
};

type Props = {
  defaultValues?: Partial<AdoptionPayload>;
  onSubmit: (payload: AdoptionPayload) => void;
};

export default function AdoptionForm({ defaultValues, onSubmit }: Props) {
  const [form, setForm] = useState<AdoptionPayload>({
    usuarioId: defaultValues?.usuarioId || "usr_101",
    usuarioNombre: defaultValues?.usuarioNombre || "Ana López",
    mascotaId: defaultValues?.mascotaId || "masc_77",
    mascotaNombre: defaultValues?.mascotaNombre || "Miel",
    experiencia: defaultValues?.experiencia || "poca",
    evidenciaHogarUrls: defaultValues?.evidenciaHogarUrls || [],
    direccion: defaultValues?.direccion || "",
    telefono: defaultValues?.telefono || "",
    compromisoAceptado: defaultValues?.compromisoAceptado ?? false,
    observaciones: defaultValues?.observaciones || "",
  });

  const set = (k: keyof AdoptionPayload, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleAddFoto = () => {
    // mock: agregamos una url fake
    set("evidenciaHogarUrls", [...form.evidenciaHogarUrls, `mock_${Date.now()}.jpg`]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.compromisoAceptado) {
      alert("Debes aceptar el compromiso de cuidado.");
      return;
    }
    if (!form.direccion || !form.telefono) {
      alert("Dirección y teléfono son obligatorios.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-xl p-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Experiencia con mascotas</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={form.experiencia}
            onChange={(e)=>set("experiencia", e.target.value as any)}
          >
            <option value="nunca">Nunca he tenido</option>
            <option value="poca">Poca</option>
            <option value="mucha">Mucha</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Teléfono</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={form.telefono}
            onChange={(e)=>set("telefono", e.target.value)}
            placeholder="55-____-____"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Dirección completa</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={form.direccion}
            onChange={(e)=>set("direccion", e.target.value)}
            placeholder="Calle, número, colonia, ciudad"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Observaciones</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            rows={3}
            value={form.observaciones}
            onChange={(e)=>set("observaciones", e.target.value)}
            placeholder="Horario en casa, niños, otras mascotas, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Evidencia del lugar (fotos)</label>
          <div className="flex flex-wrap gap-2">
            {form.evidenciaHogarUrls.map((u, i)=>(
              <div key={i} className="w-24 h-16 bg-gray-100 border rounded-md grid place-items-center text-xs">
                {u.slice(0,12)}…
              </div>
            ))}
            <button type="button" onClick={handleAddFoto}
              className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50">
              + Agregar (mock)
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-start gap-2">
            <input type="checkbox" checked={form.compromisoAceptado} onChange={(e)=>set("compromisoAceptado", e.target.checked)} />
            <span className="text-sm">
              Acepto el <b>compromiso de cuidado</b> (alimentación, atención veterinaria, no abandono, etc.).
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 rounded-md bg-[#4FA2D4] text-white hover:bg-[#3b90c3]">
          Enviar a revisión
        </button>
      </div>
    </form>
  );
}
