import { useQuery } from "@tanstack/react-query";
import { misCitasKeys } from "../queries/mis-citas-keys";
import { fetchMisCitas } from "../queries/mis-citas-queries";


export function useMisCitasQuery() {
    return useQuery({
        queryKey: misCitasKeys.all,
        queryFn: fetchMisCitas,
        staleTime: 1000 * 60,
        retry: false, 
    });
}
