import { ForbiddenError } from "@casl/ability"
import { Request, Response } from "express"
import { makePayment, verifyPayment } from "../utils/payments"
import { borrowingClient, userClient } from "../config/client"
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
        // calculate the total fine the user owns
        const amount = await borrowingClient.aggregate({
            where: {
                user_id: req.params.id,
                book_id: {
                    in: data.book_id
                }
            },
            _sum: {
                fine: true
            }
        })


        const url = await makePayment(user.email, Math.round(amount._sum.fine ?? 0)) // it needs to be an integer (don't know why paystack doesn't accept float or maybe its just my configuration)
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