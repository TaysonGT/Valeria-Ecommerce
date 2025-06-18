import express from 'express'
import { mongoDataSource } from './mongo-data-source'

const PORT = 5000
const app = express()

mongoDataSource.initialize()
.then(()=>{
    console.log('MongoDB Connection Initialized via TypeORM!')
    app.listen(PORT, ()=>{
        console.log(`Started Express Server on Port: ${PORT}`)
    })
})
.catch((err)=> console.error('connection error: ', err))

