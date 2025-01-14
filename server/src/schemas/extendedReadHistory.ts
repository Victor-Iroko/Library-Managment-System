import { readHistoryOptionalDefaultsSchema, readHistoryPartialSchema } from './zod-schemas/modelSchema/readHistorySchema'


export const readHistoryCreateSchema = readHistoryOptionalDefaultsSchema


export const readHistoryUpdateSchema = readHistoryPartialSchema.omit({
    user_id: true, 
    book_id: true
})