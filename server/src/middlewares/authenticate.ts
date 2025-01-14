import passport from 'passport'
import { PassportAuthCallback } from '../types/authTypes'
import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '../errors/customError'
import { defineAbilitiesForUser } from '../utils/permissions'
import { accessibleBy } from '@casl/prisma'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const callback: PassportAuthCallback = (_err, user, info) => {
        if (!user) {
            return next(new ForbiddenError(info?.message))
        }

        // add permissions
        const ability = defineAbilitiesForUser(user)
        const prismaAbility = accessibleBy(ability)

        req.ability = ability
        req.prismaAbility = prismaAbility
        req._user = user // assigned this again even though passport does this because of some ts stuff 

        return next()
    }
    passport.authenticate('jwt-bearer', {session: false}, callback)(req, res, next)
}