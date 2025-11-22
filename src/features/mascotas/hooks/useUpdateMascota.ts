import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMascotaMutation } from "../queries/mascotas-queries";

export function useUpdateMascota() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: unknown) => updateMascotaMutation(payload),

        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ["mascotas"] });
            if (data?.id) {
                qc.invalidateQueries({ queryKey: ["mascota", data.id] });
            }
        },
    });
}
