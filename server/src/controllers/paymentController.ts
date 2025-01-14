import { ForbiddenError } from "@casl/ability"
import { Request, Response } from "express"
import { makePayment, verifyPayment } from "../utils/payments"
import { userClient } from "../config/client"
import { makePaymentSchema } from "../schemas/extendedPaymentSchema"
import { StatusCodes } from "http-status-codes"


export const payFinesByUserId = async (req: Request, res: Response) => {
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'finePayment')
    const data = await makePaymentSchema.parseAsync(req.body)
    const user = await userClient.findFirst({
        where: {
            id: req.params.id,
            ...req.prismaAbility.user
        }
    })
    if (user){
        const url = await makePayment(user.email, data.amount)
        res.status(StatusCodes.OK).json(url)
    }
}

export const verifyPaymentByReference = async (req: Request, res: Response) => {
    ForbiddenError.from(req.ability).throwUnlessCan('create', 'finePayment')
    const paymentStatus = await verifyPayment(req.params.reference)
    if (paymentStatus) {
        // const payment = await finePaymentClient.create({
        //     data: {

        //     }
        // })

        // res.status(StatusCodes.OK).json(payment)
    }

    res.status(StatusCodes.PAYMENT_REQUIRED).json("Payment failed")
}