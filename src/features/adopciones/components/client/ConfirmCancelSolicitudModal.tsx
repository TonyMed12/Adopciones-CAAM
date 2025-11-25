"use client";

import { Button } from "@/components/ui/Button";
import { createPortal } from "react-dom";

export default function ConfirmCancelSolicitudModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const modal = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-[#eadacb]">
        <h3 className="text-xl font-extrabold text-[#8b4513] text-center mb-3">
          ¿Cancelar tu solicitud?
        </h3>

        <p className="text-sm text-[#7a5c49] text-center leading-relaxed">
          Si cancelas tu solicitud, la mascota se liberará y quedará disponible
          nuevamente para adopción.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={onClose}
            className="bg-[#fff5f3] border border-[#e8c9b8] text-[#BC5F36] hover:bg-[#ffe7e2] transition-all cursor-pointer"
          >
            No, regresar
          </Button>

          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-[#BC5F36] hover:bg-[#a64d2e] text-white transition-all cursor-pointer"
          >
            Sí, cancelar solicitud
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
