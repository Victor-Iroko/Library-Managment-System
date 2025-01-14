import { user } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from "../errors/customError";
import { CookieOptions, Request } from "express";
import { getEnvVar } from "./getEnv";

type TokenType = "ACCESS_TOKEN" | "REFRESH_TOKEN"


export type PayLoad = {
    id: string, 
    role: string
}


export const generateToken = (user: user, type: TokenType = "ACCESS_TOKEN"): string => {
    const secret = getEnvVar(type)
    const expirationTime = type === "REFRESH_TOKEN" ? getEnvVar('REFRESH_TOKEN_TIME') : getEnvVar('ACCESS_TOKEN_TIME')
    return jwt.sign({id: user.id, role: user.role}, secret, {expiresIn: expirationTime});
};


export const jwtCookieExtractor = (req: Request, logout: boolean = false) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        if (logout) {
            return "" // the user might already be logged out so no need to throw an error
        }
        throw new UnauthorizedError("No Jwt cookie")
    }

    const refreshToken: string = cookies.jwt

    return refreshToken
}


export const jwtCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: getEnvVar('NODE_ENV') === "production",
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
}