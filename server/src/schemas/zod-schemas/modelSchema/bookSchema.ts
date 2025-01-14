import { z } from 'zod';
import { genreEnumSchema } from '../inputTypeSchemas/genreEnumSchema'

/////////////////////////////////////////
// BOOK SCHEMA
/////////////////////////////////////////

export const bookSchema = z.object({
  genre: genreEnumSchema,
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  author: z.string().min(1).max(50),
  available_copies: z.number().min(0),
  avg_rating: z.number().min(0).max(5).nullish(),
  publication_year: z.string().date().transform((val) => new Date(val)),
  description: z.string().min(10).max(1000),
  cover_image: z.string().url().nullish(),
})

export type book = z.infer<typeof bookSchema>

/////////////////////////////////////////
// BOOK PARTIAL SCHEMA
/////////////////////////////////////////

export const bookPartialSchema = bookSchema.partial()

export type bookPartial = z.infer<typeof bookPartialSchema>

/////////////////////////////////////////
// BOOK OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const bookOptionalDefaultsSchema = bookSchema.merge(z.object({
  id: z.string().uuid().optional(),
  available_copies: z.number().min(0).optional(),
}))

export type bookOptionalDefaults = z.infer<typeof bookOptionalDefaultsSchema>

export default bookSchema;
