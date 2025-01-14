import { reservationOptionalDefaultsSchema, reservationPartialSchema } from './zod-schemas/modelSchema/reservationSchema'


export const reservationCreateSchema = reservationOptionalDefaultsSchema


export const reservationUpdateSchema = reservationPartialSchema.omit({
    user_id: true, 
    book_id: true,
    reservation_date: true
})