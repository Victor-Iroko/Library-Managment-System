import { z } from 'zod';

export const ReservationScalarFieldEnumSchema = z.enum(['user_id','book_id','reservation_date','reservation_status']);

export default ReservationScalarFieldEnumSchema;
