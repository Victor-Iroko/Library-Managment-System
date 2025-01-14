import { IVerifyOptions } from "passport-local";
import { user } from "@prisma/client";

export type PassportAuthCallback = (
    err: Error | null,
    user: user | false,
    info: IVerifyOptions | undefined
) => void;


