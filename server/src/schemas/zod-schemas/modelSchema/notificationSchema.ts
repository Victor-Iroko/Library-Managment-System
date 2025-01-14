import { z } from 'zod';
import { notificationTypeSchema } from '../inputTypeSchemas/notificationTypeSchema'
import { alreadyExist } from '../../../utils/validation';
import { user } from '@prisma/client';

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const notificationSchema = z.object({
  type: notificationTypeSchema,
  id: z.string().uuid(),
  user_id: z.string().refine(async (val) => await alreadyExist<user>("user", "id", val), {message: "User does not exist"}),
  content: z.string().min(1).max(500),
  is_read: z.boolean(),
})

export type notification = z.infer<typeof notificationSchema>

/////////////////////////////////////////
// NOTIFICATION CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const notificationCustomValidatorsSchema = notificationSchema

export type notificationCustomValidators = z.infer<typeof notificationCustomValidatorsSchema>

/////////////////////////////////////////
// NOTIFICATION PARTIAL SCHEMA
/////////////////////////////////////////

export const notificationPartialSchema = notificationSchema.partial()

export type notificationPartial = z.infer<typeof notificationPartialSchema>

/////////////////////////////////////////
// NOTIFICATION OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const notificationOptionalDefaultsSchema = notificationSchema.merge(z.object({
  id: z.string().uuid().optional(),
  is_read: z.boolean().optional(),
}))

export type notificationOptionalDefaults = z.infer<typeof notificationOptionalDefaultsSchema>

export default notificationSchema;
