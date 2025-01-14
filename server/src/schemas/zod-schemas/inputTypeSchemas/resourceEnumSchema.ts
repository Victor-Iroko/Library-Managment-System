import { z } from 'zod';

export const resourceEnumSchema = z.enum(['book','borrowing','cart','finePayment','isbn','notification','readHistory','reservation','user']);

export type resourceEnumType = `${z.infer<typeof resourceEnumSchema>}`

export default resourceEnumSchema;
