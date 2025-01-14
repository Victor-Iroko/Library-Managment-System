import { z } from 'zod';
import { userRoleSchema } from '../inputTypeSchemas/userRoleSchema'
import { alreadyExist } from '../../../utils/validation'
import { user } from '@prisma/client'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const userSchema = z.object({
  role: userRoleSchema,
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  email: z.string().email().refine(async (val) => !(await alreadyExist<user>("user", "email", val)), { message: "Email already exists" }),
  password: z.string().min(8).max(128),
  phone_number: z.string().regex(/^[0-9]{10,15}$/).nullish(),
  refreshToken: z.string().nullish(),
})

export type userSchema = z.infer<typeof userSchema>

/////////////////////////////////////////
// USER CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const userCustomValidatorsSchema = userSchema

export type userCustomValidators = z.infer<typeof userCustomValidatorsSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const userPartialSchema = userSchema.partial()

export type userPartial = z.infer<typeof userPartialSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const userOptionalDefaultsSchema = userSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type userOptionalDefaults = z.infer<typeof userOptionalDefaultsSchema>

export default userSchema;
