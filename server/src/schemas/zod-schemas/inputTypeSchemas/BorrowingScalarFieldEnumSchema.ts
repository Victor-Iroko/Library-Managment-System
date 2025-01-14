import { z } from 'zod';

export const BorrowingScalarFieldEnumSchema = z.enum(['user_id','book_id','borrow_date','due_date','return_date','returned','fine','paid','payment_id']);

export default BorrowingScalarFieldEnumSchema;
