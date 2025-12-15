import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";

interface Props {
    estado: EstadoDocumentos;
}

export default function DocumentosStepper({ estado }: Props) {
    const steps = [
        { key: "sin_documentos", label: "1. Sube tus documentos" },
        { key: "en_revision", label: "2. Revisión del administrador" },
        { key: "aprobado", label: "3. Aprobado" },
    ] as const;

    const current =
        estado === "sin_documentos" ? 0 :
            estado === "en_revision" ? 1 : 2;

    return (
        <ol className="grid gap-3 md:grid-cols-3">
            {steps.map((s, i) => (
                <li key={s.key} className="rounded-xl border p-4">
                    <p className="text-sm font-extrabold">{s.label}</p>
                </li>
            ))}
        </ol>
    );
}
