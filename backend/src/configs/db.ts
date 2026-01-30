import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URL

    if (!uri) throw new Error('MONGODB_URL not set')

    try {
        await mongoose.connect(uri)
        console.log('✅ Connected to MongoDB')
    } catch (e) {
        console.error('❌ MongoDB connection error:', e)
        throw e
    }
}