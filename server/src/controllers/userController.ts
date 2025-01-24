import { Request, Response } from "express";
import { userClient } from "../config/client";
import { StatusCodes } from "http-status-codes";
import { userUpdateSchema } from "../schemas/extendedUserSchema";
import { ForbiddenError } from "@casl/ability";
import { buildQuery } from "../utils/parseQuery";
import userSchema from "../schemas/zod-schemas/modelSchema/userSchema";



export const getUsers = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.user
    const {paginationQuery, orderByQuery, filterQuery} = await buildQuery(req, 'user', {'user': userSchema})
    const result = await userClient.findMany({
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

export const getUserById = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.user
    const result = await userClient.findFirst({
        where: {
            id: req.params.id,
            ...authConditions
        }
    })
    res.status(StatusCodes.OK).json(result)
}

export const updateUserInfo = async (req: Request, res: Response) => {
    const data = await userUpdateSchema.parseAsync(req.body)
    // Check permissions for each field in the data
    Object.keys(data).forEach((field) => {
        ForbiddenError.from(req.ability).throwUnlessCan('update', 'user', field);
    });
    const authConditions = req.prismaAbility.user

    await userClient.updateMany({
        where: {
            id: req.params.id,
            ...authConditions
        },
        data: data,
    })

    // get the data that was just updated
    const updatedData = await userClient.findFirst({
        where: {
            id: req.params.id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(updatedData)

}


export const deleteUser = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.user
    const deletedData = await userClient.deleteMany({
        where: {
            id: req.params.id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(deletedData)
}