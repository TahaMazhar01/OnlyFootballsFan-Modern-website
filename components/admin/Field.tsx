import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-base font-bold text-ink">
        {label}
      </span>
      {hint && <span className="mb-2 block text-sm text-muted">{hint}</span>}
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20";
