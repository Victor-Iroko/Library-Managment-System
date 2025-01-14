import { z } from "zod"
import { userPartialSchema } from "./zod-schemas/modelSchema/userSchema"
import { extendZodWithOpenApi } from "zod-openapi";

extendZodWithOpenApi(z);


export const userUpdateSchema = userPartialSchema.omit({
    id: true,
    refreshToken: true
}).extend({
    confirm_password: z.string().optional()
}).refine((schema) => schema.password === schema.confirm_password, {message: "Passwords don't match"})
    .transform(({ confirm_password, ...rest }) => rest)

export type UpdateUser = z.infer<typeof userUpdateSchema>




