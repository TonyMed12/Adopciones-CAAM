export const citasKeys = {
    all: ["citas"] as const,

    list: () => [...citasKeys.all, "list"] as const,

    byRange: (from: string, to: string) =>
        [...citasKeys.all, "range", from, to] as const,
};
