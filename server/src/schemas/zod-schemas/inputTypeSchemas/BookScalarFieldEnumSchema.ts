import { z } from 'zod';

export const BookScalarFieldEnumSchema = z.enum(['id','title','author','genre','available_copies','avg_rating','publication_year','description','cover_image']);

export default BookScalarFieldEnumSchema;
