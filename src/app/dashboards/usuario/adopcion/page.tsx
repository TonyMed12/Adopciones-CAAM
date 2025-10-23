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
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";

type Estado = "sin_documentos" | "en_revision" | "aprobado" | "rechazado";

export default function ProcesoAdopcionPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const from = qs.get("from");

  // Estado de documentos y vista
  const [estado, setEstado] = useState<Estado>("sin_documentos");
  const [mostrarAgendar, setMostrarAgendar] = useState(false);

  // Estado de carga de documentos
  useEffect(() => {
    async function fetchEstado() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: docs, error } = await supabase
        .from("documentos")
        .select("status")
        .eq("perfil_id", user.id);

      if (error) return console.error(error);

      if (!docs?.length) return setEstado("sin_documentos");

      const estados = docs.map((d) => d.status);
      if (estados.every((s) => s === "aprobado")) setEstado("aprobado");
      else if (estados.some((s) => s === "rechazado")) setEstado("rechazado");
      else setEstado("en_revision");
    }
    fetchEstado();
  }, []);

  // Estado de archivos cargados
  const [archivos, setArchivos] = useState<Record<string, File | null>>({
    identificacion: null,
    comprobante: null,
    carta: null,
  });
  const completos = useMemo(
    () => Object.values(archivos).every((f) => !!f),
    [archivos]
  );

  async function uploadDocumento(file: File, tipo: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No hay sesión activa");

    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const { data, error } = await supabase.storage
      .from("documentos_adopcion")
      .upload(`${user.id}/${tipo}-${Date.now()}-${safe}`, file);

    if (error) throw error;

    await supabase.from("documentos").upsert(
      {
        perfil_id: user.id,
        tipo,
        url: data.path,
        status: "pendiente",
      },
      { onConflict: "perfil_id,tipo" }
    );
  }

  async function enviar() {
    try {
      await uploadDocumento(archivos.identificacion!, "identificacion");
      await uploadDocumento(archivos.comprobante!, "comprobante");
      await uploadDocumento(archivos.carta!, "carta");
      setEstado("en_revision");
    } catch (err) {
      console.error(err);
    }
  }

  // --------------------------------------------------------
  // 💡 Render principal
  // --------------------------------------------------------
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

      {estado !== "aprobado" ? (
        <Stepper estado={estado} />
      ) : (
        <StepperAdopcion />
      )}

      {/* -------- Bloques por estado -------- */}
      {estado === "sin_documentos" && (
        <SeccionCarga
          archivos={archivos}
          onPick={(id, file) =>
            setArchivos({ ...archivos, [id]: file ?? null })
          }
          onEnviar={enviar}
          deshabilitarEnviar={!completos}
        />
      )}

      {estado === "en_revision" && (
        <PanelEstado
          icon={<Clock className="h-6 w-6" />}
          title="Tus documentos están en revisión"
          desc="Un administrador revisará que todo esté correcto. Te avisaremos cuando hayan sido aprobados."
        />
      )}

      {estado === "rechazado" && (
        <PanelEstado
          tone="danger"
          icon={<XCircle className="h-6 w-6" />}
          title="Documentos rechazados"
          desc="Por favor corrige lo indicado y vuelve a enviarlos."
        />
      )}

      {/* -------- Vista Aprobado -------- */}
      {estado === "aprobado" && (
        <>
          {!mostrarAgendar ? (
            <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm text-[#2b1b12]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-[#2e7d32]" />
                <h3 className="text-sm font-extrabold">
                  ¡Documentos aprobados!
                </h3>
              </div>
              <p className="text-sm text-[#7a5c49]">
                Ahora sí, continúa con tu proceso de adopción. Si llegaste desde
                una mascota, te enviaremos directo a continuar con ella.
              </p>

              {/* Cards centrales */}
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
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setMostrarAgendar(true)}
                    >
                      Agendar
                    </Button>
                  }
                />
                <StepCard
                  icon={<FileText className="h-5 w-5" />}
                  title="3) Solicitud y contrato"
                  desc="Llena la solicitud y firma el compromiso."
                  action={
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href={"/dashboards/usuario/solicitudes"}>
                      Abrir solicitud
                      </Link>
                    </Button>
                  }
                />
              </div>
            </section>
          ) : (
            <CardAgendar onBack={() => setMostrarAgendar(false)} />
          )}
        </>
      )}

      {/* FAQs */}
      <section className="rounded-2xl border border-[#eadacb] bg-white p-5 text-[#2b1b12] shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-[#BC5F36]" />
          <h3 className="text-sm font-extrabold">Preguntas frecuentes</h3>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
          <li>• Formatos aceptados: PDF, JPG, PNG. Tamaño máx. 5 MB.</li>
          <li>• La revisión la realiza un administrador.</li>
          <li>• Si hay observaciones, podrás corregir y volver a enviar.</li>
        </ul>
      </section>
    </div>
  );
}

/* ---------------- COMPONENTES ---------------- */

function CardAgendar({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-sm text-[#2b1b12]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
          Agendar visita
        </h3>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Regresar
        </Button>
      </div>

      <p className="text-sm text-[#7a5c49] mb-4">
        Aquí puedes revisar tus solicitudes activas o crear una cita de visita
        para conocer a la mascota antes de continuar con el proceso de adopción.
      </p>

      <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
        <p className="text-sm font-extrabold mb-2">Solicitudes activas</p>
        <p className="text-xs text-[#7a5c49] mb-3">
          A continuación puedes ver tus solicitudes pendientes o aprobadas:
        </p>
        <Button
          className="w-full"
          onClick={() => router.push("/dashboards/usuario/citas")}
        >
          Ver mis solicitudes
        </Button>
      </div>

      <div className="mt-5 text-right">
        <Button
          variant="ghost"
          onClick={() => router.push("/usuario/citas")}
          className="px-5"
        >
          Crear nueva cita
        </Button>
      </div>
    </section>
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

function Stepper({ estado }: { estado: Estado }) {
  const steps = [
    { key: "sin_documentos", label: "1. Sube tus documentos" },
    { key: "en_revision", label: "2. Revisión del administrador" },
    { key: "aprobado", label: "3. Aprobado" },
  ] as const;
  const current =
    estado === "sin_documentos" ? 0 : estado === "en_revision" ? 1 : 2;
  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {steps.map((s, i) => (
        <li
          key={s.key}
          className={`rounded-xl border p-4 shadow-sm ${
            i === current
              ? "border-[#BC5F36] bg-[#fff4e7]"
              : "border-[#eadacb] bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                i < current
                  ? "bg-[#BC5F36] text-white"
                  : i === current
                  ? "bg-[#BC5F36]/15 text-[#BC5F36]"
                  : "bg-[#f5ebe1] text-[#7a5c49]"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </span>
            <p className="text-sm font-extrabold text-[#2b1b12]">{s.label}</p>
          </div>
        </li>
      ))}
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
          className="rounded-xl border border-[#eadacb] bg-[#fff4e7] p-4 shadow-sm"
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

function PanelEstado({
  icon,
  title,
  desc,
  tone = "info",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone?: "info" | "danger";
}) {
  const t =
    tone === "danger"
      ? { border: "#f2d6d6", bg: "#fff5f5", iconBg: "#b42318" }
      : { border: "#eadacb", bg: "#fff4e7", iconBg: "#BC5F36" };

  return (
    <section
      className="rounded-2xl p-5 shadow-sm"
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
        </div>
      </div>
    </section>
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
    <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-[#2b1b12]">
        Sube tus documentos
      </h3>
      <p className="mt-1 text-sm text-[#7a5c49]">
        Adjunta los archivos requeridos. Puedes arrastrar y soltar o seleccionar
        desde tu dispositivo.
      </p>

      <div className="mt-5 grid gap-3">
        {["identificación", "comprobante", "carta"].map((req) => (
          <div
            key={req}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-3"
          >
            <p className="text-sm font-extrabold text-[#2b1b12] capitalize">
              {req}
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              id={`file-${req}`}
              className="hidden"
              onChange={(e) => onPick(req, e.target.files?.[0] || undefined)}
            />
            <Button
              variant="ghost"
              onClick={() => document.getElementById(`file-${req}`)?.click()}
            >
              <FileUp className="h-4 w-4 mr-1" /> Subir
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button disabled={deshabilitarEnviar} onClick={onEnviar}>
          <FileCheck2 className="h-5 w-5 mr-1" /> Enviar para revisión
        </Button>
      </div>
    </section>
  );
}
