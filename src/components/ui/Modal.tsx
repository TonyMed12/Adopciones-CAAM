"use client";
import React from "react";

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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(43,27,18,.45)] p-4">
      <div className="w-full max-w-[720px] overflow-hidden rounded-2xl border-[4px] border-[#FF8414] bg-[#fff4e7] text-[#2b1b12] shadow-[0_18px_60px_rgba(43,27,18,.25)]">
        <header className="flex items-center justify-between border-b border-[#f0e6dc] bg-[#fff4e7] px-4 py-2.5">
          <div className="text-sm font-extrabold">{title}</div>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="h-[30px] w-[30px] rounded-lg bg-[#f4ece4]"
          >
            ✕
          </button>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
