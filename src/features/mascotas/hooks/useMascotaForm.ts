"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateMascotaSchema,
} from "@/features/mascotas/schemas/mascotas-schemas";

import type { Mascota } from "@/features/mascotas/types/mascotas";

export type MascotaFormValues = any;

interface UseMascotaFormProps {
  mascota?: Mascota | null;
  onSubmit: (values: any) => void;
}

export function useMascotaForm({ mascota, onSubmit }: UseMascotaFormProps) {
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [especieUI, setEspecieUI] = useState<string>("");

  const isEditing = Boolean(mascota?.id);

  const form = useForm<any>({
    resolver: zodResolver(CreateMascotaSchema),
    defaultValues: {
      nombre: "",
      sexo: "",
      tamano: "",
      disponible_adopcion: true,
      edad: "",
      personalidad: "",
      imagen_url: null,
      esterilizado: false,
      peso_kg: null,
      altura_cm: null,
      colores: [],
      descripcion_fisica: "",
      fecha_ingreso: new Date().toISOString().split("T")[0],
      lugar_rescate: "",
      condicion_ingreso: "",
      observaciones_medicas: "",
      raza_id: null,
      qr_code: null,
      estado: "disponible",
    },
  });

  /* PRE-CARGA EN EDICIÓN */
  useEffect(() => {
    if (!mascota) return;

    form.reset({
      nombre: mascota.nombre,
      sexo: mascota.sexo,
      tamano: mascota.tamano,
      disponible_adopcion: mascota.disponible_adopcion,
      edad: mascota.edad,
      personalidad: mascota.personalidad,
      imagen_url: mascota.imagen_url,
      esterilizado: mascota.esterilizado,
      peso_kg: mascota.peso_kg,
      altura_cm: mascota.altura_cm,
      colores: mascota.colores,
      descripcion_fisica: mascota.descripcion_fisica,
      fecha_ingreso: mascota.fecha_ingreso?.split("T")[0],
      lugar_rescate: mascota.lugar_rescate,
      condicion_ingreso: mascota.condicion_ingreso,
      observaciones_medicas: mascota.observaciones_medicas,
      raza_id: mascota.raza_id,
      qr_code: mascota.qr_code,
      estado: mascota.estado,
    });

    // ESPECIE UI (NO PARA GUARDAR)
    setEspecieUI(mascota.raza?.especie ?? "");

    if (mascota.imagen_url) {
      setFotoPreview(mascota.imagen_url);
    }
  }, [mascota, form]);

  /* Foto */
  const handleSelectFoto = useCallback((file: File | null) => {
    if (!file) return;
    setFotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  /* SUBMIT FINAL */
  const submit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      peso_kg: values.peso_kg ? Number(values.peso_kg) : null,
      altura_cm: values.altura_cm ? Number(values.altura_cm) : null,
      fotoFile,
      fotoPreview,
      ...(isEditing ? { id: mascota?.id } : {}),
    });
  });

  return {
    form,
    submit,

    fotoPreview,
    fotoFile,
    handleSelectFoto,

    especieUI,
    setEspecieUI,

    isEditing,
  };
}
