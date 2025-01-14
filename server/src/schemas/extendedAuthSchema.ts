import { z } from "zod";
import { extendZodWithOpenApi } from "zod-openapi";
import userSchema, { userOptionalDefaultsSchema } from "./zod-schemas/modelSchema/userSchema";


extendZodWithOpenApi(z)

export const userRegisterSchema = userOptionalDefaultsSchema.omit({
    id: true,
    refreshToken: true
}).extend({
    confirm_password: z.string()
}).refine((schema) => schema.password === schema.confirm_password, { message: "Passwords don't match" })
    .transform(({ confirm_password, ...rest }) => rest);

export type RegisterUser = z.infer<typeof userRegisterSchema>;



export const userLoginSchema = userSchema.pick({
    password: true
}).extend({
    email: z.string().email()
}).strict();
export type LoginUser = z.infer<typeof userLoginSchema>;
