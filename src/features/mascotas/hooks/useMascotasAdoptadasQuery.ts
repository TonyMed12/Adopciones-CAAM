import { useQuery } from "@tanstack/react-query";
import { fetchMascotasAdoptadas } from "../queries/mascotas-queries";

export function useMascotasAdoptadasQuery() {
  return useQuery({
    queryKey: ["usuario_mascotas_adoptadas"],
    queryFn: fetchMascotasAdoptadas
  });
}