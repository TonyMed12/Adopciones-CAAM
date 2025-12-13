"use client";

import React from "react";
import ReactDOM from "react-dom";

interface Props {
    visible: boolean;
    mensaje?: string | null;
}

export default function AdopcionEnProgresoOverlay({
    visible,
    mensaje,
}: Props) {
    if (!visible || typeof window === "undefined") return null;

    return ReactDOM.createPortal(
        <div
            className="
        fixed inset-0 z-[9999]
        bg-black/50
        flex items-center justify-center
      "
            style={{ pointerEvents: "auto" }}
        >
            <div
                className="
          bg-white rounded-2xl shadow-2xl
          p-8 max-w-sm w-full mx-4
          text-center animate-fade-in
        "
            >
                <div className="text-4xl mb-3 animate-bounce">🐶</div>

                <h2 className="text-lg font-extrabold text-[#2b1b12] mb-2">
                    {mensaje ?? "Procesando adopción..."}
                </h2>

                <p className="text-sm text-[#7a5c49]">
                    Por favor espera un momento, no cierres la página.
                </p>

                <div className="mt-5 flex justify-center">
                    <div className="w-7 h-7 border-4 border-[#BC5F36] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        </div>,
        document.body
    );
}
