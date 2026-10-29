// Couleur par domaine : partagée par la constellation, les filtres et les badges.
const PALETTE = ["#7c5cff", "#22d3ee", "#f472b6", "#34d399", "#fbbf24", "#fb7185", "#60a5fa", "#a3e635"];

export function domainColor(domain: string, allDomains: string[]): string {
  const index = allDomains.indexOf(domain);
  return PALETTE[(index < 0 ? 0 : index) % PALETTE.length];
}

export function collectDomains(projects: { domains: string[] }[]): string[] {
  const counts = new Map<string, number>();
  for (const p of projects) for (const d of p.domains) counts.set(d, (counts.get(d) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([d]) => d);
}
