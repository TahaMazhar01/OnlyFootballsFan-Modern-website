export type ClassValue = string | number | false | null | undefined;

/** Lightweight className joiner (clsx-style) — filters falsy values. */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
