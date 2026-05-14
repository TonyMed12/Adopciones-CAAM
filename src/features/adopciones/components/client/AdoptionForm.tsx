"use client";
import { useMemo, useState } from "react";
import { subirFotosEvidencia } from "@/lib/supabase/upload-adopciones";
import { toast } from "sonner";
import {
  Info,
  Home,
  PawPrint,
  ClipboardCheck,
  Camera,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";

import ModalSeguimiento from "@/components/terminos/ModalSeguimiento";
import ModalBienestar from "@/components/terminos/ModalBienestar";

import { Button } from "@/components/ui/Button";
import { Stepper, type Step } from "@/components/ui/Stepper";
import { InfoCard } from "@/components/ui/InfoCard";
import { cn } from "@/lib/utils";

/* =================== Select (estilizado) =================== */
function FieldSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-[#eadacb] bg-white px-3.5 py-3 text-sm font-medium text-[#2b1b12] shadow-sm hover:border-[#BC5F36]/40 focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 transition-all outline-none"
      >
        <span className={current?.value === "" ? "text-[#a78d7b]" : ""}>
          {current?.label}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(
            "transition-transform shrink-0 text-[#a78d7b]",
            open ? "rotate-180" : ""
          )}
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 z-40 max-h-72 overflow-y-auto rounded-xl border border-[#eadacb] bg-white shadow-xl py-1.5 animate-fade-slide custom-scroll"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 text-sm transition-colors",
                  opt.value === value
                    ? "bg-[#FFF1E6] text-[#8B4513] font-semibold"
                    : "text-[#6c5241] hover:bg-[#FFF7EF]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =================== Tipo principal =================== */
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

/* =================== Multi-step Form =================== */
export default function AdoptionForm({ defaultValues, onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [openSeguimiento, setOpenSeguimiento] = useState(false);
  const [openBienestar, setOpenBienestar] = useState(false);

  const set = (k: keyof AdoptionPayload, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 3) {
      toast.error("Solo puedes subir hasta 3 fotos.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (idx: number) =>
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));

  /* =================== Validación por paso =================== */
  const validateStep = (step: number): string | null => {
    if (step === 0) {
      if (!form.experiencia)
        return "Debes indicar tu experiencia con mascotas.";
      if (!form.tipoVivienda) return "Debes seleccionar el tipo de vivienda.";
      if (form.tipoVivienda === "otro" && !form.detalleTipoVivienda?.trim())
        return "Por favor especifica el tipo de vivienda.";
      if (!form.espacioDisponible)
        return "Debes seleccionar el espacio disponible para la mascota.";
      if (form.espacioDisponible === "otro" && !form.detalleEspacio?.trim())
        return "Por favor especifica el tipo de espacio disponible.";
    }
    if (step === 1) {
      if (!form.otrasMascotas)
        return "Debes indicar si tienes otras mascotas.";
      if (form.otrasMascotas === "si" && !form.detalleOtrasMascotas?.trim())
        return "Indica el tipo y cantidad de tus otras mascotas.";
      if (
        selectedFiles.length === 0 &&
        form.evidenciaHogarUrls.length === 0
      )
        return "Debes subir al menos una foto del espacio donde vivirá la mascota.";
    }
    if (step === 2) {
      if (!form.compromisoSeguimiento)
        return "Debes aceptar las visitas o llamadas de seguimiento.";
      if (!form.compromisoCuidado)
        return "Debes aceptar el compromiso de bienestar de la mascota.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      toast.error(err);
      return;
    }
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const err = validateStep(2);
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
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
    }
  };

  /* =================== Stepper config =================== */
  const steps: Step[] = useMemo(
    () => [
      {
        id: "sobre-ti",
        title: "Sobre ti",
        description: "Experiencia y vivienda",
        state:
          currentStep > 0
            ? "completed"
            : currentStep === 0
            ? "current"
            : "upcoming",
      },
      {
        id: "hogar",
        title: "Tu hogar",
        description: "Mascotas y fotos",
        state:
          currentStep > 1
            ? "completed"
            : currentStep === 1
            ? "current"
            : "upcoming",
      },
      {
        id: "compromiso",
        title: "Compromisos",
        description: "Acuerdos finales",
        state: currentStep === 2 ? "current" : "upcoming",
      },
    ],
    [currentStep]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stepper visual */}
      <div className="rounded-2xl bg-white border border-[#eadacb] shadow-sm p-5 sm:p-6">
        <Stepper steps={steps} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ====================== PASO 1 ====================== */}
        {currentStep === 0 && (
          <StepPanel
            icon={<PawPrint size={20} />}
            title="Cuéntanos sobre ti"
            description="Esta información nos ayuda a entender tu experiencia y entorno para encontrar la mejor compatibilidad."
          >
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <Field label="Experiencia con mascotas" required>
                <FieldSelect
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
              </Field>

              <Field label="Tipo de vivienda" required>
                <FieldSelect
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
                    className="mt-2 w-full rounded-xl border border-[#eadacb] px-3 py-2.5 text-sm bg-white focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 outline-none"
                    placeholder="Especifica tu tipo de vivienda"
                    value={form.detalleTipoVivienda || ""}
                    onChange={(e) =>
                      set("detalleTipoVivienda", e.target.value)
                    }
                  />
                )}
              </Field>

              <Field label="Espacio disponible" required>
                <FieldSelect
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
                    className="mt-2 w-full rounded-xl border border-[#eadacb] px-3 py-2.5 text-sm bg-white focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 outline-none"
                    placeholder="Especifica el tipo de espacio"
                    value={form.detalleEspacio || ""}
                    onChange={(e) => set("detalleEspacio", e.target.value)}
                  />
                )}
              </Field>
            </div>

            <InfoCard tone="info" icon={<Info size={18} />} className="mt-5">
              Sé honesto con tus respuestas. Esto nos ayuda a confirmar que la
              mascota será feliz contigo y tú con ella.
            </InfoCard>
          </StepPanel>
        )}

        {/* ====================== PASO 2 ====================== */}
        {currentStep === 1 && (
          <StepPanel
            icon={<Home size={20} />}
            title="Sobre tu hogar"
            description="Adjunta fotos del espacio donde vivirá tu nueva mascota y cuéntanos si convivirá con otros animales."
          >
            <div className="space-y-5">
              <Field label="¿Tienes otras mascotas?" required>
                <FieldSelect
                  value={form.otrasMascotas}
                  onChange={(v) => set("otrasMascotas", v as any)}
                  ariaLabel="Otras mascotas"
                  options={[
                    { label: "Selecciona...", value: "" },
                    { label: "No", value: "no" },
                    { label: "Sí", value: "si" },
                  ]}
                />
                {form.otrasMascotas === "si" && (
                  <input
                    className="mt-2 w-full rounded-xl border border-[#eadacb] px-3 py-2.5 text-sm bg-white focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 outline-none"
                    placeholder="Ej. 2 perros y 1 gato"
                    value={form.detalleOtrasMascotas || ""}
                    onChange={(e) =>
                      set("detalleOtrasMascotas", e.target.value)
                    }
                  />
                )}
              </Field>

              <Field
                label="Fotos del espacio"
                hint={`Máximo 3 fotos (JPG/PNG). ${
                  selectedFiles.length + form.evidenciaHogarUrls.length
                } de 3`}
                required
              >
                {/* Previews */}
                {(selectedFiles.length > 0 ||
                  form.evidenciaHogarUrls.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="relative group">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white border border-[#eadacb] rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(i)}
                          className="absolute -top-2 -right-2 bg-white border border-[#eadacb] text-[#8B4513] rounded-full w-7 h-7 grid place-items-center hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 shadow-sm transition-colors"
                          aria-label="Quitar foto"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {form.evidenciaHogarUrls.map((u, i) => (
                      <div
                        key={`url-${i}`}
                        className="w-28 h-28 sm:w-32 sm:h-32 bg-white border border-[#eadacb] rounded-xl overflow-hidden shadow-sm"
                      >
                        <img
                          src={u}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedFiles.length + form.evidenciaHogarUrls.length < 3 && (
                  <label className="flex items-center justify-center w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-[#f3d6bb] bg-[#fff9f4] text-[#8B4513] hover:border-[#BC5F36] hover:bg-[#FFF1E6] transition-all p-6 sm:p-8">
                      <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-[#BC5F36] mb-2 shadow-sm">
                        <Camera size={22} />
                      </div>
                      <p className="text-sm font-bold">
                        Sube fotos del espacio
                      </p>
                      <p className="text-xs text-[#a78d7b] mt-1">
                        Haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                )}
              </Field>
            </div>
          </StepPanel>
        )}

        {/* ====================== PASO 3 ====================== */}
        {currentStep === 2 && (
          <StepPanel
            icon={<ClipboardCheck size={20} />}
            title="Compromisos finales"
            description="Antes de enviar tu solicitud, necesitamos tu compromiso con el bienestar de la mascota."
          >
            <ModalSeguimiento
              open={openSeguimiento}
              onClose={() => setOpenSeguimiento(false)}
            />
            <ModalBienestar
              open={openBienestar}
              onClose={() => setOpenBienestar(false)}
            />

            <div className="space-y-3">
              <CompromisoCard
                checked={form.compromisoSeguimiento}
                onChange={(v) => set("compromisoSeguimiento", v)}
                icon={<Heart size={20} />}
                title="Acepto visitas o llamadas de seguimiento"
                description="El CAAM podrá contactarte para verificar el bienestar de la mascota después de la adopción."
                onLearnMore={() => setOpenSeguimiento(true)}
              />
              <CompromisoCard
                checked={form.compromisoCuidado}
                onChange={(v) => set("compromisoCuidado", v)}
                icon={<Sparkles size={20} />}
                title="Me comprometo al bienestar de la mascota"
                description="Alimentación, atención veterinaria, no abandono y trato digno de por vida."
                onLearnMore={() => setOpenBienestar(true)}
              />
            </div>

            <Field label="Observaciones finales (opcional)" className="mt-5">
              <textarea
                rows={3}
                className="w-full rounded-xl border border-[#eadacb] px-3 py-2.5 text-sm bg-white focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 outline-none resize-y"
                value={form.observaciones}
                onChange={(e) => set("observaciones", e.target.value)}
                placeholder="¿Algo más que quieras compartir con nosotros?"
              />
            </Field>

            <InfoCard
              tone="brand"
              icon={<CheckCircle2 size={18} />}
              title="Listo para enviar"
              className="mt-5"
            >
              Al enviar, tu solicitud entrará a revisión. Te avisaremos cuando
              esté aprobada.
            </InfoCard>
          </StepPanel>
        )}

        {/* ====================== NAVEGACIÓN ====================== */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleBack}
                disabled={submitting}
                className="w-full sm:w-auto gap-2"
              >
                <ArrowLeft size={18} /> Anterior
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => history.back()}
              disabled={submitting}
              className="w-full sm:w-auto text-[#7a5c49]"
            >
              Cancelar
            </Button>
          </div>

          <div className="w-full sm:w-auto">
            {currentStep < 2 ? (
              <Button
                type="button"
                size="lg"
                onClick={handleNext}
                className="w-full sm:w-auto gap-2"
              >
                Siguiente <ArrowRight size={18} />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full sm:w-auto gap-2"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Enviar solicitud
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

/* =================== Sub-componentes UI =================== */

function StepPanel({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white border border-[#eadacb] shadow-sm p-5 sm:p-7 animate-fade-up">
      <header className="flex items-start gap-3 mb-5">
        <div className="grid place-items-center h-11 w-11 rounded-2xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[#7a5c49] leading-relaxed mt-0.5">
            {description}
          </p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="flex items-center justify-between text-xs sm:text-[13px] font-bold uppercase tracking-wide text-[#7a5c49]">
        <span>
          {label}
          {required && <span className="text-[#BC5F36] ml-0.5">*</span>}
        </span>
        {hint && (
          <span className="text-[10px] font-medium normal-case tracking-normal text-[#a78d7b]">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function CompromisoCard({
  checked,
  onChange,
  icon,
  title,
  description,
  onLearnMore,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  onLearnMore?: () => void;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all",
        checked
          ? "bg-[#FFF7EF] border-[#BC5F36] ring-2 ring-[#BC5F36]/20"
          : "bg-white border-[#eadacb] hover:border-[#f3d6bb]"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          "grid place-items-center h-6 w-6 rounded-md mt-0.5 shrink-0 transition-colors",
          checked
            ? "bg-[#BC5F36] text-white"
            : "bg-white border-2 border-[#eadacb]"
        )}
      >
        {checked && <CheckCircle2 size={14} strokeWidth={3} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[#BC5F36]">{icon}</span>
          <h4 className="text-sm sm:text-base font-extrabold text-[#2b1b12]">
            {title}
          </h4>
        </div>
        <p className="mt-1 text-sm text-[#6c5241] leading-relaxed">
          {description}
        </p>
        {onLearnMore && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onLearnMore();
            }}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#BC5F36] hover:text-[#8B4513] underline underline-offset-2"
          >
            <Info size={12} /> Leer detalles
          </button>
        )}
      </div>
    </label>
  );
}
