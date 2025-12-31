import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Note, type InsertNote, type NoteResponse } from "@shared/routes";

// ============================================
// HOOKS FOR NOTES API
// ============================================

export function useNotes(search?: string) {
  return useQuery({
    queryKey: [api.notes.list.path, search],
    queryFn: async () => {
      const url = search 
        ? `${api.notes.list.path}?search=${encodeURIComponent(search)}`
        : api.notes.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      
      const data = await res.json();
      return api.notes.list.responses[200].parse(data);
    },
  });
}

export function useNote(id: number | null) {
  return useQuery({
    queryKey: [api.notes.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.notes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch note");
      return api.notes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: InsertNote) => {
      const validated = api.notes.create.input.parse(note);
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.notes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create note");
      }
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertNote>) => {
      const validated = api.notes.update.input.parse(updates);
      const url = buildUrl(api.notes.update.path, { id });
      
      const res = await fetch(url, {
        method: api.notes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Note not found");
        if (res.status === 400) throw new Error("Validation failed");
        throw new Error("Failed to update note");
      }
      return api.notes.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.notes.get.path, data.id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.notes.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
    },
  });
}
