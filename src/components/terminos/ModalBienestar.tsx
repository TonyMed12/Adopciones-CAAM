"use client";

import ModalPremium from "@/components/ui/ModalPremium";
import { Playfair_Display, Poppins } from "next/font/google";
import { HeartHandshake, Utensils, ShieldCheck } from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function ModalBienestar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalPremium open={open} onClose={onClose}>
      
      {/* HEADER */}
      <div className="rounded-2xl p-6 shadow-md border border-[#E3D3C3] bg-gradient-to-br from-[#F7EFE7] to-[#EFE3D7] mb-6">
        <h2 className={`${playfair.className} text-3xl font-bold text-[#4A2F1B]`}>
          Compromiso de Bienestar
        </h2>
        <p className={`${poppins.className} text-sm text-[#7A5C49] mt-2`}>
          Lo que significa mantener el bienestar integral de la mascota adoptada.
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="space-y-5">

        <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Utensils className="h-5 w-5 text-[#8B5E34]" />
            <h3 className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}>
              Alimentación adecuada
            </h3>
          </div>
          <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
            Te comprometes a proporcionar alimentos de calidad y en cantidades adecuadas según la especie,
            peso y necesidades de la mascota.
          </p>
        </div>

        <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-5 w-5 text-[#8B5E34]" />
            <h3 className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}>
              Atención veterinaria
            </h3>
          </div>
          <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
            Asegurar revisiones veterinarias, vacunación, desparasitación y atención inmediata en caso
            de enfermedad o accidente.
          </p>
        </div>

        <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#E8DCCB] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <HeartHandshake className="h-5 w-5 text-[#8B5E34]" />
            <h3 className={`${playfair.className} text-xl font-semibold text-[#5A3D22]`}>
              Protección y no abandono
            </h3>
          </div>
          <p className={`${poppins.className} text-[#4A392E] leading-relaxed`}>
            Te comprometes a brindar un hogar seguro, evitar el abandono y garantizar que la mascota
            esté protegida contra maltrato o negligencia.
          </p>
        </div>

        <p className={`${poppins.className} text-[15px] text-[#4A392E] font-medium pt-2`}>
          Al aceptar, confirmas tu compromiso con el bienestar físico y emocional de la mascota.
        </p>
      </div>

      {/* BOTÓN FINAL */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-[#8B5E34] hover:bg-[#734C29] transition text-white font-medium shadow-md"
        >
          Cerrar
        </button>
      </div>
    </ModalPremium>
  );
}
