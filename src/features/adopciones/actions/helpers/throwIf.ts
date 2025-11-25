export function throwIf(error: any) {
  if (error) throw new Error(error.message);
}
