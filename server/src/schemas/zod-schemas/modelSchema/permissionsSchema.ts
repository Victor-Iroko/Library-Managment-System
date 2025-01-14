import { z } from 'zod';
import { userRoleSchema } from '../inputTypeSchemas/userRoleSchema'
import { actionsEnumSchema } from '../inputTypeSchemas/actionsEnumSchema'
import { resourceEnumSchema } from '../inputTypeSchemas/resourceEnumSchema'
import { conditionEnumSchema } from '../inputTypeSchemas/conditionEnumSchema'

/////////////////////////////////////////
// PERMISSIONS SCHEMA
/////////////////////////////////////////

export const permissionsSchema = z.object({
  role: userRoleSchema,
  actions: actionsEnumSchema,
  resources: resourceEnumSchema,
  conditions: conditionEnumSchema,
  fields: z.string(),
})

export type permissions = z.infer<typeof permissionsSchema>

/////////////////////////////////////////
// PERMISSIONS PARTIAL SCHEMA
/////////////////////////////////////////

export const permissionsPartialSchema = permissionsSchema.partial()

export type permissionsPartial = z.infer<typeof permissionsPartialSchema>

/////////////////////////////////////////
// PERMISSIONS OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const permissionsOptionalDefaultsSchema = permissionsSchema.merge(z.object({
}))

export type permissionsOptionalDefaults = z.infer<typeof permissionsOptionalDefaultsSchema>

export default permissionsSchema;
