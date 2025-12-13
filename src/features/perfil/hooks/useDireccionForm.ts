import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGuardarDireccionMutation } from "./useGuardarDireccionMutation";
import type { Direccion } from "@/features/perfil/types/perfil";

export function useDireccionForm(
  direccion?: Direccion | null,
  usuarioId?: string,
  onSuccess?: () => void
) {
  const guardarDireccion = useGuardarDireccionMutation();

  const [formDir, setFormDir] = useState<Partial<Direccion>>({
    pais: "México",
  });

  // 🔁 sync
  useEffect(() => {
    if (direccion) {
      setFormDir(direccion);
    }
  }, [direccion]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormDir((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    if (!usuarioId) return;

    guardarDireccion.mutate(
      {
        ...formDir,
        usuario_id: usuarioId,
        direccion_principal: true,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: () => {
        },
      }
    );
  };

  return {
    formDir,
    onChange,
    onSave,
    isSaving: guardarDireccion.isPending,
  };
}
