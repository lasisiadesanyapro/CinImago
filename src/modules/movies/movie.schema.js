import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  genre: z.array(z.string()).optional(),
  releaseYear: z.number().int().optional(),
  director: z.string().optional(),
  posterUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

export const updateMovieSchema = movieSchema.partial();
