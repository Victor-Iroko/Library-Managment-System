import { z } from 'zod';
import { alreadyExist } from '../../../utils/validation';
import { user, book } from '@prisma/client';

/////////////////////////////////////////
// CART SCHEMA
/////////////////////////////////////////

export const cartSchema = z.object({
  user_id: z.string().refine(async (val) => await alreadyExist<user>("user", "id", val), {message: "User does not exist"}),
  book_id: z.string().refine(async (val) => await alreadyExist<book>("book", "id", val), {message: "Book does not exist"}),
  added_date: z.string().date().transform((val) => new Date(val)),
})

export type cart = z.infer<typeof cartSchema>

/////////////////////////////////////////
// CART CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const cartCustomValidatorsSchema = cartSchema

export type cartCustomValidators = z.infer<typeof cartCustomValidatorsSchema>

/////////////////////////////////////////
// CART PARTIAL SCHEMA
/////////////////////////////////////////

export const cartPartialSchema = cartSchema.partial()

export type cartPartial = z.infer<typeof cartPartialSchema>

/////////////////////////////////////////
// CART OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const cartOptionalDefaultsSchema = cartSchema.merge(z.object({
  added_date: z.string().date().transform((val) => new Date(val)).optional(),
}))

export type cartOptionalDefaults = z.infer<typeof cartOptionalDefaultsSchema>

export default cartSchema;
