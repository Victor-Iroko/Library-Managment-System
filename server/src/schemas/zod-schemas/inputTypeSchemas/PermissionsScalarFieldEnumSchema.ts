import { z } from 'zod';

export const PermissionsScalarFieldEnumSchema = z.enum(['role','actions','resources','fields','conditions']);

export default PermissionsScalarFieldEnumSchema;
