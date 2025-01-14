import express from 'express'
import { deleteUser, getUserById, getUsers, updateUserInfo } from '../controllers/userController'
import { getBorrowHistoryByUserId } from '../controllers/borrowController'
import { getCartByUserId } from '../controllers/cartController'
import { getNotificationsByUserId, updateNotificationsById } from '../controllers/notificationController'
import { getReadHistoryByUserId } from '../controllers/readHistoryController'
import { getReservationsByUserId } from '../controllers/reservationController'


const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id', updateUserInfo)
userRouter.delete('/:id', deleteUser)

userRouter.get('/:id/borrow-history', getBorrowHistoryByUserId)
userRouter.get('/:id/cart', getCartByUserId)
userRouter.get('/:user_id/notification', getNotificationsByUserId)
userRouter.patch("/:id/notification", updateNotificationsById)
userRouter.get('/:id/read-history', getReadHistoryByUserId)
userRouter.get('/:id/reservation', getReservationsByUserId)

export default userRouter