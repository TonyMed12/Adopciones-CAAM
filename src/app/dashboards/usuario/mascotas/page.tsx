"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PageHead from "@/components/layout/PageHead";
import Filters from "@/components/masc/Filters";
import MascotaCard from "@/components/masc/MascotaCard";
import MascotaCardUsuario from "@/components/masc/MascotaCardUsuario";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";

import { listarMascotas } from "@/mascotas/mascotas-actions";
import { ESPECIES } from "@/data/masc/constants";
import type { Mascota } from "@/data/masc/types";

type DocEstado = "aprobado" | "en_revision" | "rechazado" | "sin_documentos";

export default function MascotasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const especieQS = searchParams.get("especie");
  const supabase = createClient();

  const [items, setItems] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState<string>(() => {
    const val = (especieQS || "").trim();
    if (
      val &&
      (val === "Todas" || (ESPECIES as readonly string[]).includes(val))
    )
      return val;
    return "Todas";
  });
  const [sexo, setSexo] = useState<string>("Todos");

  // Estado de documentos del usuario
  const [docEstado, setDocEstado] = useState<DocEstado>("sin_documentos");

  // Estados de modales
  const [gateOpen, setGateOpen] = useState(false);
  const [selected, setSelected] = useState<Mascota | null>(null);

  // Modal de información
  const [openCard, setOpenCard] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [adopcionEnProgreso, setAdopcionEnProgreso] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // --------------------------------------------------------
  // 📑 Obtener estado de documentos del usuario
  // --------------------------------------------------------
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

      if (error) {
        console.error("Error al obtener estado de documentos:", error);
        return;
      }

      if (!docs || docs.length === 0) {
        setDocEstado("sin_documentos");
        return;
      }

      const estados = docs.map((d) => d.status);
      if (estados.every((s) => s === "aprobado")) setDocEstado("aprobado");
      else if (estados.some((s) => s === "rechazado"))
        setDocEstado("rechazado");
      else setDocEstado("en_revision");
    }

    fetchEstado();
  }, []);

  // --------------------------------------------------------
  // 🐶 Obtener mascotas disponibles
  // --------------------------------------------------------
  useEffect(() => {
    async function fetchMascotas() {
      try {
        setLoading(true);
        const data = await listarMascotas();

        if (!data || data.length === 0) {
          setItems([]);
          return;
        }

        const disponibles = data.filter(
          (m: any) =>
            m.disponible_adopcion === true ||
            m.estado === "disponible" ||
            m.activo === true
        );

        const formateadas = disponibles.map((m: any) => {
          const totalMeses = Number(m.edad ?? 0);
          const años = Math.floor(totalMeses / 12);
          const meses = totalMeses % 12;
          const edadFormateada =
            años > 0
              ? `${años} año${años > 1 ? "s" : ""}${
                  meses > 0 ? ` y ${meses} mes${meses > 1 ? "es" : ""}` : ""
                }`
              : `${meses} mes${meses !== 1 ? "es" : ""}`;

          const especie = m.raza?.especie || m.especie || "Desconocido";
          const raza = m.raza?.nombre || "Mestizo";

          return {
            ...m,
            edadMeses: edadFormateada,
            especie,
            raza,
            descripcion: m.personalidad || m.descripcion_fisica || "",
            foto: m.imagen_url,
          } as Mascota;
        });

        setItems(formateadas);
      } catch (err) {
        console.error("Error al listar mascotas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMascotas();
  }, []);

  // ----------------------------------------------------
  // 🐕 Adopción
  // ----------------------------------------------------
  async function handleAdopt(m: Mascota) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Debes iniciar sesión para adoptar una mascota.");
      return;
    }

    // 📄 Si no tiene documentos aprobados
    if (docEstado !== "aprobado") {
      setSelected(m);
      setGateOpen(true);
      return;
    }

    try {
      // 🔍 Verificar si ya existe una solicitud activa para esta mascota
      const { data: existente, error: checkError } = await supabase
        .from("solicitudes_adopcion")
        .select("id, estado")
        .eq("usuario_id", user.id)
        .eq("mascota_id", m.id)
        .in("estado", ["pendiente", "aprobada"]);

      if (checkError) {
        console.error("Error verificando solicitudes existentes:", checkError);
        mostrarToast(
          "⚠️ Error al verificar tus solicitudes activas. Intenta nuevamente.",
          "#fff4e7",
          "#7a3e00",
          "#f4caa6"
        );
        return;
      }

      if (existente && existente.length > 0) {
        mostrarToast(
          "🐾 Ya tienes una solicitud activa para esta mascota.",
          "#f3fff3",
          "#225b22",
          "#c9e9c9"
        );
        return;
      }

      const { data: solicitudesActivas, error: solicitudError } = await supabase
        .from("solicitudes_adopcion")
        .select("id, mascota_id, estado")
        .eq("usuario_id", user.id)
        .in("estado", ["pendiente", "en_proceso", "aprobada"]);

      if (solicitudError) {
        console.error("Error verificando solicitudes activas:", solicitudError);
        console.error(
          "Detalles del error:",
          JSON.stringify(solicitudError, null, 2)
        );
        mostrarToast(
          `⚠️ Error al verificar solicitudes activas. ${
            solicitudError.message ||
            "Revisa tu conexión o revisa el tipo de estado en la base de datos."
          }`,
          "#fff4e7",
          "#7a3e00",
          "#f4caa6"
        );
        return;
      }

      if (solicitudesActivas && solicitudesActivas.length > 0) {
        mostrarToast(
          "🐾 Ya tienes una solicitud activa. Termina tu proceso o tu cita pendiente antes de adoptar otra mascota.",
          "#f3fff3",
          "#225b22",
          "#c9e9c9"
        );
        return;
      }

      // 🧾 Crear nueva solicitud
      const numero = "SOL-" + Math.floor(100000 + Math.random() * 900000);
      const { data: solicitud, error: insertError } = await supabase
        .from("solicitudes_adopcion")
        .insert([
          {
            numero_solicitud: numero,
            usuario_id: user.id,
            mascota_id: m.id,
            motivo_adopcion: "Pendiente de llenar",
            estado: "pendiente",
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error insertando solicitud:", insertError);
        mostrarToast(
          "❌ Error al registrar tu solicitud de adopción.",
          "#fff4e7",
          "#7a3e00",
          "#f4caa6"
        );
        return;
      }

      // 🐾 Actualizar estado de la mascota
      const { error: updateError } = await supabase
        .from("mascotas")
        .update({
          estado: "en_proceso",
          disponible_adopcion: false,
        })
        .eq("id", m.id);

      if (updateError) {
        console.error("Error actualizando mascota:", updateError);
        mostrarToast(
          "⚠️ La solicitud fue creada, pero hubo un problema actualizando la mascota.",
          "#fff4e7",
          "#7a3e00",
          "#f4caa6"
        );
        return;
      }

      // 🎉 Éxito total → animación y redirección
      setAdopcionEnProgreso(true);
      setMensajeExito(
        `Tu solicitud para adoptar a ${m.nombre} ha sido registrada 🐾`
      );

      setTimeout(() => {
        setMensajeExito("Redirigiéndote al siguiente paso...");
      }, 1800);

      setTimeout(() => {
        router.push(
          `/dashboards/usuario/adopcion?paso=2&nombre=${encodeURIComponent(
            m.nombre
          )}`
        );
      }, 3000);
    } catch (err) {
      console.error("Error general al registrar adopción:", err);
      mostrarToast(
        "❌ Ocurrió un error al procesar tu solicitud. Intenta nuevamente.",
        "#fff4e7",
        "#7a3e00",
        "#f4caa6"
      );
    }
  }

  // ----------------------------------------------------
  // 🌈 Helper para mostrar mensajes visuales tipo Toast
  // ----------------------------------------------------
  function mostrarToast(
    mensaje: string,
    bgColor = "#fff",
    textColor = "#333",
    borderColor = "#ccc"
  ) {
    const toast = document.createElement("div");
    toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: ${textColor};
      border: 1px solid ${borderColor};
      border-radius: 10px;
      padding: 16px 22px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 14px;
      max-width: 320px;
      z-index: 9999;
    ">
      ${mensaje}
    </div>
  `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // --------------------------------------------------------
  // 🎨 Texto del estado de documentos
  // --------------------------------------------------------
  const estadoText: Record<
    DocEstado,
    { title: string; desc: string; tone: "info" | "warn" | "ok" | "error" }
  > = {
    sin_documentos: {
      title:
        "Necesitas validar tus documentos para poder solicitar una adopción",
      desc: "Sube identificación, domicilio y carta compromiso.",
      tone: "warn",
    },
    en_revision: {
      title: "Documentos en revisión",
      desc: "Un administrador está revisando tus archivos.",
      tone: "info",
    },
    rechazado: {
      title: "Documentos con observaciones",
      desc: "Corrige lo indicado y vuelve a enviar.",
      tone: "error",
    },
    aprobado: {
      title: "Validación completa",
      desc: "Ya puedes iniciar el proceso de adopción.",
      tone: "ok",
    },
  };

  const toneClasses = {
    info: "border-[#eadacb] bg-[#fff4e7]",
    warn: "border-[#eadacb] bg-[#fff4e7]",
    ok: "border-[#dbead3] bg-[#f3fff3]",
    error: "border-[#f2d6d6] bg-[#fff5f5]",
  } as const;

  // --------------------------------------------------------
  // 🔍 Filtrar las mascotas visibles
  // --------------------------------------------------------
  const data = useMemo(() => {
    return items.filter((m) => {
      const matchesQ = [m.nombre, m.raza, m.descripcion, m.especie].some((v) =>
        v?.toLowerCase().includes(q.toLowerCase())
      );

      const matchesEsp = especie === "Todas" || m.especie === especie;
      const matchesSexo =
        sexo === "Todos" || m.sexo?.toLowerCase() === sexo.toLowerCase();

      return matchesQ && matchesEsp && matchesSexo;
    });
  }, [items, q, especie, sexo]);

  // --------------------------------------------------------
  // Modal

  {
    adopcionEnProgreso && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm mx-auto animate-fade-in">
          <div className="animate-bounce text-4xl mb-3">🐶</div>
          <h2 className="text-lg font-extrabold text-[#2b1b12] mb-2">
            {mensajeExito}
          </h2>
          <p className="text-sm text-[#7a5c49]">
            Espera un momento mientras preparamos el siguiente paso...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-4 border-[#BC5F36] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // 💅 Render principal
  // --------------------------------------------------------

  return (
    <>
      <PageHead
        title="Mascotas"
        subtitle="Encuentra a tu nuevo mejor amigo 🐾"
      />

      {/* Banner de estado */}
      <div
        className={`mb-4 rounded-xl border px-4 py-3 ${
          toneClasses[estadoText[docEstado].tone]
        } text-sm`}
      >
        <p className="font-extrabold text-[#2b1b12]">
          {estadoText[docEstado].title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[#7a5c49]">
          <span>{estadoText[docEstado].desc}</span>
          {docEstado !== "aprobado" && (
            <Button
              className="px-3 py-2"
              onClick={() => router.push("/dashboards/usuario/adopcion")}
            >
              Completar verificación
            </Button>
          )}
        </div>
      </div>

      <Filters
        q={q}
        onQ={setQ}
        especie={especie}
        onEspecie={setEspecie}
        sexo={sexo}
        onSexo={setSexo}
        ESPECIES={ESPECIES}
      />

      {/* Filtrado de mascotas */}
      {loading ? (
        <div className="py-10 text-center text-[#7a5c49]">
          Cargando mascotas...
        </div>
      ) : (
        <section className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {data.map((m) => (
            <MascotaCard
              key={m.id}
              m={m}
              onView={() => {
                setSelectedMascota(m);
                setOpenCard(true);
              }}
              onAdopt={() => handleAdopt(m)}
            />
          ))}
          {data.length === 0 && (
            <div className="col-span-full py-10 text-center text-[#7a5c49]">
              No hay resultados con esos filtros
            </div>
          )}
        </section>
      )}

      {/* Modal bloqueo adopción */}
      <Modal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Antes de adoptar"
      >
        <div className="p-4 text-[#2b1b12]">
          <p className="text-sm">
            Para adoptar a{" "}
            <span className="font-extrabold">{selected?.nombre}</span> primero
            necesitamos validar tus documentos:
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
            <li>• Identificación oficial (INE / Pasaporte)</li>
            <li>• Comprobante de domicilio (≤ 3 meses)</li>
            <li>• Carta compromiso firmada</li>
          </ul>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setGateOpen(false)}>
              Luego
            </Button>
            <Button
              onClick={() => {
                setGateOpen(false);
                router.push(
                  `/dashboards/usuario/adopcion?from=${selected?.id ?? ""}`
                );
              }}
            >
              Completar verificación
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal info mascota */}
      <MascotaCardUsuario
        m={selectedMascota}
        open={openCard}
        onClose={() => setOpenCard(false)}
        onAdopt={() => selectedMascota && handleAdopt(selectedMascota)}
      />
    </>
  );
}
