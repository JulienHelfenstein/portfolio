import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/projects";
import { ProjectDetail } from "@/components/ProjectDetail";

export function generateStaticParams() {
  return getProjects("public").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject("public", (await params).slug);
  return project ? { title: project.title, description: project.tagline } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject("public", (await params).slug);
  if (!project) notFound();
  return <ProjectDetail project={project} backHref="/#projets" />;
}
