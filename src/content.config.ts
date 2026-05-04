import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cursos = defineCollection({
  loader: glob({ base: "./src/content/cursos", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["Técnico", "Legal", "Tecnológico", "Ambiental"]),
    modality: z.enum(["Virtual", "Presencial", "Híbrido"]),
    image: z.string().url(),
    startDate: z.string(),
    hours: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const articulos = defineCollection({
  loader: glob({ base: "./src/content/articulos", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      "Noticias",
      "Análisis",
      "Eventos",
      "Capacitación",
    ]),
    excerpt: z.string(),
    date: z.string(),
    image: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cursos, articulos };
