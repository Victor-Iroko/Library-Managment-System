import express, { Request, Response } from 'express'
import 'express-async-errors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import { corsOptions } from './config/corsOption';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/authRoute';
import { logMiddleware } from './middlewares/logMiddleware';
import path from 'path';
import passport from './utils/passport'
import { authMiddleware } from './middlewares/authenticate';
import userRouter from './routes/userRoute';
// import bookRouter from './routes/bookRoute';
// import borrowRouter from './routes/borrowRoute';
import cron from 'node-cron'
import { addFine } from './utils/cronFunctions';
import { notifyAvailableReservations, notifyOverDueBorrows, notifyUnpaidFines } from './utils/cronNotification';
import bookRouter from './routes/bookRoute';
import borrowRouter from './routes/borrowRoute';
import cartRouter from './routes/cartRoute';
import isbnRouter from './routes/isbnRoute';
import paymentRouter from './routes/paymentRoute';
import readHistoryRouter from './routes/readHistoryRoute';
import reservationRouter from './routes/reservationRoute';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './config/swagger-output.json'



dotenv.config()


const app = express()

// add cron jobs
cron.schedule("0 0 * * 1", addFine) // every monday
cron.schedule("0 0 * * 2", notifyAvailableReservations) // every tuesday
cron.schedule("0 0 * * 3", notifyOverDueBorrows) // every wednesday
cron.schedule("0 0 * * 4", notifyUnpaidFines) // every thursday


const publicDir = path.join(path.dirname(process.argv[1]), 'public'); // path to the public folder

//middlware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.static(publicDir))


// logging middlewares
app.use(logMiddleware)


// authentication routes
app.use("/auth", authRouter /* 
    #swagger.tags = ['Auth'] 
    */)

// docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/db-docs', (_req: Request, res: Response) => {
    // #swagger.tags = ['Docs']
    // #swagger.summary = 'Retrieve API documentation.'
    // #swagger.description = 'Provides the database documentation in a structured format.'
    // #swagger.ignore = true
    console.log(path.join(publicDir,"index.html"))
    res.sendFile(path.join(publicDir,"index.html"))
})

// authentication middleware
app.use(passport.initialize()) // don't know what it does, saw it in a tutorial
app.use(authMiddleware)

// routes
app.use('/user', userRouter /* 
    #swagger.tags = ['User']

    #swagger.security = [{
        "bearerAuth": []
    }]   
    */)
app.use('/book', bookRouter /* 
    #swagger.tags = ['Book']

    #swagger.security = [{
        "bearerAuth": []
    }]   
    */)
app.use('/borrow', borrowRouter /* 
    #swagger.tags = ['Borrow']

    #swagger.security = [{
        "bearerAuth": []
    }]  
    */)
app.use('/cart', cartRouter /* 
    #swagger.tags = ['Cart']

    #swagger.security = [{
        "bearerAuth": []
    }] 
    */)
app.use('/isbn', isbnRouter /* 
    #swagger.tags = ['Isbn']

    #swagger.security = [{
        "bearerAuth": []
    }]  
    */)
app.use('/payment', paymentRouter /* 
    #swagger.tags = ['Payment']

    #swagger.security = [{
        "bearerAuth": []
    }]  
    */)
app.use('/read-history', readHistoryRouter /* 
    #swagger.tags = ['Read History']

    #swagger.security = [{
        "bearerAuth": []
    }] 
    */)
app.use('/reservation', reservationRouter /* 
    #swagger.tags = ['Reservation']

    #swagger.security = [{
        "bearerAuth": []
    }]  
    */)


// not found
app.use(notFound)
// error handler middleware
app.use(errorHandler)


// start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))
