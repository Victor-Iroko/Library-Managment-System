import { notificationPartialSchema } from './zod-schemas/modelSchema/notificationSchema'


export const notificationUpdateSchema = notificationPartialSchema.omit({
    user_id: true,
    type: true,
    id: true,
    content: true
})