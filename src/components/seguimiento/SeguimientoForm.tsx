"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Loader2, Camera, PawPrint, Upload } from "lucide-react";
import { toast } from "sonner";
import { toastConfirm } from "@/components/ui/toastConfirm";

/* ------------------ VALIDACIÓN ------------------ */
const seguimientoSchema = z.object({
  observaciones: z
    .string()
    .min(3, "Agrega una breve descripción del seguimiento."),
  recomendaciones: z.string().optional(),
  satisfaccion_adoptante: z
    .number()
    .min(1, "Selecciona al menos 1 huellita.")
    .max(5, "Máximo 5 huellas."),
  fotos: z.any().optional(),
});

type SeguimientoFormValues = z.infer<typeof seguimientoSchema>;

export default function SeguimientoForm({
  adopcionId,
  fechaProgramada,
  onSuccess,
}: {
  adopcionId: string;
  fechaProgramada: string;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SeguimientoFormValues>({
    resolver: zodResolver(seguimientoSchema),
  });

  /* ------------------ PREVIEW ------------------ */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  /* ------------------ SUBMIT ------------------ */
  const onSubmit = async (data: SeguimientoFormValues) => {
    try {
      setUploading(true);

      // 🟠 Obtener usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error obteniendo usuario:", userError);
      }

      if (!user) {
        toast.error("Error: sesión del usuario no encontrada.");
        setUploading(false);
        return;
      }

      /* 🟣 SUBIR FOTOS */
      const fotosUrls: string[] = [];
      const anyData: any = data;
      const archivos: FileList | undefined = anyData.fotos;

      if (archivos && archivos.length > 0) {
        for (const file of Array.from(archivos)) {
          const ext = file.name.split(".").pop() || "jpg";
          const fileName = `${Date.now()}.${ext}`;

          // Carpeta por adopción dentro de /evidencias
          const storagePath = `evidencias/${adopcionId}/${fileName}`;

          console.log("📤 Subiendo archivo a:", storagePath);

          const { data: uploaded, error: uploadError } = await supabase.storage
            .from("seguimineto")
            .upload(storagePath, file, {
              upsert: false,
            });

          console.log("📤 RESPUESTA UPLOAD:", uploaded, uploadError);

          if (uploadError) {
            console.error("❌ Error al subir imagen:", uploadError);
            continue;
          }

          // URL pública
          const {
            data: { publicUrl },
          } = supabase.storage.from("seguimineto").getPublicUrl(storagePath);

          console.log("📸 URL pública generada:", publicUrl);
          fotosUrls.push(publicUrl);
        }
      }

      console.log("📦 Fotos finales a guardar:", fotosUrls);

      /* 🟢 INSERTAR EN BD */
      const { error } = await supabase.from("seguimiento_adopcion").insert({
        adopcion_id: adopcionId,
        fecha_seguimiento: fechaProgramada,
        observaciones: data.observaciones,
        recomendaciones: data.recomendaciones,
        satisfaccion_adoptante: data.satisfaccion_adoptante,
        fotos_actuales: fotosUrls,
        metodo_contacto: "email", // valor que ya te funcionaba
        completado: true,
        realizado_por: user.id,
        estado_mascota: "bueno",
      });

      if (error) {
        console.error("❌ INSERT ERROR:", error);
        throw error;
      }

      toast.success("🐾 Seguimiento guardado correctamente");
      reset();
      setRating(0);
      setHoverRating(0);
      setPreviewUrls([]);
      onSuccess?.();
    } catch (err) {
      console.error("❌ Error registrando seguimiento:", err);
      toast.error("Ocurrió un error al registrar el seguimiento.");
    } finally {
      setUploading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 rounded-xl bg-[#FFF5EB] border border-[#E3C9A8] text-sm"
    >
      {/* FECHA */}
      <p className="text-xs text-gray-700">
        Seguimiento programado para:{" "}
        <span className="font-semibold text-[#8B4513]">
          {new Date(fechaProgramada).toLocaleDateString()}
        </span>
      </p>

      {/* OBSERVACIONES */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#8B4513]">
          Observaciones
        </label>
        <textarea
          {...register("observaciones")}
          className="w-full p-2 rounded-lg bg-white border border-[#D9BDA3] focus:ring-1 focus:ring-[#BC5F36] text-sm"
          rows={3}
          placeholder="Describe cómo se encuentra tu mascota..."
        />
        {errors.observaciones && (
          <p className="text-red-600 text-xs">
            {String(errors.observaciones.message)}
          </p>
        )}
      </div>

      {/* RECOMENDACIONES */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#8B4513]">
          Recomendaciones (opcional)
        </label>
        <textarea
          {...register("recomendaciones")}
          className="w-full p-2 rounded-lg bg-white border border-[#D9BDA3] focus:ring-1 focus:ring-[#BC5F36] text-sm"
          rows={2}
        />
      </div>

      {/* CALIFICACIÓN */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#8B4513]">
          Calificación del seguimiento
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onMouseEnter={() => setHoverRating(val)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => {
                setRating(val);
                setValue("satisfaccion_adoptante", val, {
                  shouldValidate: true,
                });
              }}
              className="transition-transform hover:scale-110"
            >
              <PawPrint
                size={24}
                className={
                  val <= (hoverRating || rating)
                    ? "text-[#BC5F36]"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>
        {errors.satisfaccion_adoptante && (
          <p className="text-red-600 text-xs">
            {String(errors.satisfaccion_adoptante.message)}
          </p>
        )}
      </div>

      {/* FOTOS */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#8B4513]">
          Fotos del seguimiento
        </label>

        <label className="w-full p-3 border-2 border-dashed rounded-lg bg-white border-[#D9BDA3] flex flex-col items-center cursor-pointer hover:border-[#BC5F36]">
          <Upload size={20} className="text-[#BC5F36]" />
          <span className="text-[11px] text-gray-600 text-center">
            Haz clic para seleccionar fotos o arrástralas aquí
          </span>

          <input
            type="file"
            multiple
            accept="image/*"
            {...register("fotos")}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {previewUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-1">
            {previewUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

      {/* GUARDAR */}
      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          disabled={uploading}
          className="bg-[#BC5F36] hover:bg-[#a5532e] text-white px-4 py-2 h-9 text-xs"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin w-3 h-3 mr-1" /> Guardando...
            </>
          ) : (
            <>
              <Camera className="w-3 h-3 mr-1" /> Guardar seguimiento
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
