import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Notes API
  app.get(api.notes.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const notes = await storage.getNotes(search);
    res.json(notes);
  });

  app.post(api.notes.create.path, async (req, res) => {
    try {
      const input = api.notes.create.input.parse(req.body);
      const note = await storage.createNote(input);
      
      // Auto-link logic (Mock/Simple for V1)
      // In a real app, this would use embeddings to find related notes
      const allNotes = await storage.getNotes();
      const related = allNotes.filter(n => n.id !== note.id && (
        n.content.includes(note.title) || note.content.includes(n.title)
      ));
      
      for (const rel of related) {
        await storage.createLink({
          sourceId: note.id,
          targetId: rel.id,
          type: "ai_generated"
        });
      }

      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.notes.get.path, async (req, res) => {
    const note = await storage.getNote(Number(req.params.id));
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  });

  app.put(api.notes.update.path, async (req, res) => {
    try {
      const input = api.notes.update.input.parse(req.body);
      const note = await storage.updateNote(Number(req.params.id), input);
      res.json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    }
  });

  app.delete(api.notes.delete.path, async (req, res) => {
    await storage.deleteNote(Number(req.params.id));
    res.status(204).send();
  });

  // Graph API
  app.get(api.graph.get.path, async (req, res) => {
    const graph = await storage.getGraph();
    res.json(graph);
  });

  // AI Chat API ("Ask Your Brain")
  app.post(api.ai.chat.path, async (req, res) => {
    try {
      const { message } = api.ai.chat.input.parse(req.body);

      // 1. Retrieval (RAG)
      // Simple keyword search for now. Ideally vector search.
      const keywords = message.split(" ").filter(w => w.length > 3);
      const relevantNotes = await storage.getNotes(keywords[0] || undefined);
      const contextDocs = relevantNotes.slice(0, 5); // Top 5 relevant

      const contextText = contextDocs.map(n => `[Note ${n.id}: ${n.title}] ${n.content}`).join("\n\n");

      // 2. Generation
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a 'Second Brain' assistant. Answer the user's question based strictly on the provided context notes. Cite your sources." },
          { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${message}` }
        ],
      });

      const answer = response.choices[0].message.content || "I couldn't find an answer in your notes.";

      res.json({
        answer,
        citedNotes: contextDocs
      });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const notes = await storage.getNotes();
  if (notes.length === 0) {
    console.log("Seeding database...");
    const n1 = await storage.createNote({
      title: "Project Phoenix Ideas",
      content: "Main goal: Build a personal intelligence system. Needs to be fast and frictionless.",
      type: "text",
      tags: ["project", "dev"]
    });
    const n2 = await storage.createNote({
      title: "Meeting with Sarah",
      content: "Discussed the marketing strategy for Phoenix. She suggested focusing on 'builders' as the niche.",
      type: "text",
      tags: ["meeting", "marketing"]
    });
    const n3 = await storage.createNote({
      title: "Tech Stack Thoughts",
      content: "Using Node.js for V1 for speed. Maybe Go for V2. OpenAI for intelligence.",
      type: "text",
      tags: ["tech", "dev"]
    });
    
    // Create some links
    await storage.createLink({ sourceId: n1.id, targetId: n2.id, type: "manual" });
    await storage.createLink({ sourceId: n1.id, targetId: n3.id, type: "ai_generated" });
  }
}
