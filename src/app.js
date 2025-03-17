import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
dotenv.config({path:'./.env'})
const app = express()

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended:true, limit: '16kb'}))
app.use(cookieParser())
app.use(express.static('public'))
app.use(cors({origin:process.env.CORS_ORIGIN}))

// import routes
import bookRouter from './routes/book.routes.js'
import userRouter from './routes/user.routes.js'

//routes declaration
app.use('/api/v1/users/' , userRouter)
app.use('/api/v1/books/' , bookRouter)



export { app }
