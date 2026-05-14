"use client";

import { FileCheck, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Documento } from "@/features/perfil/types/perfil";

export default function PerfilDocumentosCard({
  documentos,
}: {
  documentos: Documento[];
}) {
  return (
    <section className="rounded-3xl bg-white border border-[#eadacb] shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 p-5 sm:p-6 border-b border-[#eadacb] bg-[#FFF7EF]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid place-items-center h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 shrink-0">
            <FileCheck size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
              Verificación
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2b1b12] tracking-tight truncate">
              Documentos aprobados
            </h2>
          </div>
        </div>

        <Badge tone="success" size="md" dot>
          {documentos.length} {documentos.length === 1 ? "documento" : "documentos"}
        </Badge>
      </header>

      <div className="p-5 sm:p-6">
        {documentos.length === 0 ? (
          <div className="rounded-2xl bg-[#FFF7EF]/40 border border-[#eadacb] p-6 text-center">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-[#a78d7b] mx-auto mb-3 ring-1 ring-[#eadacb]">
              <FileText size={20} />
            </div>
            <p className="text-sm font-bold text-[#2b1b12]">
              Sin documentos aprobados
            </p>
            <p className="text-xs text-[#7a5c49] mt-1">
              Cuando subas y validemos tus documentos, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {documentos.map((d) => (
              <article
                key={d.id}
                className="group rounded-2xl border border-[#eadacb] bg-gradient-to-br from-[#FFF7EF] to-white p-4 sm:p-5 hover:shadow-md hover:border-[#f3d6bb] hover:-translate-y-0.5 transition-all"
              >
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-emerald-600 mb-3 ring-1 ring-emerald-200 shadow-sm">
                  <FileCheck size={20} />
                </div>
                <p className="font-bold text-[#2b1b12] capitalize text-sm sm:text-base truncate">
                  {d.tipo}
                </p>
                <Badge tone="success" size="sm" dot className="mt-1.5">
                  Aprobado
                </Badge>
                <a
                  href={d.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#BC5F36] hover:bg-[#A0522D] text-white text-xs font-bold px-3 py-2 transition-colors w-full justify-center"
                >
                  Ver documento
                  <ExternalLink size={12} />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
