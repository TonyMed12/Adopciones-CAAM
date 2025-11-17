"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";


export default function MascotaPublicAdoptButton({
  mascota,
}: {
  mascota: any;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [docEstado, setDocEstado] = useState<
    "aprobado" | "en_revision" | "rechazado" | "sin_documentos"
  >("sin_documentos");
  const [loading, setLoading] = useState(false);

  // Obtener sesión
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSession(data.user);
    });
  }, []);

  // Obtener estado docs
  useEffect(() => {
    async function fetchDocs() {
      if (!session) return;

      const { data: docs, error } = await supabase
        .from("documentos")
        .select("status")
        .eq("perfil_id", session.id);

      if (error) return;

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

    fetchDocs();
  }, [session]);

  // Toast visual (copiado de tu página)
  function mostrarToast(mensaje: string) {
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ccc;
        padding: 14px 18px;
        border-radius: 10px;
        font-size: 14px;
        color: #333;
        z-index: 99999;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      ">
        ${mensaje}
      </div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  const handleAdopt = async () => {
    // 1️⃣ Sesión
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return router.push("/auth/login");

    const user = userData.user;

    // 2️⃣ Documentos
    if (docEstado !== "aprobado") {
      router.push(`/dashboards/usuario/adopcion?from=${mascota.id}`);
      return;
    }

    // 3️⃣ Solicitud activa
    const { data: solicitudesActivas } = await supabase
      .from("solicitudes_adopcion")
      .select("id, estado")
      .eq("usuario_id", user.id)
      .in("estado", ["pendiente", "en_proceso"])
      .limit(1);

    if (solicitudesActivas && solicitudesActivas.length > 0) {
      mostrarToast("Ya tienes una adopción en curso.");
      router.push("/dashboards/usuario/adopcion");
      return;
    }

    // 4️⃣ Cita activa
    const { data: citasActivas } = await supabase
      .from("citas_adopcion")
      .select("id, estado")
      .eq("usuario_id", user.id)
      .in("estado", ["programada"])
      .limit(1);

    if (citasActivas && citasActivas.length > 0) {
      mostrarToast("Ya tienes una cita programada.");
      return;
    }

    // 5️⃣ Crear solicitud
    try {
      setLoading(true);

      const numero = "SOL-" + Math.floor(100000 + Math.random() * 900000);

      const [insSolicitud, updMascota] = await Promise.all([
        supabase.from("solicitudes_adopcion").insert([
          {
            numero_solicitud: numero,
            usuario_id: user.id,
            mascota_id: mascota.id,
            motivo_adopcion: "Pendiente de llenar",
            estado: "pendiente",
          },
        ]),
        supabase
          .from("mascotas")
          .update({
            estado: "en_proceso",
            disponible_adopcion: false,
          })
          .eq("id", mascota.id),
      ]);

      router.push(
        `/dashboards/usuario/adopcion?paso=2&from=${
          mascota.id
        }&nombre=${encodeURIComponent(mascota.nombre)}`
      );
    } catch (err) {
      mostrarToast("Ocurrió un error. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <Button
        onClick={handleAdopt}
        disabled={loading}
        className="bg-[#FF8414] hover:bg-[#d86f0f] text-white px-6 py-3 rounded-xl text-lg font-bold shadow"
      >
        {loading ? "Procesando..." : `Adoptar a ${mascota.nombre}`}
      </Button>
    </div>
  );
}
