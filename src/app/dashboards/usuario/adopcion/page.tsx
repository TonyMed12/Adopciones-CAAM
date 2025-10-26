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
import { createClient } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

type Estado = "sin_documentos" | "en_revision" | "aprobado" | "rechazado";

export default function ProcesoAdopcionPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const from = qs.get("from");

  const [estado, setEstado] = useState<Estado>("sin_documentos");
  const [docs, setDocs] = useState<
    {
      id: string;
      tipo: string;
      estado: string;
      motivo_rechazo?: string;
      url?: string;
    }[]
  >([]);

  const [mostrarAgendar, setMostrarAgendar] = useState(false);

  // --------------------------------------------------------
  // 🔍 Obtener estado actual de documentos del usuario
  // --------------------------------------------------------
  useEffect(() => {
    async function fetchEstado() {
      const supabase = createClient();

      // 1️⃣ Usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return console.error("No hay sesión activa");

      const perfilId = user.id; // coincide con perfiles.id

      // 2️⃣ Consultar documentos reales
      const { data: docs, error } = await supabase
        .from("documentos")
        .select("id, tipo, status, observacion_admin, url")
        .eq("perfil_id", perfilId);

      if (error) {
        console.error("Error obteniendo documentos:", error);
        return;
      }

      // 3️⃣ Si no hay documentos
      if (!docs?.length) {
        setEstado("sin_documentos");
        return;
      }

      // 4️⃣ Determinar estado general
      const estados = docs.map((d) => d.status);
      if (estados.every((s) => s === "aprobado")) setEstado("aprobado");
      else if (estados.some((s) => s === "rechazado")) setEstado("rechazado");
      else setEstado("en_revision");

      // 5️⃣ Guardar documentos para mostrar en UI
      setDocs(
        docs.map((d) => ({
          id: d.id,
          tipo: d.tipo,
          estado: d.status,
          motivo_rechazo: d.observacion_admin,
          url: d.url,
        }))
      );
    }

    fetchEstado();
  }, []);

  // --------------------------------------------------------
  // 📂 Estado de archivos cargados
  // --------------------------------------------------------
  const [archivos, setArchivos] = useState<Record<string, File | null>>({
    identificacion: null,
    comprobante: null,
    curp: null,
  });

  const completos = useMemo(
    () => Object.values(archivos).every((f) => !!f),
    [archivos]
  );

  // --------------------------------------------------------
  // ⬆️ Subir documento individual
  // --------------------------------------------------------
  async function uploadDocumento(file: File, tipo: string) {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("No hay sesión activa");

    console.log("📦 Usuario:", user.id, " Subiendo tipo:", tipo);

    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${user.id}/${tipo}-${Date.now()}-${safe}`;

    // 1️⃣ Subir archivo al bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documentos_adopcion")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Error al subir al bucket:", uploadError);
      throw uploadError;
    }

    console.log("✅ Archivo subido al bucket:", uploadData?.path);

    // 2️⃣ Obtener URL pública correcta (usamos el mismo path que subimos)
    const { data: publicUrlData } = await supabase.storage
      .from("documentos_adopcion")
      .getPublicUrl(path);

    const publicUrl =
      publicUrlData?.publicUrl ||
      `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/documentos_adopcion/${path}`;

    console.log("🌐 URL pública obtenida:", publicUrl);

    // 3️⃣ Guardar la URL pública en BD
    const { error: dbError } = await supabase.from("documentos").upsert(
      {
        perfil_id: user.id,
        tipo,
        url: publicUrl,
        status: "pendiente",
        created_at: new Date().toISOString(),
      },
      { onConflict: "perfil_id,tipo" }
    );

    if (dbError) {
      console.error("❌ Error insertando en documentos:", dbError);
      throw dbError;
    }

    console.log("🗃️ Documento guardado correctamente en base de datos.");
  }

  // --------------------------------------------------------
  // 📨 Enviar documentos
  // --------------------------------------------------------
  async function enviar() {
    try {
      // Filtra los archivos que no sean null
      const tipos = Object.keys(archivos) as Array<keyof typeof archivos>;
      for (const tipo of tipos) {
        const file = archivos[tipo];
        if (!file) continue; // 👈 salta si no hay archivo seleccionado
        await uploadDocumento(file, tipo);
      }

      setEstado("en_revision");
      console.log("✅ Documentos reenviados correctamente.");
    } catch (err) {
      console.error("Error subiendo documentos:", err);
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
            ? "¡Listo! Ya puedes agendar tu cita para conocer a una mascota."
            : "Sube tus documentos para que un administrador los valide antes de continuar."
        }
      />

      {estado !== "aprobado" ? (
        <Stepper estado={estado} />
      ) : (
        <StepperAdopcion />
      )}
      {estado === "rechazado" && (
        <PanelEstado
          tone="danger"
          icon={<XCircle className="h-6 w-6" />}
          title="Documentos rechazados"
          desc="Por favor corrige lo indicado y vuelve a enviarlos."
        />
      )}
      {/* -------- Bloques por estado -------- */}
      {(estado === "sin_documentos" || estado === "rechazado") && (
        <SeccionCarga
          archivos={archivos}
          docs={docs}
          onPick={(id, file) =>
            setArchivos({ ...archivos, [id]: file ?? null })
          }
          onEnviar={enviar}
          deshabilitarEnviar={
            estado === "sin_documentos"
              ? !completos
              : docs
                  .filter((d) => d.estado === "rechazado")
                  .some((d) => !archivos[d.tipo])
          }
        />
      )}

      {estado === "en_revision" && (
        <section className="rounded-2xl border border-[#eadacb] bg-[#fff9f3] p-10 text-center shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#BC5F36]/10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-[#BC5F36]/10"
              >
                <Clock className="h-10 w-10 text-[#BC5F36]" />
              </motion.div>{" "}
            </div>
            <h2 className="text-xl font-extrabold text-[#2b1b12]">
              Tus documentos están en revisión
            </h2>
            <p className="max-w-md text-sm text-[#7a5c49] leading-relaxed">
              Un administrador revisará que todo esté correcto. <br />
              Te avisaremos por correo o al iniciar sesión cuando hayan sido
              aprobados.
            </p>
            <div className="mt-6">
              <div className="animate-pulse text-[#BC5F36] font-medium"></div>
            </div>
          </div>
        </section>
      )}

      {/* -------- Vista Aprobado -------- */}
      {estado === "aprobado" && (
        <>
          {!mostrarAgendar ? (
            <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm text-[#2b1b12]">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="text-sm font-extrabold text-green-800">
                    ¡Tus documentos fueron aprobados!
                  </h3>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  Todo está en orden. Ya puedes continuar con el proceso de
                  adopción: elige una mascota, agenda tu visita para conocerla y
                  continúa con tu proceso de adopción.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <StepCard
                  icon={<PawPrint className="h-5 w-5" />}
                  title="1) Ver mascotas"
                  desc="Elige la mascota que te gustaría conocer."
                  action={
                    <Link href="/dashboards/usuario/mascotas">
                      <Button className="w-full">Ir a ver mascotas</Button>
                    </Link>
                  }
                />
                <StepCard
                  icon={<CalendarCheck className="h-5 w-5" />}
                  title="2) Agendar visita"
                  desc="Programa una cita para convivir con la mascota."
                  action={
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setMostrarAgendar(true)}
                    >
                      Agendar cita
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
      {/* FAQs: solo visibles si aún no ha subido nada */}
      {estado === "sin_documentos" && (
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
      )}
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
        Aquí puedes revisar tus solicitudes activas o crear una nueva cita para
        conocer a una mascota antes de continuar con el proceso.
      </p>

      <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
        <p className="text-sm font-extrabold mb-2">Solicitudes activas</p>
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
  const steps = ["1. Ver mascotas", "2. Agendar visita", "3. Confirmación"];
  return (
    <ol className="grid gap-3 md:grid-cols-3">
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
  docs = [],
  onPick,
  onEnviar,
  deshabilitarEnviar,
}: {
  archivos: Record<string, File | null>;
  docs?: {
    tipo: string;
    estado: string;
    motivo_rechazo?: string;
    url?: string;
  }[];
  onPick: (id: string, file?: File) => void;
  onEnviar: () => void;
  deshabilitarEnviar: boolean;
}) {
  const documentos = [
    { id: "identificacion", label: "Identificación oficial (INE)" },
    { id: "comprobante", label: "Comprobante de domicilio" },
    { id: "curp", label: "CURP" },
  ];

  function getDocInfo(tipo: string) {
    return docs.find((d) => d.tipo === tipo);
  }

  return (
    <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-[#2b1b12]">
        Sube tus documentos
      </h3>
      <p className="mt-1 text-sm text-[#7a5c49]">
        Adjunta los archivos requeridos. Si algún documento fue rechazado,
        podrás volver a subir sólo ese.
      </p>

      <div className="mt-5 grid gap-3">
        {documentos.map((doc) => {
          const info = getDocInfo(doc.id);
          const estado = info?.estado;
          const motivo = info?.motivo_rechazo;
          const puedeSubir =
            !estado || estado === "rechazado" || estado === "sin_documentos";

          return (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-extrabold text-[#2b1b12]">
                  {doc.label}
                </p>
                {estado === "aprobado" && (
                  <p className="text-xs text-green-700 mt-1">
                    Documento Aprobado{" "}
                  </p>
                )}
                {estado === "pendiente" && (
                  <p className="text-xs text-amber-700 mt-1">
                    Documento En revisión
                  </p>
                )}
                {estado === "rechazado" && (
                  <p className="text-xs text-red-700 mt-1">
                    Documento Rechazado —{" "}
                    {motivo || "Verifica el motivo y subelo nuevamente."}
                  </p>
                )}
                {archivos[doc.id] && (
                  <p className="text-xs text-[#6b4f40] mt-1 truncate max-w-[240px]">
                    Nuevo archivo: {archivos[doc.id]?.name}
                  </p>
                )}
                {info?.url?.startsWith("http") ? (
                  <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#BC5F36] underline mt-1 hover:text-[#8c3f1e]"
                  >
                    Ver archivo actual
                  </a>
                ) : (
                  <p className="text-xs text-[#b09a8c] mt-1 italic">
                    Sin enlace válido
                  </p>
                )}
              </div>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                id={`file-${doc.id}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onPick(doc.id, file);
                }}
                disabled={!puedeSubir}
              />
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() =>
                  puedeSubir &&
                  document.getElementById(`file-${doc.id}`)?.click()
                }
                disabled={!puedeSubir}
              >
                <FileUp className="h-4 w-4 mr-1" />{" "}
                {puedeSubir
                  ? "Seleccionar archivo"
                  : "Éste documento fue aprobado, no es posible cambiarlo"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          disabled={deshabilitarEnviar}
          onClick={onEnviar}
          className="cursor-pointer"
        >
          <FileCheck2 className="h-5 w-5 mr-1 cursor-pointer" />{" "}
          {docs.some((d) => d.estado === "rechazado")
            ? "Reenviar rechazados"
            : "Enviar para revisión"}
        </Button>
      </div>
    </section>
  );
}
