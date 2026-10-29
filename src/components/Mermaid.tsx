"use client";

import { useEffect, useId, useState } from "react";

// Rend un bloc ```mermaid des fiches ; mermaid est chargé à la demande (bibliothèque lourde).
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: { background: "transparent", primaryColor: "#161624", lineColor: "#7c5cff", fontFamily: "Arial, sans-serif", fontSize: "13px" },
        flowchart: { htmlLabels: false, padding: 12 },
      });
      try {
        const { svg } = await mermaid.render(`m${id}`, chart);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setSvg(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (!svg) {
    return <pre className="text-xs text-muted">{chart}</pre>;
  }
  return <div className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
