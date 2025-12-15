import { useQuery } from "@tanstack/react-query";
import { obtenerHorasOcupadas } from "../actions/horasOcupadas-action";

export function useHorasOcupadasQuery(fecha?: string) {
    return useQuery({
        queryKey: ["horas-ocupadas", fecha],
        queryFn: () => obtenerHorasOcupadas(fecha!),
        enabled: Boolean(fecha),
        staleTime: 1000 * 60 * 2,
    });
}
