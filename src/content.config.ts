import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    year: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()),
    role: z.string(),
    challenge: z.string(),
    outcome: z.string(),
    outcomeLabel: z.string(),
    status: z.enum(['ready', 'needs-update']).default('needs-update'),
  }),
});

export const collections = { projects };
