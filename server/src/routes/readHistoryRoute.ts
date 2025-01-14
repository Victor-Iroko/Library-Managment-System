import express from 'express'
import { addBookToReadHistory, updateReadHistory } from '../controllers/readHistoryController'

const readHistoryRouter = express.Router()

readHistoryRouter.post('/', addBookToReadHistory)
readHistoryRouter.patch('/:user_id/:book_id', updateReadHistory)


export default readHistoryRouter