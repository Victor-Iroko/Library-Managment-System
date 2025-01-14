import express from 'express'
import { addBookToCart, removeBookFromCart } from '../controllers/cartController'


const cartRouter = express.Router()

cartRouter.post('/', addBookToCart)
cartRouter.delete('/:user_id/:book_id', removeBookFromCart)

export default cartRouter