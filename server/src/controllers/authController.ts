import { NextFunction, Request, Response } from "express"
import { userLoginSchema, userRegisterSchema } from "../schemas/extendedAuthSchema"
import { StatusCodes } from "http-status-codes"
import { userClient } from "../config/client"
import { ForbiddenError, UnauthorizedError } from "../errors/customError"
import { generateToken, jwtCookieExtractor, jwtCookieOptions } from "../utils/jwt"
import passport from "../utils/passport"
import { PassportAuthCallback } from "../types/authTypes"
import { userRole } from "@prisma/client"


const restrictedRoles: userRole[] = [userRole.ADMIN, userRole.LIBRARIAN]

export const registerController = async (req: Request, res: Response) => {
    // #swagger.summary = 'User registration.'
    // #swagger.description = 'Allows new users to register by providing necessary details like email, and password.'
    const data = await userRegisterSchema.safeParseAsync(req.body)
    /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/registerController" }
    } */
    if (!data.success){
        throw data.error
        /* #swagger.responses[400] = {
            description: 'Bad request, your data is not doos',
    } */
    }

    // only admins can register other admins or librarians
    if ((restrictedRoles.includes(data.data.role)) && (req._user?.role !== userRole.ADMIN)) {
        throw new ForbiddenError('Only admins can register users as admin or librarian.');
        /* #swagger.responses[403] = {
            description: 'Only admins can register users as admin or librarian.',
    } */
    }

    const user = await userClient.create({data: data.data})
    res.status(StatusCodes.CREATED).json(user)
    /* #swagger.responses[201] = {
            description: 'User has been registered',
            schema: { $ref: '#/components/schemas/someSchema' }
    } */
}



export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.summary = 'User login.'
    // #swagger.description = 'Authenticates users with their credentials and returns an access token.'
    const loginData = await userLoginSchema.safeParseAsync(req.body)
    if (!loginData.success) {
        throw loginData.error
    }
    
    const callback: PassportAuthCallback = async (_err, user, info) => {
        if (!user) {
            return next(new UnauthorizedError(info?.message))
        }

        const accessToken = generateToken(user)
        const refreshToken = generateToken(user, "REFRESH_TOKEN")

        await userClient.update({
            where: {id: user.id},
            data: {refreshToken: refreshToken}
        })
        
        res.cookie('jwt', refreshToken, jwtCookieOptions)
        
        return res.status(StatusCodes.OK).json({message: "User has successfully logged in",accessToken})
    }
    
    passport.authenticate('local', {session: false}, callback)(req, res, next)

}




export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.summary = 'Refresh access token.'
    // #swagger.description = 'Generates a new access token using a valid refresh token'
    const callback: PassportAuthCallback = (_err, user, info) => {
        if (!user){
            return next(new ForbiddenError(info?.message))
        }
        const accessToken = generateToken(user)
        return res.json({accessToken: accessToken})
    }

    passport.authenticate('jwt-cookie', {session: false}, callback)(req, res, next)
}




export const logoutController = async (req: Request, res: Response) => {
    // #swagger.summary = 'Logout user.'
    // #swagger.description = 'Logs the user out and invalidates the refresh token.'
    const refreshToken = jwtCookieExtractor(req, true)
    const user = await userClient.findFirst({where: {refreshToken: refreshToken}})
    if (user) {
        await userClient.update({
            where: {id: user.id},
            data: {refreshToken: ""}
        })
    }

    const {maxAge, ...rest} = jwtCookieOptions
    res.clearCookie('jwt', rest)
    res.sendStatus(StatusCodes.NO_CONTENT)

}