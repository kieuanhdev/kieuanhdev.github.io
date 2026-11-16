import type { ReactNode } from "react";
import { cx } from "../lib/text.ts";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 md:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-16 md:py-24">
      <Container>
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            {title}
          </h2>
          {lede ? <p className="text-base leading-relaxed text-muted">{lede}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
