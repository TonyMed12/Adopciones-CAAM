import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMascotaMutation } from "../queries/mascotas-queries";

export function useCreateMascota() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: unknown) => createMascotaMutation(payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["mascotas"] });
        },
    });
}
