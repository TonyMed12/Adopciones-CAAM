"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  FileUp,
  Info,
  XCircle,
  CalendarCheck,
  FileText,
  PawPrint,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";

type Estado = "sin_documentos" | "en_revision" | "aprobado" | "rechazado";

type DocReq = {
  id: string;
  nombre: string;
  descripcion: string;
  requerido: boolean;
};

const REQUISITOS: DocReq[] = [
  {
    id: "identificacion",
    nombre: "Identificación oficial",
    descripcion: "INE / Pasaporte",
    requerido: true,
  },
  {
    id: "comprobante",
    nombre: "Comprobante de domicilio",
    descripcion: "No mayor a 3 meses",
    requerido: true,
  },
  {
    id: "carta",
    nombre: "Carta compromiso",
    descripcion: "Formato del CAAM firmado",
    requerido: true,
  },
];

export default function ProcesoAdopcionPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const from = qs.get("from");

  const [estado, setEstado] = useState<Estado>("sin_documentos");
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem("docEstado")) as Estado | null;
    if (stored) setEstado(stored as Estado);
  }, []);

  const [archivos, setArchivos] = useState<Record<string, File | null>>({
    identificacion: null,
    comprobante: null,
    carta: null,
  });
  const [motivoRechazo] = useState<string>(
    "Falta nitidez en la identificación (ejemplo visual)."
  );

  const completos = useMemo(
    () => Object.values(archivos).every((f) => !!f),
    [archivos]
  );

  function sanitizeFileName(fileName: string) {
    return fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita acentos
      .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // reemplaza espacios y caracteres raros por "_"
  }

  async function uploadDocumento(file: File, tipo: string, perfilId?: string) {
    const safeName = sanitizeFileName(file.name);

    const perfil = perfilId ?? "e10181d6-1874-4be2-9c1b-521f7f431d19";

    const { data, error } = await supabase.storage
      .from("documentos_adopcion")
      .upload(`${perfil}/${tipo}-${Date.now()}-${safeName}`, file);

    if (error) {
      console.error("Error en upload:", error);
      throw error;
    }

    console.log("Archivo subido:", data);

    const { data: insertData, error: dbError } = await supabase
      .from("documentos")
      .insert({
        perfil_id: perfil,
        tipo,
        url: data.path,
      })
      .select();

    if (dbError) {
      console.error("Error insertando en documentos:", dbError);
      throw dbError;
    }

    console.log("Documento insertado en DB:", insertData);
  }

  function onPick(id: string, file?: File) {
    setArchivos((prev) => ({ ...prev, [id]: file ?? null }));
  }

  async function enviar() {
    try {
      const perfilId = "e10181d6-1874-4be2-9c1b-521f7f431d19";

      // Subir documentos
      await uploadDocumento(
        archivos.identificacion!,
        "identificacion",
        perfilId
      );
      await uploadDocumento(archivos.comprobante!, "comprobante", perfilId);
      await uploadDocumento(archivos.carta!, "carta", perfilId);

      // Cambiar estado
      setEstado("en_revision");
      localStorage.setItem("docEstado", "en_revision");

      console.log("✅ Documentos enviados correctamente.");
    } catch (err) {
      console.error("Error subiendo documentos:", JSON.stringify(err, null, 2));
    }
  }

  function simularAprobacion() {
    setEstado("aprobado");
    localStorage.setItem("docEstado", "aprobado");
    if (from) {
      router.push(`/usuario/mascotas?adoptId=${from}`);
    }
  }

  return (
    <div className="space-y-8">
      <PageHead
        title="Proceso de adopción"
        subtitle={
          estado === "aprobado"
            ? "¡Listo! Continua con la adopción."
            : "Sube tus documentos para que un administrador los valide antes de continuar."
        }
      />

      {/* Stepper cambia según el estado */}
      {estado !== "aprobado" ? (
        <Stepper estado={estado} />
      ) : (
        <StepperAdopcion />
      )}

      {/* --------- Bloques según estado de validación --------- */}
      {estado === "sin_documentos" && (
        <SeccionCarga
          archivos={archivos}
          onPick={onPick}
          onEnviar={enviar}
          deshabilitarEnviar={!completos}
        />
      )}

      {estado === "en_revision" && (
        <PanelEstado
          icon={<Clock className="h-6 w-6" />}
          title="Tus documentos están en revisión"
          desc="Un administrador revisará que todo esté correcto. Te avisaremos cuando hayan sido aprobados."
          note="Tiempo estimado visual — el back definirá los tiempos reales."
          cta={
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="px-4 py-2"
                onClick={() => setEstado("rechazado")}
              >
                Simular rechazo
              </Button>
              <Button className="px-4 py-2" onClick={simularAprobacion}>
                Simular aprobación
              </Button>
            </div>
          }
        />
      )}

      {estado === "rechazado" && (
        <PanelEstado
          tone="danger"
          icon={<XCircle className="h-6 w-6" />}
          title="Documentos rechazados"
          desc="Por favor corrige lo indicado y vuelve a enviarlos."
          note={`Motivo (demo): ${motivoRechazo}`}
          cta={
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="px-4 py-2"
                onClick={() => setEstado("sin_documentos")}
              >
                Volver a subir
              </Button>
              <Button
                className="px-4 py-2"
                onClick={() => {
                  setEstado("en_revision");
                  localStorage.setItem("docEstado", "en_revision");
                }}
              >
                Reenviar para revisión
              </Button>
            </div>
          }
        />
      )}

      {/* --------- UI cuando YA está aprobado --------- */}
      {estado === "aprobado" && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-5 text-[#2b1b12] shadow-[0_6px_14px_rgba(43,27,18,.08)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#2e7d32]" />
            <h3 className="text-sm font-extrabold">¡Documentos aprobados!</h3>
          </div>

          <p className="mt-2 text-sm text-[#7a5c49]">
            Ahora sí, continúa con tu proceso de adopción. Si llegaste desde una
            mascota, te enviaremos directo a continuar con ella.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StepCard
              icon={<PawPrint className="h-5 w-5" />}
              title="1) Elegir mascota"
              desc="Revisa perfiles y elige a tu compañerito."
              action={
                <Link href="/usuario/mascotas">
                  <Button className="w-full">Ir a ver mascotas</Button>
                </Link>
              }
            />
            <StepCard
              icon={<CalendarCheck className="h-5 w-5" />}
              title="2) Agendar visita"
              desc="Conoce a la mascota y valida compatibilidad."
              action={
                <Link href="/usuario/citas">
                  <Button variant="ghost" className="w-full">
                    Agendar
                  </Button>
                </Link>
              }
            />
            <StepCard
              icon={<FileText className="h-5 w-5" />}
              title="3) Solicitud y contrato"
              desc="Llena la solicitud y firma el compromiso."
              action={
                <Button variant="ghost" className="w-full">
                  Abrir solicitud
                </Button>
              }
            />
          </div>

          {/* CTA contextual si traemos ?from */}
          {from && (
            <div className="mt-5 rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
              <p className="text-sm">
                Iniciaste el flujo desde una mascota. Puedes continuar con esa
                adopción:
              </p>
              <div className="mt-3">
                <Button
                  onClick={() =>
                    router.push(`/usuario/mascotas?adoptId=${from}`)
                  }
                >
                  Continuar con esa mascota
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FAQs */}
      <section className="rounded-2xl border border-[#eadacb] bg-white p-5 text-[#2b1b12] shadow-[0_6px_14px_rgba(43,27,18,.08)]">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-[#BC5F36]" />
          <h3 className="text-sm font-extrabold">Preguntas frecuentes</h3>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
          <li>
            • Formatos aceptados (visual): PDF, JPG, PNG. Tamaño máx. 5 MB por
            archivo.
          </li>
          <li>
            • La revisión la realiza un administrador. Te notificaremos al
            aprobar o rechazar.
          </li>
          <li>• Si hay observaciones, podrás corregir y volver a enviar.</li>
        </ul>
      </section>
    </div>
  );
}

/* ------------------ Componentes UI ------------------ */

function Stepper({ estado }: { estado: Estado }) {
  const steps = [
    { key: "sin_documentos", label: "1. Sube tus documentos" },
    { key: "en_revision", label: "2. Revisión del administrador" },
    { key: "aprobado", label: "3. Aprobado" },
  ] as const;

  const currentIndex =
    estado === "sin_documentos" ? 0 : estado === "en_revision" ? 1 : 2;

  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {steps.map((s, idx) => {
        const done = idx < currentIndex;
        const active = idx === currentIndex;
        return (
          <li
            key={s.key}
            className={[
              "rounded-xl border p-4 shadow-[0_6px_14px_rgba(43,27,18,.06)]",
              active
                ? "border-[#BC5F36] bg-[#fff4e7]"
                : "border-[#eadacb] bg-white",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
                  done
                    ? "bg-[#BC5F36] text-white"
                    : active
                    ? "bg-[#BC5F36]/15 text-[#BC5F36]"
                    : "bg-[#f5ebe1] text-[#7a5c49]",
                ].join(" ")}
              >
                {done ? "✓" : idx + 1}
              </span>
              <p className="text-sm font-extrabold text-[#2b1b12]">{s.label}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepperAdopcion() {
  const steps = [
    "1. Elegir mascota",
    "2. Agendar visita",
    "3. Solicitud y contrato",
    "4. Confirmación",
  ];
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {steps.map((label, idx) => (
        <li
          key={label}
          className="rounded-xl border border-[#eadacb] bg-[#fff4e7] p-4 shadow-[0_6px_14px_rgba(43,27,18,.06)]"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#BC5F36] text-xs font-bold text-white">
              {idx + 1}
            </span>
            <p className="text-sm font-extrabold text-[#2b1b12]">{label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SeccionCarga({
  archivos,
  onPick,
  onEnviar,
  deshabilitarEnviar,
}: {
  archivos: Record<string, File | null>;
  onPick: (id: string, file?: File) => void;
  onEnviar: () => void;
  deshabilitarEnviar: boolean;
}) {
  return (
    <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-[0_12px_30px_rgba(43,27,18,.08)]">
      <h3 className="text-sm font-extrabold text-[#2b1b12]">
        Sube tus documentos
      </h3>
      <p className="mt-1 text-sm text-[#7a5c49]">
        Adjunta los archivos requeridos. Puedes arrastrar y soltar o seleccionar
        desde tu dispositivo.
      </p>

      <div className="mt-5 grid gap-3">
        {REQUISITOS.map((req) => (
          <RowDocumento
            key={req.id}
            requerido={req.requerido}
            titulo={req.nombre}
            desc={req.descripcion}
            archivo={archivos[req.id]}
          >
            <input
              id={`file-${req.id}`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => onPick(req.id, e.target.files?.[0] || undefined)}
            />
            <Button
              variant="ghost"
              className="px-3 py-2"
              onClick={() => document.getElementById(`file-${req.id}`)?.click()}
            >
              <FileUp className="h-4 w-4" />
              {archivos[req.id] ? "Cambiar" : "Seleccionar"}
            </Button>
            {archivos[req.id] && (
              <Button
                variant="ghost"
                className="px-3 py-2"
                onClick={() => onPick(req.id, undefined)}
              >
                Quitar
              </Button>
            )}
          </RowDocumento>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-[#7a5c49]">
          Formatos: PDF, JPG, PNG. Máx. 5 MB (visual).
        </p>
        <Button
          className="px-5 py-3"
          disabled={deshabilitarEnviar}
          onClick={onEnviar}
        >
          <FileCheck2 className="h-5 w-5" />
          Enviar para revisión
        </Button>
      </div>
    </section>
  );
}

function RowDocumento({
  titulo,
  desc,
  requerido,
  archivo,
  children,
}: {
  titulo: string;
  desc: string;
  requerido?: boolean;
  archivo?: File | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-3">
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-[#2b1b12]">
          {titulo} {requerido && <span className="text-[#BC5F36]">*</span>}
        </p>
        <p className="truncate text-xs text-[#7a5c49]">{desc}</p>
        {archivo && (
          <p className="mt-1 truncate text-xs text-[#2b1b12]">
            Archivo: <span className="font-semibold">{archivo.name}</span>
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

function StepCard({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#eadacb] bg-[#fffaf4] p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#BC5F36]/15 text-[#BC5F36]">
          {icon}
        </span>
        <p className="text-sm font-extrabold text-[#2b1b12]">{title}</p>
      </div>
      <p className="mt-1 text-sm text-[#7a5c49]">{desc}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

function PanelEstado({
  icon,
  title,
  desc,
  note,
  cta,
  tone = "info",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  note?: string;
  cta?: React.ReactNode;
  tone?: "info" | "success" | "danger";
}) {
  const tones = {
    info: { border: "#eadacb", bg: "#fff4e7", iconBg: "#BC5F36" },
    success: { border: "#dbead3", bg: "#f3fff3", iconBg: "#2e7d32" },
    danger: { border: "#f2d6d6", bg: "#fff5f5", iconBg: "#b42318" },
  } as const;

  const t = tones[tone];

  return (
    <section
      className="rounded-2xl p-5 shadow-[0_12px_30px_rgba(43,27,18,.08)]"
      style={{ border: `1px solid ${t.border}`, background: t.bg }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 grid h-9 w-9 place-items-center rounded-full text-white"
          style={{ background: t.iconBg }}
        >
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-extrabold text-[#2b1b12]">{title}</h3>
          <p className="mt-1 text-sm text-[#7a5c49]">{desc}</p>
          {note && <p className="mt-2 text-xs text-[#7a5c49]">{note}</p>}
          {cta && <div className="mt-4">{cta}</div>}
        </div>
      </div>
    </section>
  );
}
