import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMascotaMutation } from "../queries/mascotas-queries";
import type { Mascota } from "../types/mascotas";
import type { UpdateMascotaPayload } from "../data/types";

export function useUpdateMascota() {
    const qc = useQueryClient();

    return useMutation<Mascota, Error, UpdateMascotaPayload>({
        mutationFn: (payload) => updateMascotaMutation(payload),

        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ["mascotas"] });

            if (data?.id) {
                qc.invalidateQueries({ queryKey: ["mascota", data.id] });
            }
        },

        onError: (err) => {
            console.error("Error actualizando mascota:", err);
        },
        retry: 1,
    });
}
