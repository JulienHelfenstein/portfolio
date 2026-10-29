import { getProjects, toMeta, type Tier } from "@/lib/projects";
import { collectDomains } from "@/lib/domains";
import { profile } from "@/lib/profile";
import { Hero } from "./Hero";
import { Story } from "./Story";
import { ProjectGrid } from "./ProjectGrid";

// Accueil commun aux deux tiers : seules les données et le préfixe des liens changent.
export function HomePage({ tier }: { tier: Tier }) {
  const projects = getProjects(tier).map(toMeta);
  const domains = collectDomains(projects);
  const basePath = tier === "private" ? "/private/projects" : "/projects";

  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const featured = profile.featured.length
    ? profile.featured.map((s) => bySlug.get(s)).filter((p) => !!p)
    : [...projects].sort((a, b) => b.featuredScore - a.featuredScore).slice(0, 6);

  const stats = [
    { label: "projets livrés", value: projects.length },
    { label: "domaines couverts", value: domains.length },
    { label: "technos mobilisées", value: new Set(projects.flatMap((p) => p.stack)).size },
    { label: "secteurs", value: new Set(projects.map((p) => p.sector)).size },
  ];

  return (
    <main>
      <Hero
        name={profile.name}
        role={profile.role}
        pitch={profile.pitch}
        projects={projects}
        domains={domains}
        basePath={basePath}
        badge={tier === "private" ? "Accès privé" : undefined}
      />
      <Story featured={featured} domains={domains} basePath={basePath} stats={stats} />
      <ProjectGrid projects={projects} domains={domains} basePath={basePath} />
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-24 sm:px-10">
        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-14">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-2">Contact</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-5xl">
            Un irritant métier à transformer en produit IA ?
          </h2>
          <a
            href={`mailto:${profile.links.email}`}
            className="mt-8 inline-block break-all font-display text-xl text-gradient underline-offset-8 hover:underline sm:text-3xl"
          >
            {profile.links.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-muted hover:border-accent hover:text-foreground">
              LinkedIn ↗
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-muted hover:border-accent hover:text-foreground">
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
      <footer className="border-t border-border px-4 py-10 text-center font-mono text-xs text-muted sm:px-10">
        {profile.name}
      </footer>
    </main>
  );
}
