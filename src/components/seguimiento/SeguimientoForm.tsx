"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Loader2, Camera } from "lucide-react";

// ✅ Esquema de validación
const seguimientoSchema = z.object({
  observaciones: z
    .string()
    .min(3, "Agrega una breve descripción del seguimiento."),
  recomendaciones: z.string().optional(),
  satisfaccion_adoptante: z
    .number()
    .min(1, "Debe ser al menos 1")
    .max(5, "Máximo 5"),
  fotos: z.any().optional(),
});

export default function SeguimientoForm({
  adopcionId,
  fechaProgramada,
  onSuccess,
}: {
  adopcionId: string;
  fechaProgramada: string;
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(seguimientoSchema),
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // ✅ Manejar carga de imágenes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // ✅ Enviar datos a Supabase
  const onSubmit = async (data: any) => {
    try {
      setUploading(true);

      // Subir fotos (si hay)
      const uploadedUrls: string[] = [];

      if (data.fotos && data.fotos.length > 0) {
        for (const file of data.fotos) {
          const filePath = `seguimientos/${adopcionId}/${Date.now()}-${
            file.name
          }`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("adopciones").upload(filePath, file);

          if (uploadError) {
            console.error("❌ Error subiendo imagen:", uploadError.message);
            continue;
          }

          const publicUrl = supabase.storage
            .from("adopciones")
            .getPublicUrl(filePath).data.publicUrl;

          uploadedUrls.push(publicUrl);
        }
      }

      // Registrar seguimiento
      const { error } = await supabase.from("seguimiento_adopcion").insert({
        adopcion_id: adopcionId,
        fecha_seguimiento: fechaProgramada,
        observaciones: data.observaciones,
        recomendaciones: data.recomendaciones,
        satisfaccion_adoptante: data.satisfaccion_adoptante,
        fotos_actuales: uploadedUrls,
        completado: true,
        metodo_contacto: "formulario",
        realizado_por: null, // lo puedes llenar luego con el perfil del usuario si lo manejas
        estado_mascota: "bueno",
      });

      if (error) throw error;

      alert("✅ Seguimiento registrado correctamente");
      reset();
      onSuccess?.();
    } catch (err: any) {
      console.error("❌ Error registrando seguimiento:", err.message);
      alert("Error al guardar el seguimiento.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-[#FFF8F0] p-6 rounded-xl border border-[#E5D1B8] shadow-sm"
    >
      <div>
        <p className="text-sm text-gray-600 mb-1">
          Fecha programada:{" "}
          <span className="font-semibold text-[#8B4513]">
            {new Date(fechaProgramada).toLocaleDateString()}
          </span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-[#8B4513]">
          Observaciones
        </label>
        <textarea
          {...register("observaciones")}
          className="w-full border rounded-lg p-2 text-sm"
          rows={3}
          placeholder="Describe cómo se ha adaptado la mascota, su comportamiento, alimentación, etc."
        />
        {errors.observaciones && (
          <p className="text-red-600 text-xs mt-1">
            {String(errors.observaciones.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-[#8B4513]">
          Recomendaciones (opcional)
        </label>
        <textarea
          {...register("recomendaciones")}
          className="w-full border rounded-lg p-2 text-sm"
          rows={2}
          placeholder="¿Tienes alguna recomendación o comentario adicional?"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-[#8B4513]">
          Satisfacción del adoptante (1 a 5)
        </label>
        <input
          type="number"
          min="1"
          max="5"
          {...register("satisfaccion_adoptante", { valueAsNumber: true })}
          className="w-24 border rounded-lg p-2 text-center"
        />
        {errors.satisfaccion_adoptante && (
          <p className="text-red-600 text-xs mt-1">
            {String(errors.satisfaccion_adoptante.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-[#8B4513]">
          Fotos de seguimiento (opcional)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          {...register("fotos")}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
        {previewUrls.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`preview-${i}`}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={uploading || isSubmitting}>
          {uploading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          Guardar seguimiento
        </Button>
      </div>
    </form>
  );
}
