import { z } from 'zod';

export const reservationStatusEnumSchema = z.enum(['Collected','Not_collected']);

export type reservationStatusEnumType = `${z.infer<typeof reservationStatusEnumSchema>}`

export default reservationStatusEnumSchema;
