import { z } from 'zod';

export const IsbnScalarFieldEnumSchema = z.enum(['isbn','book_id']);

export default IsbnScalarFieldEnumSchema;
