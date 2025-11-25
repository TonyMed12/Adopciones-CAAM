import { useQuery } from "@tanstack/react-query";
import { fetchMascotasAdoptadas } from "../queries/usuarios-queries";

export function useMascotasAdoptadasQuery() {
  return useQuery({
    queryKey: ["usuario_mascotas_adoptadas"],
    queryFn: fetchMascotasAdoptadas
  });
}