import { z } from 'zod';

export const genreEnumSchema = z.enum(['Fiction','Non_Fiction','Science_Fiction','Fantasy','Mystery','Romance','Thriller','Biography','Historical','Self_Help']);

export type genreEnumType = `${z.infer<typeof genreEnumSchema>}`

export default genreEnumSchema;
