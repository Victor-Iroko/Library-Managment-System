import { Request, Response } from "express"
import prisma, { readHistoryClient } from "../config/client"
import { StatusCodes } from "http-status-codes"
import { ForbiddenError } from "@casl/ability"
import { readHistoryCreateSchema, readHistoryUpdateSchema } from "../schemas/extendedReadHistory"
import { buildQuery } from "../utils/parseQuery"
import readHistorySchema from "../schemas/zod-schemas/modelSchema/readHistorySchema"
import bookSchema from "../schemas/zod-schemas/modelSchema/bookSchema"


export const getReadHistoryByUserId = async (req: Request, res: Response) => {
    // #swagger.summary = 'User read history.'
    // #swagger.description = 'Retrieves the reading history of a specific user.'
    const authConditions = req.prismaAbility.readHistory
    const {paginationQuery, orderByQuery, filterQuery} = await buildQuery(req, 'readHistory', {'readHistory': readHistorySchema, 'book': bookSchema})
    const result = await readHistoryClient.findMany({
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

export const addBookToReadHistory = async (req: Request, res: Response) => {
    // #swagger.summary = 'Add read history.'
    // #swagger.description = 'Records a book as read by a user'
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'readHistory')
    const data = await readHistoryCreateSchema.parseAsync(req.body)
    const result = await readHistoryClient.create({
        data
    })

    res.status(StatusCodes.OK).json(result)
}

export const updateReadHistory = async (req: Request, res: Response) => {
    // #swagger.summary = 'Update read history.'
    // #swagger.description = 'Modifies a user's reading history for a specific book.'
    const data = await readHistoryUpdateSchema.parseAsync(req.body)
    Object.keys(data).forEach((field) => {
        ForbiddenError.from(req.ability).throwUnlessCan('update', 'readHistory', field);
    });
    const authConditions = req.prismaAbility.readHistory

    await prisma.$transaction(
        async (transaction) => {
            await transaction.readHistory.updateMany({
                where: {
                    user_id: req.params.user_id,
                    book_id: req.params.book_id,
                    ...authConditions
                },
                data
            })

            // update avg_rating if rating is being changed 
            if (data.rating) {
                // get the new avg rating for that book
                const avg_rating = await transaction.readHistory.groupBy({
                    by: ['book_id'],
                    where: {
                        book_id: req.params.book_id
                    },
                    _avg: {
                        rating: true
                    }
                })

                // update it 
                await transaction.book.update({
                    where:{
                        id: req.params.book_id
                    },
                    data: {
                        avg_rating: avg_rating[0]?._avg.rating
                    }
                })

            }
        }
    )
    const updatedData = await readHistoryClient.findFirst({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(updatedData)
}