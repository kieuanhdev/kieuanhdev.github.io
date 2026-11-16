import type { ReactNode } from "react";
import { cx } from "../lib/text.ts";
import { Reveal } from "./fx.tsx";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 md:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  index,
  title,
  lede,
  children,
}: {
  id: string;
  index?: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative py-16 md:py-28">
      <Container>
        <div className="section-rule mb-12" aria-hidden="true" />
        <Reveal>
          <div className="mb-10 flex max-w-2xl flex-col gap-3">
            {index ? <p className="font-mono text-xs tracking-[0.22em] text-jade">{index}</p> : null}
            <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
              {title}
            </h2>
            {lede ? <p className="text-base leading-relaxed text-muted md:text-lg">{lede}</p> : null}
          </div>
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
