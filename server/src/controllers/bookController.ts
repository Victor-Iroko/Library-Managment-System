import { Request, Response } from "express";
import { bookClient } from "../config/client";
import { StatusCodes } from "http-status-codes";
import { bookCreateSchema, bookUpdateSchema } from "../schemas/extendedBookSchema";
import { ForbiddenError } from "@casl/ability";



export const getBooks = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.book
    const result = await bookClient.findMany({
        where: authConditions
    })
    res.status(StatusCodes.OK).json(result)
}

export const getBookById = async (req: Request, res: Response) => {
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
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'book')
    const data = await bookCreateSchema.parseAsync(req.body)
    const result = await bookClient.create({
        data
    })
    res.status(StatusCodes.OK).json(result)

}

export const updateBookInfo = async (req: Request, res: Response) => {
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