import { Request, Response } from "express"
import { reservationClient } from "../config/client"
import { StatusCodes } from "http-status-codes"
import { ForbiddenError } from "@casl/ability"
import { reservationCreateSchema, reservationUpdateSchema } from "../schemas/extendedReservationSchema"
import { buildQuery } from "../utils/parseQuery"
import reservationSchema from "../schemas/zod-schemas/modelSchema/reservationSchema"
import bookSchema from "../schemas/zod-schemas/modelSchema/bookSchema"
import userSchema from "../schemas/zod-schemas/modelSchema/userSchema"


export const getReservationsByUserId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.reservation
    const {paginationQuery, filterQuery, orderByQuery} = await buildQuery(req, 'reservation', {'reservation': reservationSchema, 'book': bookSchema})
    const result = await reservationClient.findMany({
        where: {
            user_id: req.params.id,
            ...authConditions,
            ...filterQuery
        },
        orderBy: [
            ...orderByQuery
        ],
        ...paginationQuery,
        include: {
            book: {
                select: {
                    title: true
                }
            }
        }
    })

    res.status(StatusCodes.OK).json(result)
}

export const reserveBook = async (req: Request, res: Response) => {
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'reservation')
    const data = await reservationCreateSchema.parseAsync(req.body)
    const result = await reservationClient.create({
        data
    })
    res.status(StatusCodes.OK).json(result)
}

export const updateReservation = async (req: Request, res: Response) => {
    const data = await reservationUpdateSchema.parseAsync(req.body)
    Object.keys(data).forEach((field) => {
        ForbiddenError.from(req.ability).throwUnlessCan('update', 'reservation', field);
    });
    const authConditions = req.prismaAbility.reservation
    await reservationClient.updateMany({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        },
        data
    })

    const updatedData = await reservationClient.findFirst({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(updatedData)
}


export const deleteReservation = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.reservation
    const deletedData = await reservationClient.deleteMany({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        }
    })
    res.status(StatusCodes.OK).json(deletedData)
}

export const getReservedUsersByBookId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.reservation
    const {paginationQuery, orderByQuery, filterQuery} = await buildQuery(req, 'reservation', {'reservation': reservationSchema, 'user': userSchema, 'book': bookSchema})
    const result = await reservationClient.findMany({
        where: {
            book_id: req.params.id,
            ...authConditions,
            ...filterQuery
        },
        orderBy: [
            ...orderByQuery
        ],
        ...paginationQuery,
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
            book: {
                select: {
                    title: true
                }
            }
        }
    })

    res.status(StatusCodes.OK).json(result)
}