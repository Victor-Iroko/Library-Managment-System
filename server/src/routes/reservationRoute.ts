import express from 'express'
import { deleteReservation, reserveBook, updateReservation } from '../controllers/reservationController'



const reservationRouter = express.Router()

reservationRouter.post('/', reserveBook)
reservationRouter.patch('/:user_id/:book_id', updateReservation)
reservationRouter.delete('/:user_id/:book_id', deleteReservation)

export default reservationRouter