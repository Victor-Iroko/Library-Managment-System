import { Request, Response } from "express"
import { borrowingClient } from "../config/client"
import { StatusCodes } from "http-status-codes"
import { ForbiddenError } from "@casl/ability"
import { borrowCreateSchema, borrowUpdateSchema } from "../schemas/extendedBorrowSchema"
import { buildQuery } from "../utils/parseQuery"
import borrowingSchema from "../schemas/zod-schemas/modelSchema/borrowingSchema"
import bookSchema from "../schemas/zod-schemas/modelSchema/bookSchema"
import finePaymentSchema from '../schemas/zod-schemas/modelSchema/finePaymentSchema'
import userSchema from "../schemas/zod-schemas/modelSchema/userSchema"


export const getBorrowHistoryByUserId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.borrowing
    const {filterQuery, orderByQuery, paginationQuery} = await buildQuery(req, 'borrowing', {'borrowing': borrowingSchema, 'book': bookSchema, 'finePayment': finePaymentSchema})
    const result = await borrowingClient.findMany({
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
            },
            finePayments: {
                select: {
                    paymentDate: true
                }
            }
        }
    })

    res.status(StatusCodes.OK).json(result)
}

export const getBorrowedUsersByBookId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.borrowing
    const {orderByQuery, paginationQuery, filterQuery} = await buildQuery(req, 'borrowing', {'borrowing': borrowingSchema, 'user': userSchema})
    const result = await borrowingClient.findMany({
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
            }
        }
    })

    res.status(StatusCodes.OK).json(result)

}

export const createBorrow = async (req: Request, res: Response) => {
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'borrowing')
    const data = await borrowCreateSchema.parseAsync(req.body)
    const result = await borrowingClient.create({
        data
    })
    res.status(StatusCodes.OK).json(result)
}


export const updateBorrow = async (req: Request, res: Response) => {
    const data = await borrowUpdateSchema.parseAsync(req.body)
    Object.keys(data).forEach((field) => {
        ForbiddenError.from(req.ability).throwUnlessCan('update', 'borrowing', field)
    })
    const authConditions = req.prismaAbility.borrowing
    await borrowingClient.updateMany({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        },
        data
    })

    const updatedData = await borrowingClient.findFirst({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        },
    })

    res.status(StatusCodes.OK).json(updatedData)
}