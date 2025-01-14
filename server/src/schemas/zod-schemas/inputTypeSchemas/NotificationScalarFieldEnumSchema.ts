import { z } from 'zod';

export const NotificationScalarFieldEnumSchema = z.enum(['id','user_id','type','content','is_read']);

export default NotificationScalarFieldEnumSchema;
