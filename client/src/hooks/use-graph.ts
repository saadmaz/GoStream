import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useGraph() {
  return useQuery({
    queryKey: [api.graph.get.path],
    queryFn: async () => {
      const res = await fetch(api.graph.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch graph data");
      return api.graph.get.responses[200].parse(await res.json());
    },
  });
}
