import { z } from 'zod';
import { alreadyExist } from '../../../utils/validation';
import { user, book } from '@prisma/client';

/////////////////////////////////////////
// READ HISTORY SCHEMA
/////////////////////////////////////////

export const readHistorySchema = z.object({
  user_id: z.string().refine(async (val) => await alreadyExist<user>("user", "id", val), {message: "User does not exist"}),
  book_id: z.string().refine(async (val) => await alreadyExist<book>("book", "id", val), {message: "Book does not exist"}),
  finished: z.boolean(),
  rating: z.number().min(0).max(5).nullish(),
  review: z.string().min(1).max(500).nullish(),
})

export type readHistory = z.infer<typeof readHistorySchema>

/////////////////////////////////////////
// READ HISTORY CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const readHistoryCustomValidatorsSchema = readHistorySchema

export type readHistoryCustomValidators = z.infer<typeof readHistoryCustomValidatorsSchema>

/////////////////////////////////////////
// READ HISTORY PARTIAL SCHEMA
/////////////////////////////////////////

export const readHistoryPartialSchema = readHistorySchema.partial()

export type readHistoryPartial = z.infer<typeof readHistoryPartialSchema>

/////////////////////////////////////////
// READ HISTORY OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const readHistoryOptionalDefaultsSchema = readHistorySchema.merge(z.object({
  finished: z.boolean().optional(),
}))

export type readHistoryOptionalDefaults = z.infer<typeof readHistoryOptionalDefaultsSchema>

export default readHistorySchema;
