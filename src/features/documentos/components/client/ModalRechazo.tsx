"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Documento } from "../../types/types";

interface ModalRechazoProps {
  open: boolean;
  documento: Documento | null;
  onClose: () => void;
  onConfirm: (motivo: string) => void | Promise<void>;
}

export default function ModalRechazo({
  open,
  documento,
  onClose,
  onConfirm,
}: ModalRechazoProps) {
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open) setMotivo("");
  }, [open]);

  if (!open || !documento) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold text-[#BC5F36] mb-4">
          Rechazar documento
        </h2>

        <p className="mb-2 text-sm text-gray-700">
          Documento: <b>{documento.tipo}</b>
        </p>

        <textarea
          className="w-full border rounded-md p-2 mb-4 text-sm"
          rows={4}
          placeholder="Escribe el motivo del rechazo..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              if (!motivo.trim()) return;
              onConfirm(motivo);
            }}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Rechazar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
