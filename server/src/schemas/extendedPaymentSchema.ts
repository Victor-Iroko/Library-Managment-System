import {z} from 'zod'
import { alreadyExist } from '../utils/validation'
import { borrowing } from '@prisma/client'

export const makePaymentSchema = z.object({
    book_id: z.array(z.string().refine(async (val) => await alreadyExist<borrowing>('borrowing', 'book_id', val)))
})