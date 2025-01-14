import { z } from 'zod';
import { alreadyExist } from '../../../utils/validation';
import { isbn, book } from '@prisma/client';

/////////////////////////////////////////
// ISBN SCHEMA
/////////////////////////////////////////

export const isbnSchema = z.object({
  isbn: z.string().regex(/^[0-9]{10,13}$/).refine(async (val) => !(await alreadyExist<isbn>("isbn", "isbn", val)), {message: "ISBN does not exist"}),
  book_id: z.string().refine(async (val) => await alreadyExist<book>("book", "id", val), {message: "Book does not exist"}),
})

export type isbnSchema = z.infer<typeof isbnSchema>

/////////////////////////////////////////
// ISBN CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const isbnCustomValidatorsSchema = isbnSchema

export type isbnCustomValidators = z.infer<typeof isbnCustomValidatorsSchema>

/////////////////////////////////////////
// ISBN PARTIAL SCHEMA
/////////////////////////////////////////

export const isbnPartialSchema = isbnSchema.partial()

export type isbnPartial = z.infer<typeof isbnPartialSchema>

/////////////////////////////////////////
// ISBN OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const isbnOptionalDefaultsSchema = isbnSchema.merge(z.object({
}))

export type isbnOptionalDefaults = z.infer<typeof isbnOptionalDefaultsSchema>

export default isbnSchema;
