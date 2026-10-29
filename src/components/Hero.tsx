"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { ProjectMeta } from "@/lib/projects";

// three.js n'a rien à faire côté serveur : la scène est chargée uniquement dans le navigateur.
const Constellation = dynamic(() => import("./Constellation"), { ssr: false });

type Props = {
  name: string;
  role: string;
  pitch: string;
  projects: ProjectMeta[];
  domains: string[];
  basePath: string;
  badge?: string;
};

export function Hero({ name, role, pitch, projects, domains, basePath, badge }: Props) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Constellation projects={projects} domains={domains} basePath={basePath} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent md:via-background/30" />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-4 py-8 sm:px-10">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted"
        >
          <span>{name}</span>
          {badge && <span className="rounded-full border border-accent/50 px-3 py-1 text-accent">{badge}</span>}
        </motion.header>

        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-mono text-sm text-accent-2"
          >
            {role}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
          >
            {projects.length} projets,
            <br />
            <span className="text-gradient">une constellation.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-5 max-w-xl text-base text-muted sm:text-lg"
          >
            {pitch}
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="font-mono text-xs text-muted"
        >
          Survole un nœud, clique pour ouvrir · Scrolle pour l&apos;histoire ↓
        </motion.p>
      </div>
    </section>
  );
}
