import { notificationType } from "@prisma/client"
import { borrowingClient, notificationClient, reservationClient } from "../config/client"
import { sendEmailNotification } from "./email"


export const notifyOverDueBorrows = async () => {
    // get all people who have borrowed a book and have not returned it and the overdue date to return it has passed 
    const usersWithOverDueBorrow = await borrowingClient.findMany({
        where: {
            due_date: {lt: new Date()},
            returned: false
        },
        include: {
            book: {
                select: {
                    title: true
                }
            },
            user: {
                select: {
                    name: true, 
                    email: true,
                }
            }
        }
    })

    usersWithOverDueBorrow.map(async (borrow) => {
        const subject = notificationType.DUE_DATE
        const text = `${borrow.user.name} you have not returned the book ${borrow.book.title} which was due to be  returned on ${borrow.due_date.toLocaleDateString()}`
        const result = await sendEmailNotification(borrow.user.email, subject, text)
        if (result === 'Sent'){
            // add the notification just sent to the notification table
            await notificationClient.create({
                data: {
                    user_id: borrow.user_id,
                    type: subject,
                    content: text,
                }
            })
        }

    })
}


export const notifyUnpaidFines = async () => {
    const usersWithUnpaidFines = await borrowingClient.findMany({
        where: {
            fine: {
                gt: 0
            },
            paid: false
        },
        include: {
            book: {
                select: {
                    title: true
                }
            },
            user: {
                select: {
                    name: true, 
                    email: true,
                }
            }
        }
    })

    usersWithUnpaidFines.map(async (finedUser) => {
        const subject = notificationType.FINE
        const text = `${finedUser.user.name}, you have an unpaid fine of ${finedUser.fine}`
        const result = await sendEmailNotification(finedUser.user.email, subject, text)
        if (result === 'Sent'){
            // add the notification just sent to the notification table
            await notificationClient.create({
                data: {
                    user_id: finedUser.user_id,
                    type: subject,
                    content: text,
                }
            })
        }

    })
}


export const notifyAvailableReservations = async () => {
    const unCollectedReservations = await reservationClient.findMany({
        where: {
            reservation_status: 'Not_collected',
            book: {
                available_copies: {
                    gt: 0
                }
            }
        },
        include: {
            book: {
                select: {
                    title: true
                }
            },
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    unCollectedReservations.map(async (reservation) => {
        const subject = notificationType.RESERVATION
        const text = `${reservation.user.name}, the book ${reservation.book.title} you reserved is now available for collection`
        const result = await sendEmailNotification(reservation.user.email, subject, text)
        if (result === 'Sent'){
            // add the notification just sent to the notification table
            await notificationClient.create({
                data: {
                    user_id: reservation.user_id,
                    type: subject,
                    content: text,
                }
            })
        }
    })
}