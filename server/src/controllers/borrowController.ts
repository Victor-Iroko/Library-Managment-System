import { Request, Response } from "express"
import { borrowingClient } from "../config/client"
import { StatusCodes } from "http-status-codes"
import { ForbiddenError } from "@casl/ability"
import { borrowCreateSchema, borrowUpdateSchema } from "../schemas/extendedBorrowSchema"


export const getBorrowHistoryByUserId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.borrowing
    const result = await borrowingClient.findMany({
        where: {
            user_id: req.params.id,
            ...authConditions
        },
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
    const result = await borrowingClient.findMany({
        where: {
            book_id: req.params.id,
            ...authConditions
        },
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