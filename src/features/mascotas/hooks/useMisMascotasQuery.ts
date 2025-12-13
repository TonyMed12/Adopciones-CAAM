import { useQuery } from "@tanstack/react-query";
import { obtenerMascotasAdoptadas } from "@/features/usuarios/actions/usuario-mascotas-actions";

export function useMisMascotasQuery() {
  return useQuery({
    queryKey: ["mis-mascotas"],
    queryFn: async () => {
      const data = await obtenerMascotasAdoptadas();
      if (!data) {
        throw new Error("No se devolvieron mascotas adoptadas");
      }
      return data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
