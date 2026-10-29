"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { ProjectMeta } from "@/lib/projects";
import { domainColor } from "@/lib/domains";

type Props = { projects: ProjectMeta[]; domains: string[]; basePath: string };

export function ProjectGrid({ projects, domains, basePath }: Props) {
  const [domain, setDomain] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (domain && !p.domains.includes(domain)) return false;
      if (!q) return true;
      return [p.title, p.tagline, p.sector, ...p.stack, ...p.domains].join(" ").toLowerCase().includes(q);
    });
  }, [projects, domain, query]);

  return (
    <section id="projets" className="mx-auto max-w-7xl px-4 py-32 sm:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-2">Tous les projets</p>
      <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">L&apos;atelier complet</h2>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip label="Tout" active={!domain} onClick={() => setDomain(null)} />
          {domains.map((d) => (
            <FilterChip key={d} label={d} color={domainColor(d, domains)} active={domain === d} onClick={() => setDomain(d)} />
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une techno, un secteur…"
          className="w-full rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none placeholder:text-muted focus:border-accent md:w-72"
        />
      </div>

      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => {
            const color = domainColor(p.domains[0] ?? "", domains);
            return (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard color={color}>
                  <Link href={`${basePath}/${p.slug}`} className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                      <span>{p.sector}</span>
                      <span>{p.status}</span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{p.tagline}</p>
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 4).map((s) => (
                        <span key={s} className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] text-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && <p className="mt-10 text-muted">Aucun projet ne correspond.</p>}
    </section>
  );
}

function FilterChip({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
        active ? "border-transparent text-black" : "border-border text-muted hover:text-foreground"
      }`}
    >
      {active && (
        <motion.span
          layoutId="filter-pill"
          className="absolute inset-0 rounded-full"
          style={{ background: color ?? "var(--foreground)" }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative">{label}</span>
    </button>
  );
}

// Carte qui s'incline vers le curseur, avec un halo qui le suit.
function TiltCard({ children, color }: { children: React.ReactNode; color: string }) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        setStyle({
          transform: `perspective(800px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg)`,
          background: `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, ${color}22, transparent 60%), var(--surface)`,
        });
      }}
      onPointerLeave={() => setStyle({})}
      style={style}
      className="h-full rounded-2xl border border-border bg-surface transition-[transform,border-color] duration-200 ease-out hover:border-white/25"
    >
      {children}
    </div>
  );
}
