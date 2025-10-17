"use client";
import React, {useEffect, useState} from "react";
import {createPortal} from "react-dom";

export default function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Espera a que el componente se monte en el cliente antes de acceder al DOM
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(43,27,18,.45)] px-4 py-8 overflow-y-auto">
            <div className="my-auto w-full max-w-[720px] mx-4 rounded-2xl border-[4px] border-[#FF8414] bg-[#fff4e7] text-[#2b1b12] shadow-[0_18px_60px_rgba(43,27,18,.25)]">
                <header className="flex items-center justify-between border-b border-[#f0e6dc] bg-[#fff4e7] px-4 py-2.5">
                    <div className="text-sm font-extrabold">{title}</div>
                    <button
                        aria-label="Cerrar"
                        onClick={onClose}
                        className="h-[30px] w-[30px] rounded-lg bg-[#f4ece4] hover:bg-[#ffede1] transition"
                    >
                        ✕
                    </button>
                </header>
                <div className="p-4">{children}</div>
            </div>
        </div>,
        document.body
    );
}
