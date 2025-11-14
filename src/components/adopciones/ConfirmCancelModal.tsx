"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

export default function ConfirmCancelModal({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modal = (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4 py-10 overflow-y-auto"
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#eadacb] animate-fadeIn">
                <h3 className="text-xl font-extrabold text-[#8b4513] text-center mb-3">
                    ¿Cancelar tu cita?
                </h3>

                <p className="text-sm text-[#7a5c49] text-center leading-relaxed">
                    Si cancelas tu cita podrás volver a agendar otra, siempre y cuando tu
                    solicitud siga activa.
                </p>

                <div className="flex justify-center gap-4 mt-8">
                    <Button
                        className="bg-[#fff5f3] border border-[#e8c9b8] text-[#BC5F36] hover:bg-[#ffe7e2] transition-all cursor-pointer"
                        onClick={onClose}
                    >
                        No, regresar
                    </Button>

                    <Button
                        className="bg-[#BC5F36] hover:bg-[#a64d2e] text-white transition-all cursor-pointer"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Sí, cancelar cita
                    </Button>
                </div>
            </div>
        </div>
    );

    // ⬅️ Aquí es donde lo sacamos “fuera” del componente
    return createPortal(modal, document.body);
}
