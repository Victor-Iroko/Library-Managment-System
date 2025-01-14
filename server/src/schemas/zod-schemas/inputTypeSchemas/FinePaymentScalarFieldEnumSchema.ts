import { z } from 'zod';

export const FinePaymentScalarFieldEnumSchema = z.enum(['id','borrowing_user_id','amount','reference','paymentDate']);

export default FinePaymentScalarFieldEnumSchema;
