import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMascotaMutation } from "../queries/mascotas-queries";

export function useDeleteMascota() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMascotaMutation(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["mascotas"] });
        },
    });
}