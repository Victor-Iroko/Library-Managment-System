import {PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/hashing";



export const prisma = new PrismaClient().$extends({
    query: {
        user: {
            async create({args, query}) {
                if ((args.data.password != undefined) && (typeof args.data.password === 'string')) {
                    args.data.password = await hashPassword(args.data.password)
                }
                return query(args)
            },

            async update({ args, query }) {
                if ((typeof args.data.password === 'string')) {
                    args.data.password = await hashPassword(args.data.password)
                } else if(typeof args.data.password?.set !== "undefined") {
                    args.data.password.set = await hashPassword(args.data.password.set)
                }
                return query(args)
              },

              
            async createMany({args, query}) {
                if (Array.isArray(args.data)){
                    args.data = await Promise.all(
                        args.data.map(
                            async (user) => ({
                                ...user,
                                password: await hashPassword(user.password)
                            })
                        )
                    )
                }
                return query(args)
            }
        }
    }
})



export const bookClient = prisma.book
export const borrowingClient = prisma.borrowing
export const cartClient = prisma.cart
export const finePaymentClient = prisma.finePayment
export const isbnClient = prisma.isbn
export const notificationClient = prisma.notification
export const readHistoryClient = prisma.readHistory
export const reservationClient = prisma.reservation
export const userClient = prisma.user

export default prisma