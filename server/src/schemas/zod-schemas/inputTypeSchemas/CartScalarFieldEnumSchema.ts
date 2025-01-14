import { z } from 'zod';

export const CartScalarFieldEnumSchema = z.enum(['user_id','book_id','added_date']);

export default CartScalarFieldEnumSchema;
