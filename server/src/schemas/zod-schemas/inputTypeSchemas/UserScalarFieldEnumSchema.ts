import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','phone_number','role','refreshToken']);

export default UserScalarFieldEnumSchema;
