"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Loader2, Camera, PawPrint, Upload, Heart } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

/* ------------------ VALIDACIÓN ------------------ */
const seguimientoSchema = z.object({
  observaciones: z.string(),
  recomendaciones: z.string().optional(),

  satisfaccion_adoptante: z.any(),
  estado_mascota: z.any(),
  fotos: z.any(),

  // problemas separados por coma → array
  problemas_reportados: z.string().optional(),
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
  const [estadoMascota, setEstadoMascota] = useState(0);
  const [hoverEstado, setHoverEstado] = useState(0);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);

    // Máximo 5 imágenes
    if (selected.length + previewFiles.length > 5) {
      toast.error("Solo puedes subir máximo 5 fotos.");
      return;
    }

    const newFiles = [...previewFiles, ...selected];
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setPreviewFiles(newFiles);
    setPreviewUrls(newUrls);

    // 🔥 Actualizar el file input real para el submit
    const dt = new DataTransfer();
    newFiles.forEach((f) => dt.items.add(f));
    setValue("fotos", dt.files);
  };

  /* ------------------ ELIMINAR FOTO DEL PREVIEW ------------------ */
  const removePhoto = (index: number) => {
    const newFiles = previewFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    setPreviewFiles(newFiles);
    setPreviewUrls(newUrls);

    // 🔥 Actualiza el input real, eliminando también el archivo
    const dt = new DataTransfer();
    newFiles.forEach((f) => dt.items.add(f));
    setValue("fotos", dt.files);
  };

  const onSubmit = async (data: SeguimientoFormValues) => {
    // Observaciones
    if (!data.observaciones || data.observaciones.trim().length < 3) {
      toast.error("Agrega una breve descripción del seguimiento.");
      return;
    }

    // Estado mascota
    if (!estadoMascota || estadoMascota < 1) {
      toast.error("Selecciona el estado de la mascota.");
      return;
    }

    // Calificación seguimiento
    if (!rating || rating < 1) {
      toast.error("Selecciona la calificación del seguimiento.");
      return;
    }

    // Fotos
    const archivos = data.fotos as FileList | undefined;

    if (!archivos || archivos.length === 0) {
      toast.error("Debes subir al menos una foto.");
      return;
    }

    if (archivos.length > 5) {
      toast.error("Puedes subir máximo 5 fotos.");
      return;
    }

    try {
      setUploading(true);

      // usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Error: sesión del usuario no encontrada.");
        setUploading(false);
        return;
      }

      /* 🟣 SUBIR FOTOS */
      const fotosUrls: string[] = [];

      for (const file of Array.from(archivos)) {
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;

        const storagePath = `evidencias/${adopcionId}/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from("seguimineto")
          .upload(storagePath, file);

        if (uploadError) {
          console.error("❌ Error subiendo imagen:", uploadError);
          toast.error("Error subiendo una imagen. Intenta de nuevo.");
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("seguimineto").getPublicUrl(storagePath);

        fotosUrls.push(publicUrl);
      }

      /* convertir problemas a array */
      const problemasArray = data.problemas_reportados
        ? data.problemas_reportados.split(",").map((p) => p.trim())
        : [];

      /* ------------------ INSERT ------------------ */
      const { error } = await supabase.from("seguimiento_adopcion").insert({
        adopcion_id: adopcionId,
        fecha_seguimiento: fechaProgramada,
        observaciones: data.observaciones,
        recomendaciones: data.recomendaciones || null,
        satisfaccion_adoptante: data.satisfaccion_adoptante,
        estado_mascota: data.estado_mascota,
        problemas_reportados: problemasArray,
        fotos_actuales: fotosUrls,
        completado: true,
        realizado_por: user.id,
      });

      if (error) {
        console.error("❌ INSERT ERROR:", error);
        throw error;
      }

      toast.success("🐾 Seguimiento enviado con éxito", {
        description: "Gracias por compartir el estado de tu mascota.",
        duration: 3000,
      });

      reset();

      setTimeout(() => {
        onSuccess?.();
      }, 800);
    } catch (err) {
      console.error("❌ Error registrando seguimiento:", err);
      toast.error("Ocurrió un error.");
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
      {/* SUBTÍTULO DEL MODAL */}
      <h2 className="text-lg font-bold text-[#8B4513] text-center mb-3">
        Registra el seguimiento de tu mascota
      </h2>

      {/* FECHA FIJA */}
      <p className="text-xs text-gray-700 text-center mb-4">
        Seguimiento programado para:{" "}
        <span className="font-semibold text-[#8B4513]">
          {dayjs(fechaProgramada).format("DD/MM/YYYY")}
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
          <p className="text-red-600 text-xs">{errors.observaciones.message}</p>
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
          placeholder="¿Alguna recomendación del veterinario o del CAAM?"
        />
      </div>

      {/* ESTADO + CALIFICACIÓN EN LA MISMA LÍNEA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* ESTADO DE LA MASCOTA */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#8B4513]">
            Estado de la mascota
          </label>

          <div className="flex items-center gap-4">
            {/* Corazones */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((val) => {
                const isActive = val <= (hoverEstado || estadoMascota);

                return (
                  <button
                    key={val}
                    type="button"
                    onMouseEnter={() => setHoverEstado(val)}
                    onMouseLeave={() => setHoverEstado(0)}
                    onClick={() => {
                      setEstadoMascota(val);

                      const mapEnum: Record<number, string> = {
                        1: "requiere_atencion",
                        2: "regular",
                        3: "regular",
                        4: "bueno",
                        5: "excelente",
                      };

                      setValue("estado_mascota", mapEnum[val], {
                        shouldValidate: true,
                      });
                    }}
                    className={`clickable transition-transform hover:scale-125 ${
                      isActive ? "heartbeat" : ""
                    }`}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill={isActive ? "#E63946" : "none"}
                      stroke={isActive ? "#E63946" : "#D3D3D3"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21s-6.716-4.437-9.083-8.01C.42 9.843.486 6.35 2.293 4.293 4.1 2.236 7.314 2.236 9.12 4.293L12 7.5l2.88-3.207c1.806-2.057 5.02-2.057 6.827 0 1.807 2.057 1.873 5.55-.624 8.697C18.716 16.563 12 21 12 21z" />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Texto dinámico */}
            <p className="text-xs font-medium text-[#8B4513]">
              {{
                1: "Requiere atención",
                2: "Regular",
                3: "Regular",
                4: "Bueno",
                5: "Excelente",
              }[hoverEstado || estadoMascota] || "Seleccionar estado"}
            </p>
          </div>
        </div>

        {/* CALIFICACIÓN DEL SEGUIMIENTO */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#8B4513]">
            Calificación del seguimiento
          </label>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => {
              const isActive = val <= (hoverRating || rating);

              return (
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
                  className={`clickable transition-transform hover:scale-110 ${
                    isActive ? "soft-bounce" : ""
                  }`}
                >
                  <PawPrint
                    size={30}
                    className={isActive ? "text-[#BC5F36]" : "text-gray-300"}
                  />
                </button>
              );
            })}
          </div>

          {errors.satisfaccion_adoptante && (
            <p className="text-red-600 text-xs">
              {String(errors.satisfaccion_adoptante.message)}
            </p>
          )}
        </div>
      </div>

      {/* PROBLEMAS REPORTADOS */}
      <div>
        <label className="text-xs font-semibold text-[#8B4513]">
          Problemas reportados (separados por comas)
        </label>
        <input
          {...register("problemas_reportados")}
          placeholder="tos, come poco, vomito"
          className="w-full p-2 rounded-lg bg-white border border-[#D9BDA3]"
        />
      </div>

      {/* FOTOS */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#8B4513]">
          Fotos del seguimiento
        </label>

        {/* DROPZONE */}
        <label
          className="
      relative w-full p-6 border-2 border-dashed rounded-xl bg-white
      flex flex-col items-center justify-center gap-2 cursor-pointer
      transition-all duration-200 ease-in-out
      hover:border-[#BC5F36] hover:bg-[#FFF1E8]/60
      hover:shadow-md
    "
          style={{ cursor: "pointer" }}
        >
          {/* ICONO */}
          <div
            className="
        flex items-center justify-center w-14 h-14 rounded-full
        bg-[#BC5F36]/10 text-[#BC5F36] transition-transform duration-200
        group-hover:scale-110
      "
          >
            <Upload size={30} className="dropzone-icon" />
          </div>

          <span className="text-xs text-gray-600 text-center">
            <strong className="text-[#BC5F36]">Haz clic</strong> para
            seleccionar fotos
            <br />o arrástralas aquí
          </span>

          <input
            type="file"
            multiple
            accept="image/*"
            {...register("fotos")}
            onChange={(e) => {
              handleFileChange(e);
              setValue("fotos", e.target.files);
            }}
            className="hidden"
          />
        </label>

        {previewUrls.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-2">
            {previewUrls.map((url, i) => (
              <div
                key={i}
                className="
          relative group
          w-20 h-20 rounded-lg overflow-hidden shadow
          border border-[#E3C9A8] bg-white
        "
              >
                <img src={url} className="w-full h-full object-cover" />

                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="
            absolute top-1 right-1 bg-red-600 text-white text-[10px]
            px-[6px] py-[1px] rounded-full shadow 
            opacity-80 hover:opacity-100 transition
          "
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end">
        <Button disabled={uploading} className="bg-[#BC5F36] text-white">
          {uploading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Guardar seguimiento"
          )}
        </Button>
      </div>
    </form>
  );
}
