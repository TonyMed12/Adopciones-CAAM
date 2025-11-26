"use client";

import { ClipboardList, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHead from "@/components/layout/PageHead";

export function CitasVeterinariasUsuarioHeader({
  modo,
  setModo,
  bloqueado,
  setMensaje,
}: {
  modo: "lista" | "agendar";
  setModo: (m: "lista" | "agendar") => void;
  bloqueado: boolean;
  setMensaje: (msg: string | null) => void;
}) {
  return (
    <>
      <PageHead
        title="Citas Veterinarias"
        subtitle="Agenda nuevas citas y revisa el estado de las existentes."
      />

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 text-center sm:text-left">
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <Button
            variant={modo === "lista" ? "primary" : "ghost"}
            onClick={() => setModo("lista")}
          >
            <ClipboardList className="w-4 h-4 mr-2" /> Mis citas
          </Button>

          <Button
            variant={modo === "agendar" ? "primary" : "ghost"}
            onClick={() => {
              if (bloqueado) {
                setMensaje(
                  "Ya tienes una cita pendiente. Espera la confirmación del CAAM antes de agendar otra."
                );
                return;
              }
              setMensaje(null);
              setModo("agendar");
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Agendar nueva cita
          </Button>
        </div>
      </div>
    </>
  );
}
