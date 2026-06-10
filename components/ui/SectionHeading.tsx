import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <Reveal>
      <div
        className={`flex flex-col gap-4 ${
          centered
            ? "items-center text-center"
            : "sm:flex-row sm:items-end sm:justify-between"
        }`}
      >
        <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
          {eyebrow && (
            <span className="chip mb-3 bg-accent-soft text-accent-dark">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-lg text-muted">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  );
}
