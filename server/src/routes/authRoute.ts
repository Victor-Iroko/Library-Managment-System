import express from 'express'
import { loginController, logoutController, refreshTokenController, registerController} from '../controllers/authController'

const authRouter = express.Router()



authRouter.post('/register', registerController)

authRouter.get('/login', loginController)
authRouter.get('/refresh', refreshTokenController)
authRouter.get('/logout', logoutController)


export default authRouter