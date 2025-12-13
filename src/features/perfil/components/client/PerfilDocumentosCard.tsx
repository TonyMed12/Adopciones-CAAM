import { Card } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import type { Documento } from "@/features/perfil/types/perfil";

export default function PerfilDocumentosCard({
  documentos,
}: {
  documentos: Documento[];
}) {
  return (
    <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
      <h2 className="text-xl font-semibold text-[#8b4513] mb-4">
        Documentos aprobados
      </h2>

      {documentos.length === 0 ? (
        <p className="text-[#5b3e26]">No hay documentos aprobados.</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {documentos.map((d) => (
            <div
              key={d.id}
              className="bg-[#fffaf3] border border-[#e2cbb3] rounded-lg p-4 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#f7e8d0] flex items-center justify-center mb-2">
                <FileCheck className="h-6 w-6 text-[#8b4513]" />
              </div>
              <p className="font-medium text-[#8b4513] capitalize">{d.tipo}</p>
              <a
                href={d.url ?? "#"}
                target="_blank"
                className="mt-3 px-3 py-1.5 rounded-md bg-[#8b4513] text-white text-sm"
              >
                Ver documento
              </a>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
