import { Request, Response } from "express"
import { cartClient } from "../config/client"
import { StatusCodes } from "http-status-codes"
import { ForbiddenError } from "@casl/ability"
import { cartCreateSchema } from "../schemas/extendedCartSchema"
import { buildQuery } from "../utils/parseQuery"
import cartSchema from "../schemas/zod-schemas/modelSchema/cartSchema"
import bookSchema from "../schemas/zod-schemas/modelSchema/bookSchema"


export const getCartByUserId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.cart
    const {paginationQuery, orderByQuery, filterQuery} = await buildQuery(req, 'cart', {'cart': cartSchema, 'book': bookSchema})
    const result = await cartClient.findMany({
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


export const addBookToCart = async (req: Request, res: Response) => {
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'cart')
    const data = await cartCreateSchema.parseAsync(req.body)
    const result = await cartClient.create({
        data
    })
    res.status(StatusCodes.OK).json(result)
}

export const removeBookFromCart = async (req: Request, res:Response) => {
    const authConditions = req.prismaAbility.cart
    const deletedData = await cartClient.deleteMany({
        where: {
            user_id: req.params.user_id,
            book_id: req.params.book_id,
            ...authConditions
        }
    })
    res.status(StatusCodes.OK).json(deletedData)
}