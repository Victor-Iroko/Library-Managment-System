import { z } from 'zod';
import { alreadyExist } from '../../../utils/validation';
import { user, book, finePayment } from '@prisma/client';

/////////////////////////////////////////
// BORROWING SCHEMA
/////////////////////////////////////////

export const borrowingSchema = z.object({
  user_id: z.string().refine(async (val) => await alreadyExist<user>("user", "id", val), {message: "User does not exist"}),
  book_id: z.string().refine(async (val) => await alreadyExist<book>("book", "id", val), {message: "Book does not exist"}),
  borrow_date: z.string().date().transform((val) => new Date(val)),
  due_date: z.string().date().transform((val) => new Date(val)),
  return_date: z.string().date().transform((val) => new Date(val)).nullish(),
  returned: z.boolean(),
  fine: z.number().nullish(),
  paid: z.boolean().nullish(),
  payment_id: z.string().refine(async (val) => await alreadyExist<finePayment>("finePayment", "id", val), {message: "Payment does not exist"}).nullish(),
})

export type borrowing = z.infer<typeof borrowingSchema>

/////////////////////////////////////////
// BORROWING CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const borrowingCustomValidatorsSchema = borrowingSchema

export type borrowingCustomValidators = z.infer<typeof borrowingCustomValidatorsSchema>

/////////////////////////////////////////
// BORROWING PARTIAL SCHEMA
/////////////////////////////////////////

export const borrowingPartialSchema = borrowingSchema.partial()

export type borrowingPartial = z.infer<typeof borrowingPartialSchema>

/////////////////////////////////////////
// BORROWING OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const borrowingOptionalDefaultsSchema = borrowingSchema.merge(z.object({
  borrow_date: z.string().date().transform((val) => new Date(val)).optional(),
  returned: z.boolean().optional(),
}))

export type borrowingOptionalDefaults = z.infer<typeof borrowingOptionalDefaultsSchema>

export default borrowingSchema;
