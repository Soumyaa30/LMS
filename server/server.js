import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebHooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'

//Initialize express
const app = express()

app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebHooks)


//middlewares
app.use(cors({
    origin: 'http://localhost:3000', // your local frontend
    credentials: true
  }))

  await connectDB()
  connectCloudinary()
  console.log("Cloudinary connected");

  app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

  express.json()
  app.use(clerkMiddleware())

//routes
app.get('/', (req, res)=> res.send("API Working"))
//app.post('/clerk', express.json(), clerkWebHooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)






//port
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})