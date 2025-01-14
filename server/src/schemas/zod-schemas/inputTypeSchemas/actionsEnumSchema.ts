import { z } from 'zod';

export const actionsEnumSchema = z.enum(['create','read','update','delete']);

export type actionsEnumType = `${z.infer<typeof actionsEnumSchema>}`

export default actionsEnumSchema;
