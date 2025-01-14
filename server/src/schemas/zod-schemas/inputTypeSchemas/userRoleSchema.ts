import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN','LIBRARIAN','USER','NONE']);

export type userRoleType = `${z.infer<typeof userRoleSchema>}`

export default userRoleSchema;
