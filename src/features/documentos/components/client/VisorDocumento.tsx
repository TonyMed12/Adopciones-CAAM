"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VisorDocumentoProps {
  open: boolean;
  url: string | null;
  onClose: () => void;
}

export default function VisorDocumento({ open, url, onClose }: VisorDocumentoProps) { 
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !url) return null;

  const safeUrl = String(url);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl border border-neutral-200 max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden animate-[fadeInScale_0.25s_ease-out]">

        <div className="h-12 px-4 border-b border-neutral-200 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">Vista del documento</h2>
            <p className="text-xs text-neutral-500 -mt-1">Revisa el archivo completo</p>
          </div>

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              onClick={() => window.open(safeUrl, "_blank")}
              className="text-[#BC5F36] hover:bg-[#ffe8db] flex items-center gap-1"
            >
              <FileText className="h-4 w-4" /> Abrir pestaña
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                const link = document.createElement("a");
                link.href = safeUrl;
                link.download = safeUrl.split("/").pop() || "documento.pdf";
                link.click();
              }}
              className="text-[#BC5F36] hover:bg-[#ffe8db] flex items-center gap-1"
            >
              Descargar
            </Button>

            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-neutral-100 p-4">
          <iframe
            src={safeUrl}
            className="w-full h-full rounded-lg border border-neutral-300 shadow-inner bg-white"
          />
        </div>

        <div className="h-12 px-4 border-t border-neutral-200 bg-white flex items-center justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cerrar visor
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
