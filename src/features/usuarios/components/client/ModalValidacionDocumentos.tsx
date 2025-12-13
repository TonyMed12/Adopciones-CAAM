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
        <Modal open={open} onClose={onClose} title="Antes de adoptar">
            <div className="p-4 text-[#2b1b12]">
                <p className="text-sm">
                    Para adoptar a{" "}
                    <span className="font-extrabold">{mascota?.nombre}</span> primero
                    necesitamos validar tus documentos:
                </p>

                <ul className="mt-3 grid gap-2 text-sm text-[#7a5c49]">
                    <li>• Identificación oficial (INE / Pasaporte)</li>
                    <li>• Comprobante de domicilio (≤ 3 meses)</li>
                    <li>• Carta compromiso firmada</li>
                </ul>

                <div className="mt-5 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>
                        Luego
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            router.push(
                                `/dashboards/usuario/adopcion?from=${mascota?.id ?? ""}`
                            );
                        }}
                    >
                        Completar verificación
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
