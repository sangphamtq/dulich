import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './configs/db.ts'
import authRouter from './routes/auth.routes.ts'
const app = express()

dotenv.config()
app.use(express.json())

console.log('--------------🎒 🏕️  🗺️  ✈️  🛍️  📸 🎧 🎫 -----------------')

const PORT: number | string = process.env.PORT || 3001

app.use(cors({
    origin: process.env.CLIENT_URL
}))

app.use('/auth', authRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🌐 Server is running in http://localhost:${PORT}`)
    })
})