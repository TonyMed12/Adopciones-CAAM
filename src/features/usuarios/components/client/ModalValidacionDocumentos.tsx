"use client";

import type { Mascota } from "@/features/mascotas/types/mascotas";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

type Props = {
    open: boolean;
    mascota: Mascota | null;
    onClose: () => void;
};

export default function ModalValidacionDocumentos({
    open,
    mascota,
    onClose,
}: Props) {
    const router = useRouter();

    return (
        <Modal open={open} onClose={onClose}>
            <div className="
  p-8 space-y-7 text-[#2b1b12]
  bg-gradient-to-br from-[#fffdfb] via-[#fff6ee] to-[#fdf0e6]
  rounded-2xl
">                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3">
                    {/* Foto mascota */}
                    <div className="
  relative w-28 h-28 rounded-full overflow-hidden
  shadow-lg
  border border-[#e8d3c1]
  bg-white
">

                        {mascota?.imagen_url ? (
                            <img
                                src={mascota.imagen_url}
                                alt={mascota.nombre}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                🐶
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-extrabold tracking-tight">
                        Antes de adoptar
                    </h2>

                    <p className="text-sm text-[#7a5c49]">
                        Para continuar con la adopción de
                    </p>

                    <p className="text-lg font-bold text-[#BC5F36]">
                        {mascota?.nombre}
                    </p>
                </div>

                {/* Card documentos */}
                <div className="
  rounded-2xl
  border border-[#ecd6c5]
  bg-white/70
  backdrop-blur-sm
  p-5 space-y-4
  shadow-sm
">                    <p className="text-sm font-semibold text-[#5a3f2d]">
                        Necesitamos validar los siguientes documentos:
                    </p>

                    <ul className="space-y-3 text-sm text-[#6b4c3a]">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#BC5F36]" />
                            Identificación oficial (INE o Pasaporte)
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#BC5F36]" />
                            Comprobante de domicilio (máx. 3 meses)
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#BC5F36]" />
                            Carta compromiso firmada
                        </li>
                    </ul>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        variant="ghost"
                        className="
              w-full sm:w-auto
              cursor-pointer
              hover:bg-[#f3e6db]
              transition-colors
            "
                        onClick={onClose}
                    >
                        Lo haré después
                    </Button>

                    <Button
                        className="
              w-full sm:w-auto
              cursor-pointer
              bg-[#BC5F36]
              hover:bg-[#a24f2d]
              shadow-md
              hover:shadow-lg
              transition-all
            "
                        onClick={() => {
                            onClose();
                            router.push(
                                `/dashboards/usuario/adopcion?from=${mascota?.id ?? ""}`
                            );
                        }}
                    >
                        Subir documentos
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
