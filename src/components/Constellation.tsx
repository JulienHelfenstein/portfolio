"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ProjectMeta } from "@/lib/projects";
import { domainColor } from "@/lib/domains";

type Props = { projects: ProjectMeta[]; domains: string[]; basePath: string };

type Hub = { domain: string; position: THREE.Vector3; color: string };
type Node = { project: ProjectMeta; position: THREE.Vector3; color: string };

// Pseudo-aléatoire déterministe : la constellation garde la même forme d'un rendu à l'autre.
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function layout(projects: ProjectMeta[], domains: string[]) {
  // Les domaines sont répartis sur une sphère (spirale de Fibonacci), les projets gravitent autour du premier.
  const hubs: Hub[] = domains.map((domain, i) => {
    const y = 1 - (i / Math.max(domains.length - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    return {
      domain,
      position: new THREE.Vector3(Math.cos(theta) * r, y * 0.6, Math.sin(theta) * r).multiplyScalar(4.2),
      color: domainColor(domain, domains),
    };
  });
  const hubByDomain = new Map(hubs.map((h) => [h.domain, h]));

  const nodes: Node[] = projects.map((project) => {
    const rand = seeded(project.slug);
    const linked = project.domains.map((d) => hubByDomain.get(d)).filter((h): h is Hub => !!h);
    const centre = new THREE.Vector3();
    for (const h of linked) centre.add(h.position);
    if (linked.length) centre.divideScalar(linked.length);
    const offset = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(1 + rand() * 1.4);
    return {
      project,
      position: centre.add(offset),
      color: linked[0]?.color ?? "#ffffff",
    };
  });

  const edges = nodes.flatMap((n) =>
    n.project.domains
      .map((d) => hubByDomain.get(d))
      .filter((h): h is Hub => !!h)
      .map((h) => ({ from: n.position, to: h.position, color: h.color, slug: n.project.slug, domain: h.domain })),
  );

  return { hubs, nodes, edges };
}

function Scene({ projects, domains, basePath, active, setActive }: Props & {
  active: string | null;
  setActive: (slug: string | null) => void;
}) {
  const router = useRouter();
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Desktop : la constellation se décale à droite pour laisser respirer le titre ; mobile : elle recule.
  const wide = viewport.width > 12;
  const { hubs, nodes, edges } = useMemo(() => layout(projects, domains), [projects, domains]);
  const activeProject = nodes.find((n) => n.project.slug === active)?.project;

  useFrame((state, delta) => {
    if (!group.current) return;
    // Rotation lente + parallaxe à la souris.
    group.current.rotation.y += delta * (active ? 0.02 : 0.06);
    const targetX = state.pointer.y * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
  });

  return (
    <group position={[wide ? viewport.width * 0.15 : 0, 0, wide ? 0 : -6]}>
    <group ref={group}>
      {edges.map((e) => {
        const lit = !active || e.slug === active || activeProject?.domains.includes(e.domain);
        return (
          <Line
            key={`${e.slug}-${e.domain}`}
            points={[e.from, e.to]}
            color={e.color}
            lineWidth={e.slug === active ? 2 : 1}
            transparent
            opacity={lit ? 0.45 : 0.06}
          />
        );
      })}

      {hubs.map((h) => (
        <group key={h.domain} position={h.position}>
          <mesh>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshBasicMaterial color={h.color} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshBasicMaterial color={h.color} transparent opacity={0.12} />
          </mesh>
          <Html center distanceFactor={9} position={[0, 0.6, 0]} style={{ pointerEvents: "none" }}>
            <span
              className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: h.color }}
            >
              {h.domain}
            </span>
          </Html>
        </group>
      ))}

      {nodes.map((n) => {
        const isActive = n.project.slug === active;
        const dimmed = active && !isActive;
        return (
          <group key={n.project.slug} position={n.position}>
            <mesh
              scale={isActive ? 1.8 : 1}
              onPointerOver={(e) => {
                e.stopPropagation();
                setActive(n.project.slug);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setActive(null);
                document.body.style.cursor = "";
              }}
              onClick={() => router.push(`${basePath}/${n.project.slug}`)}
            >
              <icosahedronGeometry args={[0.07 + n.project.featuredScore * 0.018, 1]} />
              <meshBasicMaterial color={n.color} transparent opacity={dimmed ? 0.3 : 1} />
            </mesh>
            {isActive && (
              <Html center distanceFactor={8} position={[0, 0.55, 0]} style={{ pointerEvents: "none" }}>
                <div className="w-56 rounded-xl border border-white/10 bg-black/80 p-3 text-left backdrop-blur">
                  <p className="font-display text-sm font-semibold text-white">{n.project.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-white/60">{n.project.tagline}</p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
    </group>
  );
}

export default function Constellation(props: Props) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <Canvas camera={{ position: [0, 0, 11], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Stars radius={60} depth={40} count={2500} factor={3} fade speed={0.6} />
      <Scene {...props} active={active} setActive={setActive} />
    </Canvas>
  );
}
