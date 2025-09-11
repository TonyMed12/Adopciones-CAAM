import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/** Combina clases y resuelve conflictos de Tailwind */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
