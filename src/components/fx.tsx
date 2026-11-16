import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { usePreferences } from "../context/preferences-context.ts";
import { formatNumber } from "../lib/format.ts";
import { cx } from "../lib/text.ts";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion() === true;
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion() === true;
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Typewriter({ phrases }: { phrases: readonly string[] }) {
  return <TypewriterRun key={phrases.join("\n")} phrases={phrases} />;
}

function TypewriterRun({ phrases }: { phrases: readonly string[] }) {
  const reduced = useReducedMotion() === true;
  const phraseKey = phrases.join("\n");
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const list = phraseKey.split("\n").filter((item) => item.length > 0);
    if (reduced || list.length === 0) return;

    let phrase = 0;
    let cursor = 0;
    let deleting = false;
    let timer = 0;

    const step = () => {
      const current = list[phrase] ?? "";
      if (!deleting) {
        if (cursor < current.length) {
          cursor += 1;
          setCount(cursor);
          timer = window.setTimeout(step, cursor === current.length ? 1500 : 46);
          return;
        }
        deleting = true;
        timer = window.setTimeout(step, 28);
        return;
      }
      if (cursor > 0) {
        cursor -= 1;
        setCount(cursor);
        timer = window.setTimeout(step, 24);
        return;
      }
      deleting = false;
      phrase = (phrase + 1) % list.length;
      setIndex(phrase);
      timer = window.setTimeout(step, 280);
    };

    timer = window.setTimeout(step, 280);
    return () => window.clearTimeout(timer);
  }, [phraseKey, reduced]);

  const full = phrases[0] ?? "";
  const shown = reduced ? full : (phrases[index] ?? "").slice(0, count);

  return (
    <span className="typewriter">
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {shown}
        {reduced ? null : <span className="type-caret" />}
      </span>
    </span>
  );
}

export function CountUp({ value }: { value: number }) {
  const { locale } = usePreferences();
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLSpanElement>(null);
  const label = formatNumber(value, locale);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = label;
      return;
    }

    let raf = 0;
    let start = 0;
    const duration = 1100;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = formatNumber(Math.round(value * eased), locale);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [label, locale, reduced, value]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={label}>
      {reduced ? label : formatNumber(0, locale)}
    </span>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion() === true;
  if (reduced) return null;
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() === true;

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;
    let running = true;

    const onMove = (event: globalThis.PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      el.dataset.on = "true";
    };
    const loop = () => {
      if (!running) return;
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx - 18}px, ${cy - 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() === true;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: globalThis.PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 28;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    parent.addEventListener("pointermove", onMove);
    return () => parent.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />
    </div>
  );
}

type Dot = { x: number; y: number; vx: number; vy: number; r: number };

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() === true;

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(max-width: 767px)");
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let looping = false;

    const make = () => {
      const count = media.matches ? 16 : 42;
      dots = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0002,
        vy: (Math.random() - 0.5) * 0.0002,
        r: Math.random() * 1.4 + 0.4,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      if (!visible) {
        looping = false;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const dark = document.documentElement.classList.contains("dark");
      const color = dark ? "rgba(255, 236, 214, 0.8)" : "rgba(48, 36, 24, 0.5)";
      const link = dark ? "rgba(61, 222, 192, 0.32)" : "rgba(14, 124, 104, 0.22)";

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > 1) dot.vx *= -1;
        if (dot.y < 0 || dot.y > 1) dot.vy *= -1;
      }

      if (!media.matches) {
        for (let a = 0; a < dots.length; a += 1) {
          for (let b = a + 1; b < dots.length; b += 1) {
            const dx = (dots[a].x - dots[b].x) * width;
            const dy = (dots[a].y - dots[b].y) * height;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
              ctx.globalAlpha = 1 - dist / 120;
              ctx.strokeStyle = link;
              ctx.beginPath();
              ctx.moveTo(dots[a].x * width, dots[a].y * height);
              ctx.lineTo(dots[b].x * width, dots[b].y * height);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x * width, dot.y * height, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (looping) return;
      looping = true;
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      visible = document.visibilityState === "visible";
      if (!visible) {
        cancelAnimationFrame(raf);
        looping = false;
        return;
      }
      start();
    };

    make();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting) && document.visibilityState === "visible";
      if (!visible) {
        cancelAnimationFrame(raf);
        looping = false;
        return;
      }
      start();
    });
    io.observe(canvas);
    media.addEventListener("change", make);
    document.addEventListener("visibilitychange", sync);
    start();

    return () => {
      cancelAnimationFrame(raf);
      looping = false;
      ro.disconnect();
      io.disconnect();
      media.removeEventListener("change", make);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() === true;

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  function onMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  }

  return (
    <div
      ref={ref}
      className={cx("tilt-card", className)}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}

export function Marquee({ items }: { items: readonly string[] }) {
  const reduced = useReducedMotion() === true;
  if (reduced) return null;

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-2 pr-2">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="chip">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LocaleWash() {
  const { locale } = usePreferences();
  const reduced = useReducedMotion() === true;
  const [seen, setSeen] = useState(locale);
  const [shown, setShown] = useState<string | null>(null);

  if (seen !== locale) {
    setSeen(locale);
    if (!reduced) setShown(locale);
  }

  return (
    <AnimatePresence>
      {shown ? (
        <motion.div
          key={shown}
          className="pointer-events-none fixed inset-0 z-50 bg-paper"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease }}
          onAnimationComplete={() => setShown(null)}
        />
      ) : null}
    </AnimatePresence>
  );
}
