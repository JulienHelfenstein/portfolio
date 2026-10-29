import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/projects";
import { ProjectDetail } from "@/components/ProjectDetail";

export function generateStaticParams() {
  return getProjects("private").map((p) => ({ slug: p.slug }));
}

export default async function PrivateProjectPage({ params }: PageProps<"/private/projects/[slug]">) {
  const project = getProject("private", (await params).slug);
  if (!project) notFound();
  return <ProjectDetail project={project} backHref="/private#projets" />;
}
