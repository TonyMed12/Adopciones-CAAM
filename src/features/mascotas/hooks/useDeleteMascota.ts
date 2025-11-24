import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMascotaMutation } from "../queries/mascotas-queries";
import { toast } from "sonner";

export function useDeleteMascota() {
    const qc = useQueryClient();

    return useMutation<
        { success: boolean; reason?: string },
        Error,
        string
    >({
        mutationFn: (id) => deleteMascotaMutation(id),

        onSuccess: (res) => {
            if (!res.success) {
                switch (res.reason) {
                    case "no_eliminable":
                        toast.error("Esta mascota no se puede eliminar porque está en proceso o ya fue adoptada.");
                        break;

                    case "no_existe":
                        toast.error("La mascota no existe.");
                        break;

                    case "error_estado":
                        toast.error("No se pudo validar el estado de la mascota.");
                        break;

                    case "error_eliminar":
                        toast.error("Ocurrió un error al eliminar la mascota.");
                        break;

                    default:
                        toast.error("No se pudo eliminar la mascota.");
                }
                return;
            }

            toast.success("Mascota eliminada correctamente");
            qc.invalidateQueries({ queryKey: ["mascotas"] });
        },

        onError: (err) => {
            console.error("Error eliminando mascota:", err.message);
        },
        retry: 1,
    });
}
