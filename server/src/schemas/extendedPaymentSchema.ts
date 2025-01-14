import {z} from 'zod'

export const makePaymentSchema = z.object({
    amount: z.number()
})