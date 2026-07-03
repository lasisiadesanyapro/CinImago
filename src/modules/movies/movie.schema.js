import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  genre: z
    .union([z.array(z.string()), z.string().transform((val) => [val])])
    .optional(),
  releaseYear: z.coerce.number().int().optional(),
  director: z.string().optional(),
});

export const updateMovieSchema = movieSchema.partial();
