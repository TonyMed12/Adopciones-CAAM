export const CitasVeterinariasKeys = {
  all: ["citas-veterinarias"] as const,

  admin: {
    all: () =>
      [...CitasVeterinariasKeys.all, "admin"] as const,

    infinite: (search?: string) =>
      [...CitasVeterinariasKeys.all, "admin", "infinite", search ?? ""] as const,
  },

  usuario: {
    all: (authId: string) =>
      [...CitasVeterinariasKeys.all, "usuario", authId] as const,

    infinite: (authId: string) =>
      [...CitasVeterinariasKeys.all, "usuario", authId, "infinite"] as const,
  },
};
