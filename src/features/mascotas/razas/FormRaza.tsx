"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { RazaSchema } from "@/features/mascotas/schemas/razas-schemas";
import { useCrearRaza } from "@/features/mascotas/hooks/useCrearRaza";

import { FormSection } from "@/components/form/FormSection";
import { FormGrid } from "@/components/form/FormGrid";
import { FieldWrapper } from "@/components/form/FieldWrapper";
import { FieldLabel } from "@/components/form/FieldLabel";

import { CAAMInput } from "@/components/form/CAAMInput";
import { CAAMSelect } from "@/components/form/CAAMSelect";

export default function FormRaza({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const crearRaza = useCrearRaza();

  const form = useForm({
    resolver: zodResolver(RazaSchema),
    defaultValues: {
      nombre: "",
      especie: "Perro",
      tamano: "mediano",
      activa: true,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await crearRaza.mutateAsync(values);
      toast.success("Raza guardada correctamente");
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.message || "Ocurrió un error al guardar la raza"
      );
    }
  });

  return (
    <form onSubmit={submit} className="space-y-6 text-[#2b1b12]">
      <FormSection title="Información de la raza">
        <FormGrid cols={3}>
          {/* Nombre */}
          <Controller
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Nombre</FieldLabel>
                <CAAMInput
                  placeholder="Ej. Labrador Retriever"
                  {...field}
                />
                {form.formState.errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.nombre.message as string}
                  </p>
                )}
              </FieldWrapper>
            )}
          />

          {/* Especie */}
          <Controller
            control={form.control}
            name="especie"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Especie</FieldLabel>
                <CAAMSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Perro", value: "Perro" },
                    { label: "Gato", value: "Gato" },
                    { label: "Otro", value: "Otro" },
                  ]}
                />
                {form.formState.errors.especie && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.especie.message as string}
                  </p>
                )}
              </FieldWrapper>
            )}
          />

          {/* Tamaño */}
          <Controller
            control={form.control}
            name="tamano"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Tamaño</FieldLabel>
                <CAAMSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={[
                    { label: "Pequeño", value: "pequeño" },
                    { label: "Mediano", value: "mediano" },
                    { label: "Grande", value: "grande" },
                  ]}
                />
                {form.formState.errors.tamano && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.tamano.message as string}
                  </p>
                )}
              </FieldWrapper>
            )}
          />
        </FormGrid>
      </FormSection>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={crearRaza.isPending}
          className="px-4 py-2 rounded-lg bg-[#f4ece4] hover:bg-[#ffede1] text-[#8B4513] transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={crearRaza.isPending}
          className="px-4 py-2 rounded-lg bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold transition"
        >
          {crearRaza.isPending ? "Guardando..." : "Guardar raza"}
        </button>
      </div>
    </form>
  );
}
