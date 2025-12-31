import { format } from "date-fns";
import { Star, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { type Note } from "@shared/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
  onToggleFavorite?: (note: Note) => void;
}

export function NoteCard({ note, onDelete, onEdit, onToggleFavorite }: NoteCardProps) {
  return (
    <div className="group relative bg-card hover:bg-accent/5 transition-all duration-300 rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 cursor-pointer flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 
          onClick={() => onEdit(note)}
          className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2"
        >
          {note.title}
        </h3>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {note.isFavorite && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 hover:bg-secondary rounded-md outline-none">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(note)} className="cursor-pointer">
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              {onToggleFavorite && (
                <DropdownMenuItem onClick={() => onToggleFavorite(note)} className="cursor-pointer">
                  <Star className="w-4 h-4 mr-2" /> {note.isFavorite ? 'Unfavorite' : 'Favorite'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p 
        onClick={() => onEdit(note)}
        className="text-muted-foreground text-sm line-clamp-4 leading-relaxed font-sans mb-4 flex-grow"
      >
        {note.content}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
        <span className="font-mono">{format(new Date(note.createdAt || new Date()), "MMM d, yyyy")}</span>
        <span className="px-2 py-1 bg-secondary rounded-full text-[10px] uppercase tracking-wider font-semibold">
          {note.type}
        </span>
      </div>
    </div>
  );
}
