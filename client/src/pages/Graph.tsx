import { useGraph } from "@/hooks/use-graph";
import { AppLayout } from "@/components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import ForceGraph2D from "react-force-graph-2d";
import { useTheme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

export default function Graph() {
  const { data: graphData, isLoading } = useGraph();
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  // Handle responsive resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const isDark = theme === "dark";
  const nodeColor = isDark ? "#ffffff" : "#171717";
  const linkColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const backgroundColor = isDark ? "#0a0a0a" : "#fafafa";

  return (
    <AppLayout>
      <header className="mb-6">
        <h1 className="text-4xl font-display font-medium text-foreground mb-2">Knowledge Graph</h1>
        <p className="text-muted-foreground">Visualize connections between your ideas.</p>
      </header>

      <div 
        ref={containerRef}
        className="h-[calc(100vh-250px)] w-full rounded-2xl border border-border overflow-hidden bg-card relative shadow-inner"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : null}

        {graphData && width > 0 && (
          <ForceGraph2D
            width={width}
            height={window.innerHeight - 250}
            graphData={graphData}
            backgroundColor={backgroundColor}
            nodeColor={() => nodeColor}
            linkColor={() => linkColor}
            nodeLabel="label"
            nodeRelSize={6}
            linkWidth={1}
            linkOpacity={0.5}
            onNodeClick={(node) => {
              if (node.id) setLocation(`/library?search=${encodeURIComponent(node.label as string)}`);
            }}
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        )}
      </div>
    </AppLayout>
  );
}
