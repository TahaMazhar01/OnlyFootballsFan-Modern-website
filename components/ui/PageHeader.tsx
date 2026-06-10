import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-pitch-gradient">
      <div className="container-page py-14 sm:py-20">
        <Reveal>
          {eyebrow && (
            <span className="chip mb-4 bg-white text-accent-dark shadow-soft ring-1 ring-accent/20">
              {eyebrow}
            </span>
          )}
          <h1 className="max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-xl text-muted">{subtitle}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
