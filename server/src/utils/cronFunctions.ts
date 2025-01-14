import { borrowingClient } from "../config/client"

// function to increase the fine for unreturned books after their due date
export const addFine = async () => {
    await borrowingClient.updateMany({
        where: {
            due_date: {
                lt: new Date()
            },
            returned: false
        },

        data: {
            fine: {
                increment: 1000
            }
        }
    })
}