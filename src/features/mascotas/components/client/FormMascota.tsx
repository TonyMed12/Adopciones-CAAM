"use client";

import { Controller } from "react-hook-form";
import { useMascotaForm } from "@/features/mascotas/hooks/useMascotaForm";
import { useRazasQuery } from "@/features/mascotas/hooks/useRazasQuery";

import { FormSection } from "@/components/form/FormSection";
import { FormGrid } from "@/components/form/FormGrid";
import { FormRow } from "@/components/form/FormRow";

import { FieldWrapper } from "@/components/form/FieldWrapper";
import { FieldLabel } from "@/components/form/FieldLabel";

import { CAAMInput } from "@/components/form/CAAMInput";
import { CAAMNumberInput } from "@/components/form/CAAMNumberInput";
import { CAAMTextarea } from "@/components/form/CAAMTextarea";
import { CAAMSelect } from "@/components/form/CAAMSelect";
import { CAAMRazaCombobox } from "@/components/form/CAAMRazaCombobox";
import { CAAMColorSelectorWrapper } from "@/components/form/CAAMColorSelectorWrapper";
import { CAAMPhotoInput } from "@/components/form/CAAMPhotoInput";

export default function FormMascota({
  mascota,
  onCancel,
  onSubmitFinal,
}: {
  mascota?: any | null;
  onCancel: () => void;
  onSubmitFinal?: (data: any) => void;
}) {
  const {
    form,
    submit,
    fotoPreview,
    handleSelectFoto,
    especieUI,
    setEspecieUI,
    isEditing,
  } = useMascotaForm({
    mascota,
    onSubmit: (values) => onSubmitFinal?.(values),
  });

  return (
    <form onSubmit={submit} className="space-y-10 text-[#2b1b12]">

      {/* 🟠 INFORMACIÓN GENERAL */}
      <FormSection title="Información general">
        <FormGrid cols={2}>

          {/* Nombre */}
          <Controller
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Nombre</FieldLabel>
                <CAAMInput {...field} />
              </FieldWrapper>
            )}
          />

          {/* Especie (UI solamente) */}
          <FieldWrapper>
            <FieldLabel>Especie</FieldLabel>

            <CAAMSelect
              value={especieUI}
              onChange={(v) => setEspecieUI(v)}
              options={[
                { label: "Perro", value: "perro" },
                { label: "Gato", value: "gato" },
                { label: "Otro", value: "otro" },
              ]}
            />
          </FieldWrapper>

          {/* Sexo */}
          <Controller
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Sexo</FieldLabel>
                <CAAMSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={[
                    { label: "Macho", value: "macho" },
                    { label: "Hembra", value: "hembra" },
                  ]}
                />
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
              </FieldWrapper>
            )}
          />

          {/* Raza */}
          <Controller
            control={form.control}
            name="raza_id"
            render={({ field }) => {
              const {
                data: razas = [],
                isLoading,
              } = useRazasQuery();

              const filtradas = especieUI
                ? razas.filter(
                    (r) => r.especie.toLowerCase() === especieUI.toLowerCase()
                  )
                : [];

              const options = filtradas.map((r) => ({
                label: r.nombre,
                value: r.id,
              }));

              return (
                <FieldWrapper>
                  <FieldLabel>Raza</FieldLabel>

                  {isLoading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Cargando razas...
                    </div>
                  ) : (
                    <CAAMRazaCombobox
                      value={field.value ?? ""}
                      onChange={(v) => field.onChange(v === "" ? null : v)}
                      options={options}
                      placeholder={
                        especieUI
                          ? "Selecciona una raza..."
                          : "Primero selecciona una especie"
                      }
                    />
                  )}
                </FieldWrapper>
              );
            }}
          />

        </FormGrid>
      </FormSection>

      {/* 🟠 DATOS FÍSICOS */}
      <FormSection title="Datos físicos">
        <FormRow>

          {/* Edad */}
          <Controller
            control={form.control}
            name="edad"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Edad (meses)</FieldLabel>
                <CAAMNumberInput
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FieldWrapper>
            )}
          />

          {/* Peso */}
          <Controller
            control={form.control}
            name="peso_kg"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Peso (kg)</FieldLabel>
                <CAAMNumberInput
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? null : Number(v));
                  }}
                />
              </FieldWrapper>
            )}
          />

          {/* Altura */}
          <Controller
            control={form.control}
            name="altura_cm"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Altura (cm)</FieldLabel>
                <CAAMNumberInput
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? null : Number(v));
                  }}
                />
              </FieldWrapper>
            )}
          />

        </FormRow>
      </FormSection>

      {/* 🟠 APARIENCIA */}
      <FormSection title="Apariencia">
        <Controller
          control={form.control}
          name="colores"
          render={({ field }) => (
            <FieldWrapper>
              <FieldLabel>Colores del pelaje</FieldLabel>
              <CAAMColorSelectorWrapper
                value={field.value ?? []}
                onChange={field.onChange}
              />
            </FieldWrapper>
          )}
        />

        <Controller
          control={form.control}
          name="descripcion_fisica"
          render={({ field }) => (
            <FieldWrapper>
              <FieldLabel>Descripción física</FieldLabel>
              <CAAMTextarea
                rows={4}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FieldWrapper>
          )}
        />
      </FormSection>

      {/* 🟠 SALUD */}
      <FormSection title="Salud e ingreso">
        <FormGrid cols={2}>

          {/* Lugar rescate */}
          <Controller
            control={form.control}
            name="lugar_rescate"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Lugar de rescate</FieldLabel>
                <CAAMInput
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FieldWrapper>
            )}
          />

          {/* Condición ingreso */}
          <Controller
            control={form.control}
            name="condicion_ingreso"
            render={({ field }) => (
              <FieldWrapper>
                <FieldLabel>Condición al ingreso</FieldLabel>
                <CAAMSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={[
                    { label: "Sano", value: "Sano" },
                    { label: "Heridas leves", value: "Heridas leves" },
                    { label: "Heridas moderadas", value: "Heridas moderadas" },
                    { label: "Heridas graves", value: "Heridas graves" },
                  ]}
                />
              </FieldWrapper>
            )}
          />

        </FormGrid>

        <Controller
          control={form.control}
          name="observaciones_medicas"
          render={({ field }) => (
            <FieldWrapper>
              <FieldLabel>Observaciones médicas</FieldLabel>
              <CAAMTextarea
                rows={4}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FieldWrapper>
          )}
        />
      </FormSection>

      {/* 🟠 FOTO */}
      <FormSection title="Foto de la mascota">
        <CAAMPhotoInput
          previewUrl={fotoPreview}
          onSelectFile={handleSelectFoto}
        />
      </FormSection>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-[#f4ece4] hover:bg-[#ffede1] text-[#8B4513] transition"
          onClick={onCancel}>

          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#FF8414] hover:bg-[#ff9d45] text-white font-semibold transition">
          {isEditing ? "Guardar cambios" : "Crear mascota"}
        </button>
      </div>

    </form>
  );
}
