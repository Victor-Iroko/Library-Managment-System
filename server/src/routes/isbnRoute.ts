import express from 'express'
import { addISBN, deleteISBN, getBookIdByIsbn } from '../controllers/isbnController'


const isbnRouter = express.Router()

isbnRouter.post('/', addISBN)
isbnRouter.delete('/:isbn', deleteISBN)
isbnRouter.get('/:isbn/book-id', getBookIdByIsbn)


export default isbnRouter