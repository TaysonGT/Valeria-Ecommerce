import express from 'express'
import cors from 'cors'
import BodyParser from 'body-parser'
import CookieParser from 'cookie-parser'
import productRouter from './routes/product.route'
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/Valeria', {dbName: 'Valeria'})
.then(()=>{
    console.log('connected to MongoDB!')
}).catch((err)=> console.error(err))

const PORT = 5000
const app = express()

app.use(cors({
    credentials: true
}))
app.use(express.json())
app.use(BodyParser.json())
app.use(CookieParser())
app.use(express.urlencoded({extended:true}))

app.use('/products', productRouter)

app.listen(PORT, ()=>{
    console.log(`Started Express Server on Port: ${PORT}`)
})
