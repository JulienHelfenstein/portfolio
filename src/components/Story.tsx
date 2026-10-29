"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProjectMeta } from "@/lib/projects";
import { domainColor } from "@/lib/domains";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { featured: ProjectMeta[]; domains: string[]; basePath: string; stats: { label: string; value: number }[] };

export function Story({ featured, domains, basePath, stats }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Manifeste : les mots s'allument au fil du scroll.
      gsap.fromTo(
        ".story-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".story-manifest", start: "top 75%", end: "bottom 40%", scrub: true },
        },
      );

      // Compteurs.
      gsap.utils.toArray<HTMLElement>(".story-stat").forEach((el) => {
        const target = Number(el.dataset.value);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => (el.textContent = String(Math.round(counter.v))),
        });
      });

      // Projets phares : défilement horizontal épinglé (desktop uniquement).
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const slide = gsap.to(el, {
          x: () => -(el.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".story-pin",
            start: "top top",
            end: () => `+=${el.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".story-card").forEach((card) => {
          gsap.fromTo(card, { rotateY: -12, scale: 0.92 }, {
            rotateY: 0,
            scale: 1,
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "center center", scrub: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const manifest =
    "Chaque projet part d'un irritant métier. Je le cadre, je le prototype, je l'instrumente et je le rends démontrable, souvent en quelques semaines.";

  return (
    <div ref={root}>
      <section className="story-manifest mx-auto max-w-5xl px-4 py-32 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-2">Approche</p>
        <p className="mt-6 font-display text-3xl font-medium leading-tight sm:text-5xl">
          {manifest.split(" ").map((w, i) => (
            <span key={i} className="story-word">
              {w}{" "}
            </span>
          ))}
        </p>
        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-l border-border pl-4">
              <p className="story-stat font-display text-5xl font-semibold text-gradient" data-value={s.value}>
                {s.value}
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="story-pin relative overflow-hidden md:h-screen">
        <div className="px-4 pt-16 sm:px-10 md:absolute md:left-0 md:top-0 md:z-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-2">Projets phares</p>
        </div>
        <div
          ref={track}
          className="flex flex-col gap-6 px-4 py-10 sm:px-10 md:h-full md:w-max md:flex-row md:items-center md:gap-10 md:py-0"
          style={{ perspective: 1200 }}
        >
          {featured.map((p, i) => {
            const color = domainColor(p.domains[0] ?? "", domains);
            return (
              <Link
                key={p.slug}
                href={`${basePath}/${p.slug}`}
                className="story-card group relative flex w-full shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-8 transition-colors hover:border-white/30 md:h-[70vh] md:w-[min(42rem,70vw)]"
              >
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                  style={{ background: color }}
                />
                <div className="relative">
                  <p className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")} · {p.clientAlias} · {p.period}
                  </p>
                  <h3 className="mt-6 font-display text-3xl font-semibold sm:text-5xl">{p.title}</h3>
                  <p className="mt-4 max-w-lg text-lg text-muted">{p.tagline}</p>
                </div>
                <div className="relative mt-10">
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {p.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-2">
                        <span style={{ color }}>→</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.slice(0, 5).map((s) => (
                      <span key={s} className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="hidden w-[20vw] shrink-0 md:block" />
        </div>
      </section>
    </div>
  );
}
