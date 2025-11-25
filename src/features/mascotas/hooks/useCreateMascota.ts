import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMascotaMutation } from "../queries/mascotas-queries";
import type { Mascota } from "../types/mascotas";
import type { CreateMascotaPayload } from "../data/types";

export function useCreateMascota() {
    const qc = useQueryClient();

    return useMutation<Mascota, Error, CreateMascotaPayload>({
        mutationFn: (payload) => createMascotaMutation(payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["mascotas"] });
        },

        onError: (err) => {
            console.error("Error creando mascota:", err.message);
        },
        retry: 1,
    });
}
