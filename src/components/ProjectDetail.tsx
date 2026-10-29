import Link from "next/link";
import { isValidElement, type ReactElement } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Project } from "@/lib/projects";
import { Mermaid } from "./Mermaid";
import { Reveal } from "./Reveal";

const components = {
  pre: ({ children, ...props }: React.ComponentProps<"pre">) => {
    const code = isValidElement(children) ? (children as ReactElement<{ className?: string; children?: string }>) : null;
    if (code?.props.className?.includes("language-mermaid")) {
      return <Mermaid chart={String(code.props.children ?? "").trim()} />;
    }
    return <pre {...props}>{children}</pre>;
  },
};

// Les fiches contiennent des commentaires HTML <!-- TODO --> que MDX ne sait pas parser.
function stripHtmlComments(source: string) {
  return source.replace(/<!--[\s\S]*?-->/g, "");
}

export function ProjectDetail({ project, backHref }: { project: Project; backHref: string }) {
  const facts = [
    ["Client", project.client ?? project.clientAlias],
    ["Secteur", project.sector],
    ["Période", project.period],
    ["Statut", project.status],
    ["Équipe", project.team],
  ].filter(([, v]) => v && !/^TODO/i.test(v));

  return (
    <main className="mx-auto max-w-4xl px-4 pb-32 pt-10 sm:px-10">
      <Link href={backHref} className="font-mono text-xs text-muted hover:text-foreground">
        ← Retour à la constellation
      </Link>

      <Reveal>
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-accent-2">{project.domains.join(" · ")}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-6xl">{project.title}</h1>
        <p className="mt-5 text-xl text-muted">{project.tagline}</p>
      </Reveal>

      <Reveal delay={0.15}>
        <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-5">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{k}</dt>
              <dd className="mt-1 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted">
              {s}
            </span>
          ))}
        </div>
      </Reveal>

      <article className="prose-project mt-8">
        <MDXRemote
          source={stripHtmlComments(project.body)}
          components={components}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], format: "md" } }}
        />
      </article>
    </main>
  );
}
