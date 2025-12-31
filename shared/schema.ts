import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("text").notNull(), // text, voice, clipper
  tags: text("tags").array(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").notNull(),
  targetId: integer("target_id").notNull(),
  type: text("type").default("manual"), // manual, ai_generated
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLinkSchema = createInsertSchema(links).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;

export type CreateNoteRequest = InsertNote;
export type UpdateNoteRequest = Partial<InsertNote>;

export type NoteResponse = Note;
export type NotesListResponse = Note[];

export interface GraphResponse {
  nodes: { id: number; label: string; type: string }[];
  links: { source: number; target: number; type: string }[];
}

export interface SearchRequest {
  query: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  citedNotes: Note[];
}
