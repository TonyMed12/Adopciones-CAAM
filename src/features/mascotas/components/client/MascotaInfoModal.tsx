"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";

import type { Mascota } from "@/features/mascotas/types/mascotas";
import MascotaCardUsuario from "@/features/mascotas/components/client/MascotaCardUsuario";

type Props = {
    open: boolean;
    mascota: Mascota | null;
    onClose: () => void;
    onAdopt: (m: Mascota) => void;
};

export default function MascotaInfoModal({
    open,
    mascota,
    onClose,
    onAdopt,
}: Props) {
    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (!open) return;

        const body = document.body;
        const html = document.documentElement;

        const scrollY = window.scrollY;
        body.dataset.scrollY = String(scrollY);

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overscrollBehavior = "none";

        return () => {
            const prevY = Number(body.dataset.scrollY || 0);

            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.overflow = "";
            delete body.dataset.scrollY;

            html.style.overscrollBehavior = "";

            if (!Number.isNaN(prevY)) window.scrollTo(0, prevY);
        };
    }, [open]);

    if (!open) return null;
    if (typeof window === "undefined") return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-[#BC5F36] transition"
                    aria-label="Cerrar"
                >
                    ✕
                </button>

                <div className="flex-1 overflow-y-auto rounded-2xl">
                    <MascotaCardUsuario
                        m={mascota}
                        open={true}
                        onClose={onClose}
                        onAdopt={() => {
                            if (mascota) onAdopt(mascota);
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}
