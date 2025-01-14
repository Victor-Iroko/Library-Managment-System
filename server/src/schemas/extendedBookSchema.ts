import {bookOptionalDefaultsSchema, bookPartialSchema} from './zod-schemas/modelSchema/bookSchema'


export const bookCreateSchema = bookOptionalDefaultsSchema.omit({
    id: true
})

export const bookUpdateSchema = bookPartialSchema.omit({
    id: true,
    avg_rating: true
})