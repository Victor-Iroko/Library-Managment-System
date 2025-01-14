import { z } from 'zod';

export const ReadHistoryScalarFieldEnumSchema = z.enum(['user_id','book_id','finished','rating','review']);

export default ReadHistoryScalarFieldEnumSchema;
