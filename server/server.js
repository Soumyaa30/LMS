import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebHooks } from './controllers/webhooks.js'

//Initialize express
const app = express()

app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebHooks)

//connect to database


//middlewares
app.use(cors({
    origin: 'http://localhost:3000', // your local frontend
    credentials: true
  }))

  connectDB()

//routes
app.get('/', (req, res)=> res.send("API Working"))
//app.post('/clerk', express.json(), clerkWebHooks)



//port
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})