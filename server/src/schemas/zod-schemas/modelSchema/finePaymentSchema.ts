import { z } from 'zod';
import { alreadyExist } from '../../../utils/validation';
import { user, finePayment } from '@prisma/client';

/////////////////////////////////////////
// FINE PAYMENT SCHEMA
/////////////////////////////////////////

export const finePaymentSchema = z.object({
  id: z.string().uuid(),
  borrowing_user_id: z.string().refine(async (val) => await alreadyExist<user>("user", "id", val), {message: "User does not exist"}),
  amount: z.number(),
  reference: z.string().min(1).max(100).refine(async (val) => !(await alreadyExist<finePayment>("finePayment", "reference", val)), { message: "Reference already exists" }),
  paymentDate: z.string().date().transform((val) => new Date(val)),
})

export type finePaymentSchema = z.infer<typeof finePaymentSchema>

/////////////////////////////////////////
// FINE PAYMENT CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const finePaymentCustomValidatorsSchema = finePaymentSchema

export type finePaymentCustomValidators = z.infer<typeof finePaymentCustomValidatorsSchema>

/////////////////////////////////////////
// FINE PAYMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const finePaymentPartialSchema = finePaymentSchema.partial()

export type finePaymentPartial = z.infer<typeof finePaymentPartialSchema>

/////////////////////////////////////////
// FINE PAYMENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const finePaymentOptionalDefaultsSchema = finePaymentSchema.merge(z.object({
  id: z.string().uuid().optional(),
  paymentDate: z.string().date().transform((val) => new Date(val)).optional(),
}))

export type finePaymentOptionalDefaults = z.infer<typeof finePaymentOptionalDefaultsSchema>

export default finePaymentSchema;
