import { z } from 'zod';

export const conditionEnumSchema = z.enum(['theirs','all']);

export type conditionEnumType = `${z.infer<typeof conditionEnumSchema>}`

export default conditionEnumSchema;
