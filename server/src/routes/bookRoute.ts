import express from 'express'
import { addBook, deleteBook, getBookById, getBooks, updateBookInfo } from '../controllers/bookController'
import { getBorrowedUsersByBookId } from '../controllers/borrowController'
import { getReservedUsersByBookId } from '../controllers/reservationController'


const bookRouter = express.Router()

bookRouter.get('/', getBooks)
bookRouter.get('/:id', getBookById)
bookRouter.post('/', addBook)
bookRouter.patch('/:id', updateBookInfo)
bookRouter.delete('/:id', deleteBook)

bookRouter.get('/:id/get-users-who-borrowed', getBorrowedUsersByBookId)
bookRouter.get('/:id/get-users-who-reserved', getReservedUsersByBookId)

export default bookRouter