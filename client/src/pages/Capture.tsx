import { useState, useEffect } from "react";
import { useCreateNote } from "@/hooks/use-notes";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Save, Mic } from "lucide-react";
import { useLocation } from "wouter";

export default function Capture() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate: createNote, isPending } = useCreateNote();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    createNote(
      {
        title: title || "Untitled Note",
        content: content,
        type: "text",
        isFavorite: false,
        tags: [],
      },
      {
        onSuccess: () => {
          toast({ title: "Note captured", description: "Saved to your second brain." });
          setTitle("");
          setContent("");
          setLocation("/library");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to save note." });
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto h-[80vh] flex flex-col">
        <header className="mb-8 animate-enter" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl font-display font-medium text-foreground mb-2">Capture Thought</h1>
          <p className="text-muted-foreground">What's on your mind right now?</p>
        </header>

        <div className="flex-1 flex flex-col gap-6 animate-enter" style={{ animationDelay: "0.2s" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            className="text-2xl font-display font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 w-full"
            onKeyDown={handleKeyDown}
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your thoughts..."
            className="flex-1 w-full resize-none bg-transparent border-none outline-none text-lg leading-relaxed font-sans placeholder:text-muted-foreground/30"
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex justify-between items-center py-6 border-t border-border mt-4 animate-enter" style={{ animationDelay: "0.3s" }}>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Voice Note (Coming Soon)">
              <Mic className="w-5 h-5" />
            </button>
            <span className="text-xs text-muted-foreground flex items-center px-2">
              <code className="bg-secondary px-1.5 py-0.5 rounded text-[10px] mr-2">⌘ + Enter</code> to save
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={isPending || (!title && !content)}
            className="
              flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm
              bg-primary text-primary-foreground shadow-lg shadow-primary/20
              hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 hover:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
              transition-all duration-300 ease-out
            "
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Save Note <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
