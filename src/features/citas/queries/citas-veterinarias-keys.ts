export const CitasVeterinariasKeys = {
  all: ["citas-veterinarias"] as const,

  admin: {
    all: () => [...CitasVeterinariasKeys.all, "admin"] as const,
  },

  usuario: {
    all: (authId: string) =>
      [...CitasVeterinariasKeys.all, "usuario", authId] as const,
  },
};
