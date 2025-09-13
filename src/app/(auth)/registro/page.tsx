"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Registro CAAM — Wizard en Modal (visual-only)
 * - SIEMPRE ABIERTO (no se puede cerrar) según pedido
 * - 3 pasos: Datos personales, Dirección, Contacto+confirmación
 * - Sin endpoints; validación por paso
 * - Accesible: role="dialog", aria-modal, focus inicial por paso
 * - Usa variables CSS: --brand-purple, --brand-pink, --brand-dark, --background
 *
 * Ubicación sugerida: app/(auth)/registro/page.tsx
 */

type Form = {
  nombre: string;
  apellidop: string;
  apellidom: string;
  correo: string;
  fechaNacimiento: string; // YYYY-MM-DD
  calle: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  telefono: string;
};

const initialForm: Form = {
  nombre: "",
  apellidop: "",
  apellidom: "",
  correo: "",
  fechaNacimiento: "",
  calle: "",
  colonia: "",
  codigoPostal: "",
  ciudad: "",
  telefono: "",
};

const steps = [
  { id: 1, name: "Datos personales" },
  { id: 2, name: "Dirección" },
  { id: 3, name: "Contacto y confirmación" },
] as const;

type Step = typeof steps[number]["id"];

export default function RegistroWizard() {
  // Modal SIEMPRE visible
  const [form, setForm] = useState<Form>(initialForm);
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Focus inicial por paso
  useEffect(() => {
    const el = dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]");
    el?.focus();
  }, [step]);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validators: Record<Step, () => string | null> = useMemo(
    () => ({
      1: () => {
        if (!form.nombre || !form.apellidop || !form.correo)
          return "Nombre, apellido paterno y correo son obligatorios.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
          return "Correo inválido.";
        if (form.fechaNacimiento && Number.isNaN(Date.parse(form.fechaNacimiento)))
          return "Fecha de nacimiento inválida.";
        return null;
      },
      2: () => {
        if (!form.calle || !form.colonia || !form.codigoPostal || !form.ciudad)
          return "Completa calle, colonia, código postal y ciudad.";
        if (!/^\d{5}$/.test(form.codigoPostal)) return "Código postal debe tener 5 dígitos.";
        return null;
      },
      3: () => {
        if (!form.telefono) return "Indica un teléfono de contacto.";
        if (!/^[\d\s()+-]{7,}$/.test(form.telefono)) return "Teléfono inválido.";
        return null;
      },
    }),
    [form]
  );

  const next = () => {
    const v = validators[step]();
    if (v) return setError(v);
    setError(null);
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  };
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lastValidation = validators[3]();
    if (lastValidation) return setError(lastValidation);
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOk("¡Registro listo! (demo)");
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-xl border border-[var(--brand-purple)]/15"
      >
        {/* Header compacto con logo - sin botón de cerrar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 border-b bg-white/80 backdrop-blur">
          <Image src="/logo.jpg" alt="Logo CAAM" width={40} height={40} className="h-10 w-auto" />
          <div>
            <h2 id="reg-title" className="text-lg font-semibold text-[var(--brand-dark)]">Adopciones CAAM</h2>
            <p className="text-xs text-[var(--brand-dark)]/70">Registro</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-5 pt-4">
          <ol className="flex items-center justify-between gap-2 text-sm">
            {steps.map((s, i) => (
              <li key={s.id} className="flex-1 flex items-center gap-2">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-white ${step >= s.id ? "bg-[var(--brand-purple)]" : "bg-gray-300"}`}>
                  {s.id}
                </span>
                <span className={`truncate ${step === s.id ? "font-semibold" : "text-gray-500"}`}>{s.name}</span>
                {i < steps.length - 1 && <div className="mx-2 h-px flex-1 bg-gray-200" />}
              </li>
            ))}
          </ol>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="px-5 pb-6 pt-4 space-y-4">
          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          {ok && (
            <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</div>
          )}

          {/* Paso 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-dark)]">Nombre(s)</label>
                <input data-autofocus type="text" value={form.nombre} onChange={set("nombre")} placeholder="Ej. Ana María" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-dark)]">Apellido paterno</label>
                  <input type="text" value={form.apellidop} onChange={set("apellidop")} placeholder="Ej. García" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-dark)]">Apellido materno</label>
                  <input type="text" value={form.apellidom} onChange={set("apellidom")} placeholder="Ej. López" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-dark)]">Correo electrónico</label>
                  <input type="email" value={form.correo} onChange={set("correo")} placeholder="tucorreo@ejemplo.com" autoComplete="email" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-dark)]">Fecha de nacimiento</label>
                  <input type="date" value={form.fechaNacimiento} onChange={set("fechaNacimiento")} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                </div>
              </div>
            </div>
          )}

          {/* Paso 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-[var(--brand-dark)]">Dirección</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--brand-dark)]">Calle y número</label>
                    <input data-autofocus type="text" value={form.calle} onChange={set("calle")} placeholder="Av. Lázaro Cárdenas 123" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--brand-dark)]">Colonia</label>
                    <input type="text" value={form.colonia} onChange={set("colonia")} placeholder="Centro" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--brand-dark)]">Código postal</label>
                    <input inputMode="numeric" maxLength={5} value={form.codigoPostal} onChange={set("codigoPostal")} placeholder="58000" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--brand-dark)]">Ciudad</label>
                    <input type="text" value={form.ciudad} onChange={set("ciudad")} placeholder="Morelia, Michoacán" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* Paso 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-dark)]">Teléfono</label>
                <input data-autofocus type="tel" value={form.telefono} onChange={set("telefono")} placeholder="443 123 4567" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[var(--brand-purple)]/20 focus:border-[var(--brand-purple)]" />
              </div>

              <div className="rounded-xl border bg-gray-50 p-4 text-sm">
                <p className="font-semibold mb-2">Resumen</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  <span><strong>Nombre:</strong> {form.nombre} {form.apellidop} {form.apellidom}</span>
                  <span><strong>Correo:</strong> {form.correo}</span>
                  <span><strong>Nacimiento:</strong> {form.fechaNacimiento || "-"}</span>
                  <span className="md:col-span-2"><strong>Dirección:</strong> {form.calle}, {form.colonia}, CP {form.codigoPostal}, {form.ciudad}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer de acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between pt-2">
            <div className="text-sm text-gray-600">
              ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-[var(--brand-pink)] hover:underline">Inicia sesión</Link>
            </div>
            <div className="flex gap-2 justify-end">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={back}>Atrás</Button>
              )}
              {step < 3 ? (
                <Button type="button" variant="primary" onClick={next}>Siguiente</Button>
              ) : (
                <Button type="submit" variant="primary">{loading ? "Guardando..." : "Crear cuenta"}</Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
