import { z } from 'zod';
import { reservationStatusEnumSchema } from '../inputTypeSchemas/reservationStatusEnumSchema'
import { alreadyExist } from '../../../utils/validation';
import { user, book } from '@prisma/client';

/////////////////////////////////////////
// RESERVATION SCHEMA
/////////////////////////////////////////

export const reservationSchema = z.object({
  reservation_status: reservationStatusEnumSchema,
  user_id: z.string().refine(async (val) => await alreadyExist<user>("user", "id", val), {message: "User does not exist"}),
  book_id: z.string().refine(async (val) => await alreadyExist<book>("book", "id", val), {message: "Book does not exist"}),
  reservation_date: z.string().date().transform((val) => new Date(val)),
})

export type reservation = z.infer<typeof reservationSchema>

/////////////////////////////////////////
// RESERVATION CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const reservationCustomValidatorsSchema = reservationSchema

export type reservationCustomValidators = z.infer<typeof reservationCustomValidatorsSchema>

/////////////////////////////////////////
// RESERVATION PARTIAL SCHEMA
/////////////////////////////////////////

export const reservationPartialSchema = reservationSchema.partial()

export type reservationPartial = z.infer<typeof reservationPartialSchema>

/////////////////////////////////////////
// RESERVATION OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const reservationOptionalDefaultsSchema = reservationSchema.merge(z.object({
  reservation_status: reservationStatusEnumSchema.optional(),
  reservation_date: z.string().date().transform((val) => new Date(val)).optional(),
}))

export type reservationOptionalDefaults = z.infer<typeof reservationOptionalDefaultsSchema>

export default reservationSchema;
