"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
    console.log("💡 Modal renderizado, open =", open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[rgba(43,27,18,0.45)] flex items-center justify-center"
      onClick={onClose} // cerrar si hacen clic fuera del modal
    >
      <div
        className="relative w-full max-w-[720px] mx-4 my-8 rounded-2xl border-[4px] border-[#FF8414] bg-[#fff4e7] text-[#2b1b12] shadow-[0_18px_60px_rgba(43,27,18,.25)] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // evita cierre al hacer clic dentro
      >
        <header className="flex items-center justify-between border-b border-[#f0e6dc] bg-[#fff4e7] px-4 py-2.5 sticky top-0 z-10">
          <div className="text-sm font-extrabold">{title}</div>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="h-[30px] w-[30px] rounded-lg bg-[#f4ece4] hover:bg-[#ffede1] transition"
          >
            ✕
          </button>
        </header>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}
