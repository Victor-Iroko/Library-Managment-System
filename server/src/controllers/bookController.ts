import { Request, Response } from "express";
import { bookClient } from "../config/client";
import { StatusCodes } from "http-status-codes";
import { bookCreateSchema, bookUpdateSchema } from "../schemas/extendedBookSchema";
import { ForbiddenError } from "@casl/ability";
import { buildQuery } from "../utils/parseQuery";
import bookSchema from "../schemas/zod-schemas/modelSchema/bookSchema";



export const getBooks = async (req: Request, res: Response) => {
    // #swagger.summary = 'Retrieve all books.'
    // #swagger.description = 'Fetches details of all available books.'
    /* #swagger.parameters['$ref'] = ['#components/parameters/page', '#components/parameters/limit'] */
    const authConditions = req.prismaAbility.book
    const {filterQuery, paginationQuery, orderByQuery} = await buildQuery(req, 'book', {'book': bookSchema})
    const result = await bookClient.findMany({
        where: {
            ...authConditions,
            ...filterQuery
        },
        orderBy: [
            ...orderByQuery
        ],
        ...paginationQuery
    })
    res.status(StatusCodes.OK).json(result)
}

export const getBookById = async (req: Request, res: Response) => {
    // #swagger.summary = 'Retrieve book details.'
    // #swagger.description = 'Fetches detailed information about a specific book by its ID.'
    const authConditions = req.prismaAbility.book
    const result = await bookClient.findFirst({
        where: {
            id: req.params.id,
            ...authConditions
        },
        include: {
            borrowing: {
                where: req.prismaAbility.borrowing
            },
            reservation: {
                where: req.prismaAbility.reservation
            },
            cart: {
                where: req.prismaAbility.cart
            },
            readHistory: {
                where: req.prismaAbility.readHistory
            }
        }
    })

    res.status(StatusCodes.OK).json(result)
}

export const addBook = async (req: Request, res: Response) => {
    // #swagger.summary = 'Add a new book.'
    // #swagger.description = 'Creates a new book entry in the system.'
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'book')
    const data = await bookCreateSchema.parseAsync(req.body)
    const result = await bookClient.create({
        data
    })
    res.status(StatusCodes.OK).json(result)

}

export const updateBookInfo = async (req: Request, res: Response) => {
    // #swagger.summary = 'Update book information.'
    // #swagger.description = 'Modifies details of a book identified by its unique ID.'
    const data = await bookUpdateSchema.parseAsync(req.body)
    Object.keys(data).forEach((field) => {
        ForbiddenError.from(req.ability).throwUnlessCan('update', 'book', field);
    });
    const authConditions = req.prismaAbility.book
    await bookClient.updateMany({
        where: {
            id: req.params.id,
            ...authConditions
        },
        data
    })

    const updatedData = await bookClient.findFirst({
        where: {
            id: req.params.id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(updatedData)
}


export const deleteBook = async (req: Request, res: Response) => {
    // #swagger.summary = 'Delete a book.'
    // #swagger.description = 'Removes a book from the catalog.'
    ForbiddenError.from(req.ability).throwUnlessCan('delete', 'book')
    const authConditions = req.prismaAbility.book
    const deletedData = await bookClient.deleteMany({
        where: {
            id: req.params.id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(deletedData)
}