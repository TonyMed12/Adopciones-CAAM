"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  User,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import PageHead from "@/components/layout/PageHead";
import { Button } from "@/components/ui/Button";

type Cita = {
  id: string;
  fecha: string;
  hora: string;
  usuario: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  mascota: {
    nombre: string;
    tipo: string;
    raza: string;
    edad: string;
  };
  estado: "pendiente" | "confirmada" | "completada";
};

export default function CitasPage() {
  const searchParams = useSearchParams();
  const mascotaId = searchParams.get("mascotaId");

  const [paso, setPaso] = useState<"formulario" | "confirmacion">("formulario");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [citasPendientes, setCitasPendientes] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos precargados del usuario
  const [datosUsuario] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+52 443 123 4567",
    direccion: "Av. Madero 123, Morelia, Michoacán",
  });

  // Datos precargados de la mascota
  const [datosMascota] = useState({
    nombre: "Luna",
    tipo: "Perro",
    raza: "Labrador",
    edad: "2 años",
  });

  const [nuevaCita, setNuevaCita] = useState<Cita | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  useEffect(() => {
    cargarCitasPendientes();
  }, []);

  useEffect(() => {
    if (paso === "confirmacion") {
      const timer = setTimeout(() => {
        setPaso("formulario");
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [paso]);

  async function cargarCitasPendientes() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Aquí cargarías las citas reales de la base de datos
      // Por ahora simulamos con datos de ejemplo
      const citasEjemplo: Cita[] = [];
      
      setCitasPendientes(citasEjemplo);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando citas:", error);
      setLoading(false);
    }
  }

  function confirmarCita() {
    if (!fechaSeleccionada || !horaSeleccionada) {
      alert("Por favor selecciona fecha y hora");
      return;
    }

    const cita: Cita = {
      id: `cita-${Date.now()}`,
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
      usuario: datosUsuario,
      mascota: datosMascota,
      estado: "pendiente",
    };

    setNuevaCita(cita);
    setCitasPendientes((prev) => [...prev, cita]);
    setPaso("confirmacion");
  }

  function nuevaCitaForm() {
    setPaso("formulario");
    setFechaSeleccionada("");
    setHoraSeleccionada("");
    setNuevaCita(null);
  }

  const horasDisponibles = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="space-y-8">
      <PageHead
        title="Módulo de citas"
        subtitle="Agenda tu visita para conocer a tu futuro compañero"
      />

      {/* Confirmación de cita */}
      {paso === "confirmacion" && nuevaCita && (
        <>
          <section className="rounded-2xl border border-[#dbead3] bg-[#f3fff3] p-6 shadow-[0_12px_30px_rgba(43,27,18,.08)]">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#2e7d32] text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-[#2b1b12]">
                  Cita confirmada
                </h3>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  Tu visita ha sido agendada exitosamente. Por favor llega 10
                  minutos antes de la hora programada.
                </p>
              </div>
            </div>
          </section>

          {/* Resumen de la cita */}
          <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-[0_12px_30px_rgba(43,27,18,.08)]">
            <h3 className="text-lg font-extrabold text-[#2b1b12]">
              Resumen de tu cita
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {/* Información de la cita */}
              <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
                  <h4 className="text-sm font-extrabold text-[#2b1b12]">
                    Fecha y hora
                  </h4>
                </div>
                <p className="mt-2 text-sm text-[#7a5c49]">
                  <strong>Fecha:</strong> {nuevaCita.fecha}
                </p>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  <strong>Hora:</strong> {nuevaCita.hora}
                </p>
              </div>

              {/* Información de la mascota */}
              <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
                <div className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-[#BC5F36]" />
                  <h4 className="text-sm font-extrabold text-[#2b1b12]">
                    Mascota
                  </h4>
                </div>
                <p className="mt-2 text-sm text-[#7a5c49]">
                  <strong>Nombre:</strong> {nuevaCita.mascota.nombre}
                </p>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  <strong>Tipo:</strong> {nuevaCita.mascota.tipo} -{" "}
                  {nuevaCita.mascota.raza}
                </p>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  <strong>Edad:</strong> {nuevaCita.mascota.edad}
                </p>
              </div>

              {/* Información del usuario */}
              <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#BC5F36]" />
                  <h4 className="text-sm font-extrabold text-[#2b1b12]">
                    Tus datos
                  </h4>
                </div>
                <p className="mt-2 text-sm text-[#7a5c49]">
                  <strong>Nombre:</strong> {nuevaCita.usuario.nombre}
                </p>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  <strong>Email:</strong> {nuevaCita.usuario.email}
                </p>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  <strong>Teléfono:</strong> {nuevaCita.usuario.telefono}
                </p>
              </div>

              {/* Ubicación */}
              <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#BC5F36]" />
                  <h4 className="text-sm font-extrabold text-[#2b1b12]">
                    Ubicación
                  </h4>
                </div>
                <p className="mt-2 text-sm text-[#7a5c49]">
                  CAAM - Centro de Adopción Animal de Morelia
                </p>
                <p className="mt-1 text-sm text-[#7a5c49]">
                  Av. Acueducto 1234, Morelia, Michoacán
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button className="px-6 py-3" onClick={nuevaCitaForm}>
                Agendar otra cita
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Formulario de nueva cita */}
      {paso === "formulario" && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-[0_12px_30px_rgba(43,27,18,.08)]">
          <h3 className="text-lg font-extrabold text-[#2b1b12]">
            Agendar nueva cita
          </h3>

          {/* Datos del usuario */}
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Tus datos
              </h4>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <CampoInfo icon={<User className="h-4 w-4" />} label="Nombre">
                {datosUsuario.nombre}
              </CampoInfo>
              <CampoInfo icon={<Mail className="h-4 w-4" />} label="Email">
                {datosUsuario.email}
              </CampoInfo>
              <CampoInfo icon={<Phone className="h-4 w-4" />} label="Teléfono">
                {datosUsuario.telefono}
              </CampoInfo>
              <CampoInfo icon={<MapPin className="h-4 w-4" />} label="Dirección">
                {datosUsuario.direccion}
              </CampoInfo>
            </div>
          </div>

          {/* Datos de la mascota */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Mascota a visitar
              </h4>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <CampoInfo icon={<PawPrint className="h-4 w-4" />} label="Nombre">
                {datosMascota.nombre}
              </CampoInfo>
              <CampoInfo
                icon={<PawPrint className="h-4 w-4" />}
                label="Tipo y raza"
              >
                {datosMascota.tipo} - {datosMascota.raza}
              </CampoInfo>
              <CampoInfo icon={<Clock className="h-4 w-4" />} label="Edad">
                {datosMascota.edad}
              </CampoInfo>
            </div>
          </div>

          {/* Selección de fecha */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Fecha de la cita
              </h4>
            </div>
            <div className="mt-3">
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-50 rounded-xl border border-[#eadacb] bg-[#fffaf4] px-4 py-3 text-sm text-[#2b1b12] focus:border-[#BC5F36] focus:outline-none focus:ring-2 focus:ring-[#BC5F36]/20"
              />
            </div>
          </div>

          {/* Selección de hora */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Hora de la cita
              </h4>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-8">
              {horasDisponibles.map((hora) => (
                <button
                  key={hora}
                  onClick={() => setHoraSeleccionada(hora)}
                  className={[
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
                    horaSeleccionada === hora
                      ? "border-[#BC5F36] bg-[#BC5F36] text-white"
                      : "border-[#eadacb] bg-[#fffaf4] text-[#2b1b12] hover:border-[#BC5F36]",
                  ].join(" ")}
                >
                  {hora}
                </button>
              ))}
            </div>
          </div>

          {/* Botón confirmar */}
          <div className="mt-8 flex justify-center">
            <Button
              className="px-8 py-3"
              disabled={!fechaSeleccionada || !horaSeleccionada}
              onClick={confirmarCita}
            >
              <CalendarCheck className="h-5 w-5" />
              Confirmar cita
            </Button>
          </div>
        </section>
      )}

      {/* Citas pendientes */}
      {citasPendientes.length > 0 && (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-6 shadow-[0_12px_30px_rgba(43,27,18,.08)]">
          <h3 className="text-lg font-extrabold text-[#2b1b12]">
            Tus citas pendientes
          </h3>
          <div className="mt-4 grid gap-3">
            {citasPendientes.map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                onClick={() => setCitaSeleccionada(cita)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal de detalle de cita */}
      {citaSeleccionada && (
        <ModalDetalleCita
          cita={citaSeleccionada}
          onClose={() => setCitaSeleccionada(null)}
        />
      )}
    </div>
  );
}

/* ------------------ Componentes UI ------------------ */

function CampoInfo({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-3">
      <div className="flex items-center gap-2 text-[#7a5c49]">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-1 text-sm font-extrabold text-[#2b1b12]">{children}</p>
    </div>
  );
}

function CitaCard({ cita, onClick }: { cita: Cita; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4 text-left transition-all hover:border-[#BC5F36] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <PawPrint className="h-4 w-4 text-[#BC5F36]" />
            <h4 className="text-sm font-extrabold text-[#2b1b12]">
              Visita a {cita.mascota.nombre}
            </h4>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#7a5c49]">
            <span className="flex items-center gap-1">
              <CalendarCheck className="h-3 w-3" />
              {cita.fecha}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {cita.hora}
            </span>
          </div>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-semibold",
            cita.estado === "pendiente"
              ? "bg-[#fff4e7] text-[#BC5F36]"
              : "bg-[#f3fff3] text-[#2e7d32]",
          ].join(" ")}
        >
          {cita.estado === "pendiente" ? "Pendiente" : "Confirmada"}
        </span>
      </div>
    </button>
  );
}

function ModalDetalleCita({
  cita,
  onClose,
}: {
  cita: Cita;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eadacb] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-extrabold text-[#2b1b12]">
            Detalle de la cita
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7a5c49] hover:bg-[#f5ebe1]"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* Información de la cita */}
          <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Fecha y hora
              </h4>
            </div>
            <p className="mt-2 text-sm text-[#7a5c49]">
              <strong>Fecha:</strong> {cita.fecha}
            </p>
            <p className="mt-1 text-sm text-[#7a5c49]">
              <strong>Hora:</strong> {cita.hora}
            </p>
            <p className="mt-2 text-xs text-[#BC5F36]">
              Estado: {cita.estado === "pendiente" ? "Pendiente" : "Confirmada"}
            </p>
          </div>

          {/* Información de la mascota */}
          <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">Mascota</h4>
            </div>
            <p className="mt-2 text-sm text-[#7a5c49]">
              <strong>Nombre:</strong> {cita.mascota.nombre}
            </p>
            <p className="mt-1 text-sm text-[#7a5c49]">
              <strong>Tipo:</strong> {cita.mascota.tipo} - {cita.mascota.raza}
            </p>
            <p className="mt-1 text-sm text-[#7a5c49]">
              <strong>Edad:</strong> {cita.mascota.edad}
            </p>
          </div>

          {/* Información del usuario */}
          <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Tus datos
              </h4>
            </div>
            <p className="mt-2 text-sm text-[#7a5c49]">
              <strong>Nombre:</strong> {cita.usuario.nombre}
            </p>
            <p className="mt-1 text-sm text-[#7a5c49]">
              <strong>Email:</strong> {cita.usuario.email}
            </p>
            <p className="mt-1 text-sm text-[#7a5c49]">
              <strong>Teléfono:</strong> {cita.usuario.telefono}
            </p>
          </div>

          {/* Ubicación */}
          <div className="rounded-xl border border-[#f0e6dc] bg-[#fffaf4] p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#BC5F36]" />
              <h4 className="text-sm font-extrabold text-[#2b1b12]">
                Ubicación
              </h4>
            </div>
            <p className="mt-2 text-sm text-[#7a5c49]">
              CAAM - Centro de Adopción Animal de Morelia
            </p>
            <p className="mt-1 text-sm text-[#7a5c49]">
              Av. Acueducto 1234, Morelia, Michoacán
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button className="px-6 py-3" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}