import { z } from 'zod';
import { insertNoteSchema, insertLinkSchema, notes, links } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/notes',
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof notes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notes',
      input: insertNoteSchema,
      responses: {
        201: z.custom<typeof notes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/notes/:id',
      responses: {
        200: z.custom<typeof notes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/notes/:id',
      input: insertNoteSchema.partial(),
      responses: {
        200: z.custom<typeof notes.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/notes/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  graph: {
    get: {
      method: 'GET' as const,
      path: '/api/graph',
      responses: {
        200: z.object({
          nodes: z.array(z.object({ id: z.number(), label: z.string(), type: z.string() })),
          links: z.array(z.object({ source: z.number(), target: z.number(), type: z.string() })),
        }),
      },
    },
  },
  ai: {
    search: {
      method: 'POST' as const,
      path: '/api/ai/search',
      input: z.object({ query: z.string() }),
      responses: {
        200: z.array(z.custom<typeof notes.$inferSelect>()),
      },
    },
    chat: {
      method: 'POST' as const,
      path: '/api/ai/chat',
      input: z.object({ message: z.string() }),
      responses: {
        200: z.object({
          answer: z.string(),
          citedNotes: z.array(z.custom<typeof notes.$inferSelect>()),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
