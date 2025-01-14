import { z } from 'zod';

export const notificationTypeSchema = z.enum(['DUE_DATE','FINE','RESERVATION']);

export type notificationTypeType = `${z.infer<typeof notificationTypeSchema>}`

export default notificationTypeSchema;
