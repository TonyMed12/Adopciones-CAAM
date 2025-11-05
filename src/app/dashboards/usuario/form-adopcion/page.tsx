"use client";
import { useRouter } from "next/navigation";
import AdoptionForm, { type AdoptionPayload } from "@/components/adopciones/AdoptionForm";
import { crearFormularioMock } from "@/data/adopciones/mocks";

export default function FormularioAdopcionPage() {
  const router = useRouter();

  const handleSubmit = (payload: AdoptionPayload) => {
    const creado = crearFormularioMock({ ...payload });
    console.log("Guardado (mock):", creado);
    alert("Formulario enviado. Estado: En revisión.");
    router.push("/dashboards/participante"); // ajusta el destino si quieres
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Formulario de adopción</h1>
        <p className="text-sm text-gray-600">
          Completa la información para continuar con tu adopción.
        </p>
      </div>
      <AdoptionForm onSubmit={handleSubmit} />
    </div>
  );
}
