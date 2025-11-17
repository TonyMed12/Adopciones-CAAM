"use client";
import { useState } from "react";
import { subirFotosEvidencia } from "@/lib/supabase/upload-adopciones";
import "@/styles/form-mascota.css";
import { toast } from "sonner";
import { Info } from "lucide-react";
import ModalSeguimiento from "@/components/terminos/ModalSeguimiento";
import ModalBienestar from "@/components/terminos/ModalBienestar";

/* ====================== MenuSelect (reutilizado del FormMascota) ====================== */
function MenuSelect({
  value,
  onChange,
  options,
  ariaLabel,
  widthClass = "w-full",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  ariaLabel: string;
  widthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div
      className={`mselect ${widthClass}`}
      data-open={open ? "true" : "false"}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="mselect-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current?.label}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="chev"
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div className="mselect-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`mselect-item ${opt.value === value ? "is-active" : ""
                }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====================== Tipo principal ====================== */
export type AdoptionPayload = {
  usuarioId: string;
  usuarioNombre: string;
  mascotaId: string;
  mascotaNombre: string;
  experiencia: "nunca" | "poca" | "mucha";
  tipoVivienda: string;
  detalleTipoVivienda?: string;
  espacioDisponible: string;
  detalleEspacio?: string;
  otrasMascotas: "si" | "no";
  detalleOtrasMascotas?: string;
  evidenciaHogarUrls: string[];
  compromisoSeguimiento: boolean;
  compromisoCuidado: boolean;
  observaciones?: string;
};

type Props = {
  defaultValues?: Partial<AdoptionPayload>;
  onSubmit: (payload: AdoptionPayload) => void;
};

/* ====================== Formulario ====================== */
export default function AdoptionForm({ defaultValues, onSubmit }: Props) {
  const [form, setForm] = useState<AdoptionPayload>({
    usuarioId: defaultValues?.usuarioId || "usr_101",
    usuarioNombre: defaultValues?.usuarioNombre || "Ana López",
    mascotaId: defaultValues?.mascotaId || "masc_77",
    mascotaNombre: defaultValues?.mascotaNombre || "Miel",
    experiencia: defaultValues?.experiencia || "poca",
    tipoVivienda: defaultValues?.tipoVivienda || "casa_propia",
    espacioDisponible: defaultValues?.espacioDisponible || "interior",
    otrasMascotas: defaultValues?.otrasMascotas || "no",
    detalleOtrasMascotas: defaultValues?.detalleOtrasMascotas || "",
    evidenciaHogarUrls: defaultValues?.evidenciaHogarUrls || [],
    compromisoSeguimiento: defaultValues?.compromisoSeguimiento ?? false,
    compromisoCuidado: defaultValues?.compromisoCuidado ?? false,
    observaciones: defaultValues?.observaciones || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: keyof AdoptionPayload, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [openSeguimiento, setOpenSeguimiento] = useState(false);
  const [openBienestar, setOpenBienestar] = useState(false);
  const linkClasses =
    "text-[#B87333] hover:text-[#8B5E34] underline underline-offset-2 cursor-pointer font-medium";
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 3) {
      toast.error("Solo puedes subir hasta 3 fotos.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return; // evita doble submit
    setSubmitting(true);

    // --- VALIDACIONES ---
    if (!form.experiencia) {
      toast.error("Debes indicar tu experiencia con mascotas.");
      setSubmitting(false);
      return;
    }
    if (!form.tipoVivienda) {
      toast.error("Debes seleccionar el tipo de vivienda.");
      setSubmitting(false);
      return;
    }
    if (form.tipoVivienda === "otro" && !form.detalleTipoVivienda?.trim()) {
      toast.error("Por favor especifica el tipo de vivienda.");
      setSubmitting(false);
      return;
    }
    if (!form.espacioDisponible) {
      toast.error("Debes seleccionar el espacio disponible para la mascota.");
      setSubmitting(false);
      return;
    }
    if (form.espacioDisponible === "otro" && !form.detalleEspacio?.trim()) {
      toast.error("Por favor especifica el tipo de espacio disponible.");
      setSubmitting(false);
      return;
    }
    if (!form.otrasMascotas) {
      toast.error("Debes indicar si tienes otras mascotas.");
      setSubmitting(false);
      return;
    }
    if (form.otrasMascotas === "si" && !form.detalleOtrasMascotas?.trim()) {
      toast.error("Indica el tipo y cantidad de tus otras mascotas.");
      setSubmitting(false);
      return;
    }
    if (selectedFiles.length === 0 && form.evidenciaHogarUrls.length === 0) {
      toast.error(
        "Debes subir al menos una foto del espacio donde vivirá la mascota."
      );
      setSubmitting(false);
      return;
    }
    if (!form.compromisoSeguimiento) {
      toast.error("Debes aceptar las visitas o llamadas de seguimiento.");
      setSubmitting(false);
      return;
    }
    if (!form.compromisoCuidado) {
      toast.error("Debes aceptar el compromiso de bienestar de la mascota.");
      setSubmitting(false);
      return;
    }

    // --- PROCESAMIENTO FINAL ---
    try {
      const tipoViviendaFinal =
        form.tipoVivienda === "otro"
          ? form.detalleTipoVivienda
          : form.tipoVivienda;

      const espacioFinal =
        form.espacioDisponible === "otro"
          ? form.detalleEspacio
          : form.espacioDisponible;

      let nuevasUrls: string[] = [];
      if (selectedFiles.length > 0) {
        nuevasUrls = await subirFotosEvidencia(selectedFiles, form.usuarioId);
      }

      const evidenciaFinal = [
        ...(form.evidenciaHogarUrls || []),
        ...nuevasUrls,
      ];

      const finalData: AdoptionPayload = {
        ...form,
        tipoVivienda: tipoViviendaFinal!,
        espacioDisponible: espacioFinal!,
        evidenciaHogarUrls: evidenciaFinal,
      };

      await onSubmit(finalData);
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al enviar el formulario.");
      setSubmitting(false);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="row">
        <div className="field">
          <label>Experiencia con mascotas</label>
          <MenuSelect
            value={form.experiencia}
            onChange={(v) => set("experiencia", v)}
            ariaLabel="Experiencia con mascotas"
            options={[
              { label: "Selecciona...", value: "" },
              { label: "Nunca he tenido", value: "nunca" },
              { label: "Poca", value: "poca" },
              { label: "Mucha", value: "mucha" },
            ]}
          />
        </div>

        <div className="field">
          <label>Tipo de vivienda</label>
          <MenuSelect
            value={form.tipoVivienda}
            onChange={(v) => set("tipoVivienda", v)}
            ariaLabel="Tipo de vivienda"
            options={[
              { label: "Selecciona...", value: "" },
              { label: "Casa propia", value: "casa_propia" },
              { label: "Casa rentada", value: "casa_rentada" },
              { label: "Departamento", value: "departamento" },
              { label: "Otro", value: "otro" },
            ]}
          />
          {form.tipoVivienda === "otro" && (
            <input
              className="mt-2 w-full rounded-lg border border-[#FF8414]/40 px-3 py-2 text-sm focus:border-[#FF8414] focus:outline-none bg-white"
              placeholder="Especifica tu tipo de vivienda"
              value={form.detalleTipoVivienda || ""}
              onChange={(e) => set("detalleTipoVivienda", e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>Espacio disponible para la mascota</label>
          <MenuSelect
            value={form.espacioDisponible}
            onChange={(v) => set("espacioDisponible", v)}
            ariaLabel="Espacio disponible"
            options={[
              { label: "Selecciona...", value: "" },
              { label: "Interior", value: "interior" },
              { label: "Patio", value: "patio" },
              { label: "Jardín", value: "jardin" },
              { label: "Terraza", value: "terraza" },
              { label: "Limitado", value: "limitado" },
              { label: "Otro", value: "otro" },
            ]}
          />
          {form.espacioDisponible === "otro" && (
            <input
              className="mt-2 w-full rounded-lg border border-[#FF8414]/40 px-3 py-2 text-sm focus:border-[#FF8414] focus:outline-none bg-white"
              placeholder="Especifica el tipo de espacio"
              value={form.detalleEspacio || ""}
              onChange={(e) => set("detalleEspacio", e.target.value)}
            />
          )}
        </div>

        <div className="field">
          <label>¿Tienes otras mascotas?</label>
          <MenuSelect
            value={form.otrasMascotas}
            onChange={(v) => set("otrasMascotas", v as any)}
            ariaLabel="Otras mascotas"
            options={[
              { label: "Selecciona...", value: "" },
              { label: "No", value: "no" },
              { label: "Sí", value: "si" },
            ]}
          />
        </div>
      </div>

      {form.otrasMascotas === "si" && (
        <div className="field">
          <label>Especifica tipo y cantidad de mascotas</label>
          <input
            className="w-full rounded-lg border border-[#FF8414]/40 px-3 py-2 focus:border-[#FF8414] focus:outline-none bg-white"
            value={form.detalleOtrasMascotas}
            onChange={(e) => set("detalleOtrasMascotas", e.target.value)}
            placeholder="Ej. 2 perros y 1 gato"
          />
        </div>
      )}

      {/* EVIDENCIA */}
      <div className="field">
        <label>Foto(s) del espacio donde vivirá la mascota</label>

        {/* Previews (aún no subidos) */}
        {selectedFiles.length > 0 ||
          (form.evidenciaHogarUrls?.length ?? 0) > 0 ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedFiles.map((file, i) => (
              <div key={i} className="relative">
                <div className="w-28 h-20 bg-white border border-[#FF8414]/30 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSelectedFile(i)}
                  className="absolute -top-2 -right-2 bg-white border border-[#FF8414]/40 text-[#8B4513] rounded-full w-6 h-6 grid place-items-center text-xs hover:bg-[#fff2e6]"
                  title="Quitar"
                >
                  ×
                </button>
              </div>
            ))}

            {form.evidenciaHogarUrls.map((u, i) => (
              <div
                key={`url-${i}`}
                className="w-28 h-20 bg-white border border-[#FF8414]/30 rounded-lg overflow-hidden shadow-sm"
              >
                <img src={u} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}

        {/* Input de archivos (estilo drop target como en FormMascota) */}
        <label className="mt-1 flex justify-center items-center w-full">
          <div className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-[#FF8414]/50 bg-[#fff9f4] text-[#8B4513] hover:border-[#FF8414] transition cursor-pointer p-6">
            <span className="text-3xl mb-1">📷</span>
            <p className="text-sm font-medium">Sube hasta 3 fotos</p>
            <p className="text-xs opacity-70 mt-1">Haz clic para seleccionar</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>
        <p className="text-xs text-[#8B4513]/80 mt-2">
          Máximo 3 fotos (JPG/PNG).
        </p>
      </div>

      {/* COMPROMISOS */}
      <div className="field">
        <label className="mb-2 text-[#8B4513] font-semibold">Compromisos</label>

        <>
          <ModalSeguimiento open={openSeguimiento} onClose={() => setOpenSeguimiento(false)} />
          <ModalBienestar open={openBienestar} onClose={() => setOpenBienestar(false)} />

          <div className="flex flex-col gap-4 mt-2">

            {/* SEGUIMIENTO */}
            <label className="inline-flex items-start gap-2 text-sm text-[#4A2C1E] leading-snug select-none">
              <input
                type="checkbox"
                checked={form.compromisoSeguimiento}
                onChange={(e) => set("compromisoSeguimiento", e.target.checked)}
                className="h-4 w-4 accent-[#FF8414] cursor-pointer mt-0.5"
              />

              <span className="flex flex-wrap items-center gap-1">
                Acepto{" "}
                <span
                  onClick={() => setOpenSeguimiento(true)}
                  className="font-semibold cursor-pointer hover:text-[#8B5E34]"
                >
                  <b>visitas o llamadas de seguimiento</b>
                </span>{" "}
                del CAAM.

                <span
                  onClick={() => setOpenSeguimiento(true)}
                  className="text-[#B87333] hover:text-[#8B5E34] underline underline-offset-2 cursor-pointer flex items-center gap-1 ml-2"
                >
                  Leer más <Info size={14} />
                </span>
              </span>
            </label>
            
            {/* BIENESTAR */}
            <label className="inline-flex items-start gap-2 text-sm text-[#4A2C1E] leading-snug select-none">
              <input
                type="checkbox"
                checked={form.compromisoCuidado}
                onChange={(e) => set("compromisoCuidado", e.target.checked)}
                className="h-4 w-4 accent-[#FF8414] cursor-pointer mt-0.5"
              />

              <span className="flex flex-wrap items-center gap-1">
                Me comprometo a{" "}
                <span
                  onClick={() => setOpenBienestar(true)}
                  className="font-semibold cursor-pointer hover:text-[#8B5E34]"
                >
                  <b>mantener el bienestar de la mascota</b>
                </span>{" "}
                (alimentación, atención veterinaria, no abandono, etc.).

                <span
                  onClick={() => setOpenBienestar(true)}
                  className="text-[#B87333] hover:text-[#8B5E34] underline underline-offset-2 cursor-pointer flex items-center gap-1 ml-2"
                >
                  Leer más <Info size={14} />
                </span>
              </span>
            </label>
          </div>
        </>
      </div>

      {/* OBSERVACIONES */}
      <div className="field">
        <label>Observaciones finales (opcional)</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-[#FF8414]/40 px-3 py-2 focus:border-[#FF8414] focus:outline-none bg-white"
          value={form.observaciones}
          onChange={(e) => set("observaciones", e.target.value)}
          placeholder="¿Algo más que quieras compartir?"
        />
      </div>

      {/* ACCIONES */}
      <div className="actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => history.back()}
          disabled={submitting}
        >
          Cancelar
        </button>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar solicitud"}
        </button>
      </div>
    </form>
  );
}
