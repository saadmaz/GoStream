import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAiChat() {
  return useMutation({
    mutationFn: async (message: string) => {
      const validated = api.ai.chat.input.parse({ message });
      const res = await fetch(api.ai.chat.path, {
        method: api.ai.chat.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("AI chat failed");
      return api.ai.chat.responses[200].parse(await res.json());
    },
  });
}

export function useAiSearch() {
  return useMutation({
    mutationFn: async (query: string) => {
      const validated = api.ai.search.input.parse({ query });
      const res = await fetch(api.ai.search.path, {
        method: api.ai.search.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("AI search failed");
      return api.ai.search.responses[200].parse(await res.json());
    },
  });
}
