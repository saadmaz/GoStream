import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNotes, useDeleteNote, useUpdateNote } from "@/hooks/use-notes";
import { NoteCard } from "@/components/ui/NoteCard";
import { Loader2, Search, SlidersHorizontal, Plus } from "lucide-react";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@shared/routes";

export default function Library() {
  const [search, setSearch] = useState("");
  const { data: notes, isLoading } = useNotes(search);
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();
  
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    
    updateNote({ 
      id: editingNote.id, 
      title: editingNote.title, 
      content: editingNote.content 
    });
    setEditingNote(null);
  };

  return (
    <AppLayout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-display font-medium text-foreground mb-2">My Library</h1>
          <p className="text-muted-foreground">Your collection of thoughts and ideas.</p>
        </div>
        
        <Link href="/">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> New Note
          </button>
        </Link>
      </header>

      <div className="relative mb-8 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search by keyword, concept, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
        </div>
      ) : notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl bg-secondary/5">
          <p className="text-muted-foreground font-medium">No notes found</p>
          <Link href="/">
            <span className="text-primary hover:underline mt-2 cursor-pointer text-sm">Create your first note</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {notes?.map((note) => (
            <div key={note.id} className="animate-enter" style={{ animationDelay: `${note.id * 0.05}s` }}>
              <NoteCard
                note={note}
                onDelete={(id) => deleteNote(id)}
                onEdit={(note) => setEditingNote(note)}
                onToggleFavorite={(note) => updateNote({ id: note.id, isFavorite: !note.isFavorite })}
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <form onSubmit={handleEditSave} className="flex flex-col gap-4 mt-4">
              <Input
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="font-display font-medium text-lg"
                placeholder="Title"
              />
              <Textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="min-h-[300px] font-sans text-base leading-relaxed resize-none"
                placeholder="Content..."
              />
              <div className="flex justify-end gap-3 mt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
