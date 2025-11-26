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
import { string } from "zod";

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
      {/* INFORMACIÓN GENERAL */}
      <FormSection title="Información general">
        <FormGrid cols={2}>
          {/* Nombre */}
          <Controller
            control={form.control}
            name="nombre"
            render={({ field }) => {
              const errorMessage = form.formState.errors.nombre
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Nombre</FieldLabel>
                  <CAAMInput {...field} />

                  {errorMessage && (
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />

          {/* Especie (UI solamente) */}
          <FieldWrapper>
            <FieldLabel>Especie</FieldLabel>

            <CAAMSelect
              value={especieUI}
              onChange={(v) => {
                setEspecieUI(v);
                form.setValue("raza_id", ""); 
                form.trigger("raza_id"); 
              }}
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
            render={({ field }) => {
              const errorMessage = form.formState.errors.sexo
                ?.message as string;

              return (
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

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />

          {/* Tamaño */}
          <Controller
            control={form.control}
            name="tamano"
            render={({ field }) => {
              const errorMessage = form.formState.errors.tamano
                ?.message as string;

              return (
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

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />

          {/* Raza */}
          <Controller
            control={form.control}
            name="raza_id"
            render={({ field }) => {
              const { data: razas = [], isLoading } = useRazasQuery();

              const especieBase =
                especieUI || mascota?.raza?.especie?.toLowerCase() || "";

              const filtradas = especieBase
                ? razas.filter(
                    (r) => r.especie.toLowerCase() === especieBase.toLowerCase()
                  )
                : [];

              const options = filtradas.map((r) => ({
                label: r.nombre,
                value: r.id,
              }));

              const errorMessage = form.formState.errors.raza_id
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Raza</FieldLabel>

                  {isLoading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Cargando razas...
                    </div>
                  ) : (
                    <CAAMRazaCombobox
                      value={field.value || ""}
                      onChange={(v) => {
                        field.onChange(v);
                        form.trigger("raza_id");
                      }}
                      options={options}
                      placeholder={
                        especieBase
                          ? "Selecciona una raza..."
                          : "Primero selecciona una especie"
                      }
                    />
                  )}

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />
        </FormGrid>

        {/* Personalidad */}
        <Controller
          control={form.control}
          name="personalidad"
          render={({ field }) => {
            const error = form.formState.errors.personalidad?.message as string;

            return (
              <FieldWrapper>
                <FieldLabel>Personalidad</FieldLabel>

                <CAAMSelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  options={[
                    { label: "Tímido", value: "timido" },
                    { label: "Cariñoso", value: "carinoso" },
                    { label: "Juguetón", value: "jugueton" },
                    { label: "Tranquilo", value: "tranquilo" },
                    { label: "Energético", value: "energetico" },
                    { label: "Protector", value: "protector" },
                  ]}
                />

                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </FieldWrapper>
            );
          }}
        />
      </FormSection>

      {/* DATOS FÍSICOS */}
      <FormSection title="Datos físicos">
        <FormRow>
          {/* Edad */}
          <Controller
            control={form.control}
            name="edad"
            render={({ field }) => {
              const errorMessage = form.formState.errors.edad
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Edad (meses)</FieldLabel>
                  <CAAMNumberInput {...field} />

                  {errorMessage && (
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />

          {/* Peso */}
          <Controller
            control={form.control}
            name="peso_kg"
            render={({ field }) => {
              const errorMessage = form.formState.errors.peso_kg
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Peso (kg)</FieldLabel>

                  <CAAMNumberInput
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? null : Number(v));
                    }}
                  />

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />

          {/* Altura */}
          <Controller
            control={form.control}
            name="altura_cm"
            render={({ field }) => {
              const errorMessage = form.formState.errors.altura_cm
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Altura (cm)</FieldLabel>

                  <CAAMNumberInput
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? null : Number(v));
                    }}
                  />

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />
        </FormRow>
      </FormSection>

      {/* APARIENCIA */}
      <FormSection title="Apariencia">
        <Controller
          control={form.control}
          name="colores"
          render={({ field }) => {
            const errorMessage = form.formState.errors.colores
              ?.message as string;

            return (
              <FieldWrapper>
                <FieldLabel>Colores del pelaje</FieldLabel>
                <CAAMColorSelectorWrapper
                  value={field.value ?? []}
                  onChange={field.onChange}
                />

                {errorMessage && (
                  <p className="text-red-500 text-xs">{errorMessage}</p>
                )}
              </FieldWrapper>
            );
          }}
        />

        <Controller
          control={form.control}
          name="descripcion_fisica"
          render={({ field }) => {
            const errorMessage = form.formState.errors.descripcion_fisica
              ?.message as string;

            return (
              <FieldWrapper>
                <FieldLabel>Descripción física</FieldLabel>

                <CAAMTextarea
                  rows={4}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />

                {errorMessage && (
                  <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                )}
              </FieldWrapper>
            );
          }}
        />
      </FormSection>

      {/* SALUD */}
      <FormSection title="Salud e ingreso">
        <FormGrid cols={2}>
          {/* Lugar rescate */}
          <Controller
            control={form.control}
            name="lugar_rescate"
            render={({ field }) => {
              const errorMessage = form.formState.errors.lugar_rescate
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Lugar de rescate</FieldLabel>

                  <CAAMInput
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />

          {/* Condición ingreso */}
          <Controller
            control={form.control}
            name="condicion_ingreso"
            render={({ field }) => {
              const errorMessage = form.formState.errors.condicion_ingreso
                ?.message as string;

              return (
                <FieldWrapper>
                  <FieldLabel>Condición al ingreso</FieldLabel>

                  <CAAMSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={[
                      { label: "Sano", value: "Sano" },
                      { label: "Heridas leves", value: "Heridas leves" },
                      {
                        label: "Heridas moderadas",
                        value: "Heridas moderadas",
                      },
                      { label: "Heridas graves", value: "Heridas graves" },
                    ]}
                  />

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </FieldWrapper>
              );
            }}
          />
        </FormGrid>

        <Controller
          control={form.control}
          name="observaciones_medicas"
          render={({ field }) => {
            const errorMessage = form.formState.errors.observaciones_medicas
              ?.message as string;

            return (
              <FieldWrapper>
                <FieldLabel>Observaciones médicas</FieldLabel>

                <CAAMTextarea
                  rows={4}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />

                {errorMessage && (
                  <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                )}
              </FieldWrapper>
            );
          }}
        />
      </FormSection>

      {/* FOTO */}
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
          className="secondary px-4 py-2 rounded-lg bg-[#f4ece4] hover:bg-[#ffede1] text-[#8B4513] transition"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="primary px-4 py-2 rounded-lg bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold transition"
        >
          {isEditing ? "Guardar cambios" : "Registrar mascota"}
        </button>
      </div>
    </form>
  );
}
