import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActualizarPerfilMutation } from "./useActualizarPerfilMutation";
import type { Perfil } from "@/features/perfil/types/perfil";

export function usePerfilForm(
  perfil?: Perfil | null,
  onSuccess?: () => void
) {
  const actualizarPerfil = useActualizarPerfilMutation();

  const [formPerfil, setFormPerfil] = useState({
    ocupacion: "",
    telefono: "",
  });

  const [errorsPerfil, setErrorsPerfil] = useState<{ telefono?: string }>({});

  // 🔁 sync cuando llega el perfil
  useEffect(() => {
    if (perfil) {
      setFormPerfil({
        ocupacion: perfil.ocupacion ?? "",
        telefono: perfil.telefono ?? "",
      });
    }
  }, [perfil]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "");
      setFormPerfil((prev) => ({ ...prev, telefono: soloNumeros }));

      setErrorsPerfil(
        soloNumeros.length !== 10
          ? { telefono: "El teléfono debe tener 10 dígitos." }
          : {}
      );
      return;
    }

    setFormPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    if (!perfil?.id) return;

    actualizarPerfil.mutate(
      { id: perfil.id, data: formPerfil },
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
    formPerfil,
    errors: errorsPerfil,
    onChange,
    onSave,
    isSaving: actualizarPerfil.isPending,
  };
}
