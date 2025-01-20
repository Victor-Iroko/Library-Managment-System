import { ForbiddenError } from "@casl/ability";
import { Request, Response } from "express";
import { createISBNSchema } from "../schemas/extendedISBNSchema";
import prisma, { isbnClient } from "../config/client";
import { StatusCodes } from "http-status-codes";


export const addISBN = async (req: Request, res: Response) => {
    // #swagger.summary = 'Add ISBN entry.'
    // #swagger.description = 'Creates a new ISBN record.'
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'isbn')
    const data = await createISBNSchema.parseAsync(req.body)

    const result = await prisma.$transaction(
        async (transaction) => {
            // add isbn 
            const result = await transaction.isbn.create({
                data
            })

            // update available_copies
            await transaction.book.update({
                where: {
                    id: result.book_id
                },
                data: {
                    available_copies: {
                        increment: 1
                    }
                }
            })
            
            return result
        }
    )

    res.status(StatusCodes.OK).json(result)
}

export const deleteISBN = async (req: Request, res: Response) => {
    // #swagger.summary = 'Remove ISBN entry.'
    // #swagger.description = 'Deletes a specific ISBN record.'
    ForbiddenError.from(req.ability).throwUnlessCan('delete', 'isbn')
    const authConditions = req.prismaAbility.isbn
    const deletedData = await isbnClient.deleteMany({
        where: {
            isbn: req.params.isbn,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(deletedData)
}

export const getBookIdByIsbn = async (req: Request, res: Response) => {
    // #swagger.summary = 'Get book ID by ISBN.'
    // #swagger.description = 'Retrieves the associated book ID using the ISBN.'
    const authConditions = req.prismaAbility.isbn
    const result = await isbnClient.findFirst({
        where: {
            isbn: req.params.isbn,
            ...authConditions
        },
        include: {
            book: {
                select: {
                    title: true
                }
            }
        }
    })

    res.status(StatusCodes.OK).json(result)
};
