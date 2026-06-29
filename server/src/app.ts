import express from 'express'
import cors from 'cors'
import BodyParser from 'body-parser'
import CookieParser from 'cookie-parser'
import productRouter from './routes/product.route'
import userRouter from './routes/user.route'
import orderRouter from './routes/order.route'
import mongoose from 'mongoose'
import reportingRouter from './routes/reporting.route'
require('dotenv').config();

const allowedOrigins = process.env.NODE_ENV == 'production' ? process.env.FRONTEND_URL : true

const PORT = 5000
const app = express()

app.use(cors({
  credentials: true,
  origin: allowedOrigins
}))
app.use(express.json())
app.use(CookieParser())
app.use(BodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use('/products', productRouter)
app.use('/users', userRouter)
app.use('/orders', orderRouter)
app.use('/reports', reportingRouter)


const startServer = async()=>{
  await mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/valeria')
  .then(() => {
      console.log('connected to MongoDB!')
    })
    .catch((err) => console.error(err))

  app.listen(PORT, () => {
    console.log(`Started Express Server on Port: ${PORT}`)
  })
}

startServer()