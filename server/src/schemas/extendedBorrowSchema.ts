import {borrowingOptionalDefaultsSchema, borrowingPartialSchema} from './zod-schemas/modelSchema/borrowingSchema'

export const borrowCreateSchema = borrowingOptionalDefaultsSchema.omit({
    borrow_date: true
})

export const borrowUpdateSchema = borrowingPartialSchema.omit({
    user_id: true,
    book_id: true,
    borrow_date: true,
    fine: true // fine is not been updated from here
}).refine((schema) => {
    return schema.returned ? !!schema.return_date : true;
},{
    message: 'Return date is required when "returned" is true.'
}).refine((schema) => {
    return schema.paid ? !! schema.payment_id : true;
}, {
    message: "Payment id is required when paid is true"
})