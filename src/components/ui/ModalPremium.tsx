"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ModalPremium({
  open,
  onClose,
  children,
  width = "600px",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => setMounted(true), []);

  // Animación suave
  useEffect(() => {
    if (open) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [open]);

  // bloquear scroll
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition"
      style={{
        background: "rgba(43,27,18,0.25)", // más transparente
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative rounded-2xl shadow-[0_18px_60px_rgba(43,27,18,.25)] 
          bg-[#fdf7f1] text-[#281c13] w-full overflow-hidden 
          transition-all duration-300 ease-out
          ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `}
        style={{ maxWidth: width }}
      >
        {/* CONTENIDO SCROLLEABLE */}
        <div className="p-6 space-y-6 custom-scroll overflow-y-auto max-h-[85vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
