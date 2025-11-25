export const adopcionesQueries = {
  all: ["adopciones"] as const,
  lists: () => [...adopcionesQueries.all, "list"] as const,
  list: (scope: "admin" | "usuario" | "public" = "public") =>
    [...adopcionesQueries.lists(), { scope }] as const,

  details: () => [...adopcionesQueries.all, "detail"] as const,
  detail: (id: string) => [...adopcionesQueries.details(), id] as const,
};
