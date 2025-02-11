import { Request, Response } from "express"
import { notificationClient } from "../config/client"
import { StatusCodes } from "http-status-codes"
import { notificationUpdateSchema } from "../schemas/extendedNotificationSchema"
import { ForbiddenError } from "@casl/ability"
import { buildQuery } from "../utils/parseQuery"
import notificationSchema from "../schemas/zod-schemas/modelSchema/notificationSchema"


export const getNotificationsByUserId = async (req: Request, res: Response) => {
    const authConditions = req.prismaAbility.notification
    const {filterQuery, paginationQuery, orderByQuery} = await buildQuery(req, 'notification', {'notification': notificationSchema})
    const result = await notificationClient.findMany({
        where: {
            user_id: req.params.user_id,
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

export const updateNotificationsById = async (req: Request, res: Response) => {
    const data = await notificationUpdateSchema.parseAsync(req.body)
    Object.keys(data).forEach((field) => {
            ForbiddenError.from(req.ability).throwUnlessCan('update', 'notification', field);
        });
    const authConditions = req.prismaAbility.notification
    await notificationClient.updateMany({
        where: {
            id: req.params.id,
            ...authConditions
        },
        data
    })

    const updatedData = await notificationClient.findFirst({
        where: {
            id: req.params.id,
            ...authConditions
        }
    })

    res.status(StatusCodes.OK).json(updatedData)
}