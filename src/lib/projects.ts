import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Tier = "public" | "private";

export type ProjectMeta = {
  slug: string;
  title: string;
  tagline: string;
  client?: string;
  clientAlias: string;
  sector: string;
  period: string;
  status: string;
  role: string;
  team: string;
  domains: string[];
  stack: string[];
  highlights: string[];
  metrics: string[];
  featuredScore: number;
  confidential: boolean;
};

export type Project = ProjectMeta & { body: string };

const CONTENT_DIR = path.join(process.cwd(), "content");

function asStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function readProject(tier: Tier, file: string): Project {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, tier, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: String(data.slug ?? file.replace(/\.mdx?$/, "")),
    title: String(data.title ?? ""),
    tagline: String(data.tagline ?? ""),
    // Le nom du client ne sort jamais du tier privé, même si une fiche publique le contient par erreur.
    client: tier === "private" && data.client ? String(data.client) : undefined,
    clientAlias: String(data.clientAlias ?? ""),
    sector: String(data.sector ?? ""),
    period: String(data.period ?? ""),
    status: String(data.status ?? ""),
    role: String(data.role ?? ""),
    team: String(data.team ?? ""),
    domains: asStrings(data.domains),
    stack: asStrings(data.stack),
    highlights: asStrings(data.highlights),
    metrics: asStrings(data.metrics),
    featuredScore: Number(data.featuredScore ?? 1),
    confidential: Boolean(data.confidential),
    body: content,
  };
}

export function getProjects(tier: Tier): Project[] {
  const dir = path.join(CONTENT_DIR, tier);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => readProject(tier, f))
    .sort((a, b) => b.period.localeCompare(a.period));
}

export function getProject(tier: Tier, slug: string): Project | undefined {
  return getProjects(tier).find((p) => p.slug === slug);
}

/** Métadonnées seules : c'est tout ce qui part vers les composants client. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function toMeta({ body, ...meta }: Project): ProjectMeta {
  return meta;
}
