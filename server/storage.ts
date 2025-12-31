import { notes, links, type Note, type InsertNote, type Link, type InsertLink, type GraphResponse } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc } from "drizzle-orm";

export interface IStorage {
  getNotes(search?: string): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;
  
  getGraph(): Promise<GraphResponse>;
  createLink(link: InsertLink): Promise<Link>;
}

export class DatabaseStorage implements IStorage {
  async getNotes(search?: string): Promise<Note[]> {
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      return db.select()
        .from(notes)
        .where(
          or(
            ilike(notes.title, searchLower),
            ilike(notes.content, searchLower)
          )
        )
        .orderBy(desc(notes.updatedAt));
    }
    return db.select().from(notes).orderBy(desc(notes.updatedAt));
  }

  async getNote(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id: number, updates: Partial<InsertNote>): Promise<Note> {
    const [updated] = await db.update(notes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updated;
  }

  async deleteNote(id: number): Promise<void> {
    await db.delete(links).where(or(eq(links.sourceId, id), eq(links.targetId, id)));
    await db.delete(notes).where(eq(notes.id, id));
  }

  async getGraph(): Promise<GraphResponse> {
    const allNotes = await db.select().from(notes);
    const allLinks = await db.select().from(links);

    return {
      nodes: allNotes.map(n => ({ id: n.id, label: n.title, type: n.type })),
      links: allLinks.map(l => ({ source: l.sourceId, target: l.targetId, type: l.type })),
    };
  }

  async createLink(insertLink: InsertLink): Promise<Link> {
    const [link] = await db.insert(links).values(insertLink).returning();
    return link;
  }
}

export const storage = new DatabaseStorage();
