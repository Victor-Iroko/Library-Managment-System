import express from 'express'
import { createBorrow, updateBorrow } from '../controllers/borrowController'


const borrowRouter = express.Router()

borrowRouter.post('/', createBorrow)
borrowRouter.patch('/:user_id/:book_id', updateBorrow)

export default borrowRouter