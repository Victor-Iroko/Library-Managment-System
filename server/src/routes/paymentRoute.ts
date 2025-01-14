import express from 'express'
import { payFinesByUserId, verifyPaymentByReference } from '../controllers/paymentController'


const paymentRouter = express.Router()

paymentRouter.post('/:id', payFinesByUserId)
paymentRouter.get('/:reference', verifyPaymentByReference)


export default paymentRouter