import express from 'express'
import { forgotPassword, googleLogin, login, register, resetPassword, verifyEmail, verifyResetPassword } from '../controllers/auth.controller.ts'

const router = express.Router()

router.post('/register', register)
router.get('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/google', googleLogin)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password', verifyResetPassword)
router.post('/reset-password', resetPassword)

export default router