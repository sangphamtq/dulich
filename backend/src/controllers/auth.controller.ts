import bcrypt from 'bcrypt'
import validator from 'validator'
import mongoose from 'mongoose'
import type { Request, Response } from 'express'
import User from '../models/User.ts'
import { signToken, verifyToken } from '../utils/jwt.ts'
import { sendResetPasswordEmail, sendVerifyEmail } from '../configs/mail.ts'
import { validateEmail, validatePassword } from '../validators/authValidator.ts'
import { ERROR_CODES } from '../constants/errorCodes.ts'
import logger from '../utils/logger.ts'

export async function register(req: Request, res: Response) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { email, password } = req.body

        logger.info('Registration attempt', {
            email,
            ip: req.ip,
            userAgent: req.get('user-agent')
        })

        const sanitizedEmail = validator.normalizeEmail(email) || '';
        const trimmedPassword = password?.trim();

        if (!sanitizedEmail || !trimmedPassword) {
            await session.abortTransaction()
            logger.warn('Registration failed - missing fields', { email })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.MISSING_FIELDS,
                message: 'Email và mật khẩu là bắt buộc.'
            })
        }

        if (!validateEmail(sanitizedEmail)) {
            await session.abortTransaction()
            logger.warn('Registration failed - invalid email', { email: sanitizedEmail })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.INVALID_EMAIL,
                message: 'Định dạng email không hợp lệ.'
            })
        }

        const { valid, message } = validatePassword(trimmedPassword)
        if (!valid) {
            await session.abortTransaction()
            logger.warn('Registration failed - invalid password', { password: trimmedPassword })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.WEAK_PASSWORD,
                message
            })
        }

        if (await User.exists({ email: sanitizedEmail })) {
            await session.abortTransaction()
            logger.warn('Registration failed - account exists', { email: sanitizedEmail })

            return res.status(409).json({
                success: false,
                code: ERROR_CODES.ACCOUNT_EXISTS,
                message: 'Tài khoản đã tồn tại'
            })
        }

        const passwordHash = await bcrypt.hash(trimmedPassword, 10)

        const user = await User.create([{
            email: sanitizedEmail,
            password: passwordHash,
            authProviders: ['local']
        }], { session })

        const createdUser = Array.isArray(user) ? user[0] : user;

        logger.info('User registered successfully', {
            userId: createdUser._id,
            email: sanitizedEmail
        })

        const token = signToken({ userId: createdUser._id.toString(), email: sanitizedEmail });
        const verifyLink = `${process.env.API_URL}/auth/verify-email?token=${token}`

        await sendVerifyEmail(sanitizedEmail, verifyLink)
        await session.commitTransaction()

        logger.info('Verification email sent', {
            userId: createdUser._id,
            email: sanitizedEmail
        })

        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công, hãy xác nhận email!"
        })
    } catch (error: any) {
        await session.abortTransaction()

        logger.error('Registration error', {
            email: req.body?.email,
            error: error.message,
            stack: error.stack
        })

        return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Có lỗi xảy ra trong quá trình đăng ký.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        session.endSession()
    }
}

export async function verifyEmail(req: Request, res: Response) {
    const { token } = req.query

    try {
        logger.info('Email verification attempt', {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            hasToken: !!token
        })

        if (!token) {
            logger.warn('Email verification failed - missing token')
            return res.redirect(
                `${process.env.CLIENT_URL}/verify-email?status=invalid&message=${encodeURIComponent('Token không hợp lệ')}`
            )
        }

        let decoded
        try {
            decoded = verifyToken(token.toString())
        } catch (jwtError: any) {
            logger.warn('Email verification failed - invalid token', {
                error: jwtError.message
            })

            if (jwtError.name === 'TokenExpiredError') {
                return res.redirect(
                    `${process.env.CLIENT_URL}/verify-email?status=expired&message=${encodeURIComponent('Link xác nhận đã hết hạn')}`
                )
            }

            return res.redirect(
                `${process.env.CLIENT_URL}/verify-email?status=invalid&message=${encodeURIComponent('Token không hợp lệ')}`
            )
        }

        const { userId, email } = decoded

        if (!userId) {
            logger.warn('Email verification failed - missing userId in token')
            return res.redirect(
                `${process.env.CLIENT_URL}/verify-email?status=invalid&message=${encodeURIComponent('Token không hợp lệ')}`
            )
        }

        const user = await User.findById(userId)

        if (!user) {
            logger.warn('Email verification failed - user not found', { userId })
            return res.redirect(
                `${process.env.CLIENT_URL}/verify-email?status=invalid&message=${encodeURIComponent('Người dùng không tồn tại')}`
            )
        }

        if (user.isEmailVerified) {
            logger.info('Email already verified', {
                userId: user._id,
                email: user.email
            })

            const loginToken = signToken({
                userId: user._id.toString(),
                email: user.email
            })

            return res.redirect(
                `${process.env.CLIENT_URL}/verify-email?status=already-verified&token=${loginToken}&message=${encodeURIComponent('Email đã được xác nhận trước đó')}`
            )
        }

        user.isEmailVerified = true

        if (!user.authProviders.includes('local')) {
            user.authProviders.push('local')
        }

        await user.save()

        logger.info('Email verified successfully', {
            userId: user._id,
            email: user.email
        })

        const loginToken = signToken({
            userId: user._id.toString(),
            email: user.email
        })

        return res.redirect(
            `${process.env.CLIENT_URL}/verify-email?status=success&token=${loginToken}&message=${encodeURIComponent('Xác nhận email thành công')}`
        )

    } catch (error: any) {
        logger.error('Email verification error', {
            error: error.message,
            stack: error.stack,
            token: req.query.token ? 'present' : 'missing'
        })

        return res.redirect(
            `${process.env.CLIENT_URL}/verify-email?status=error&message=${encodeURIComponent('Có lỗi xảy ra trong quá trình xác nhận email')}`
        )
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        logger.info('Login attempt', {
            email,
            ip: req.ip,
            userAgent: req.get('user-agent')
        })

        const sanitizedEmail = validator.normalizeEmail(email) || ''
        const trimmedPassword = password?.trim()

        // Validation: Missing fields
        if (!sanitizedEmail || !trimmedPassword) {
            logger.warn('Login failed - missing fields', { email })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.MISSING_FIELDS,
                message: 'Email và mật khẩu là bắt buộc.'
            })
        }

        // Validation: Email format
        if (!validateEmail(sanitizedEmail)) {
            logger.warn('Login failed - invalid email format', { email: sanitizedEmail })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.INVALID_EMAIL,
                message: 'Định dạng email không hợp lệ.'
            })
        }

        // Find user
        const user = await User.findOne({ email: sanitizedEmail })

        if (!user) {
            logger.warn('Login failed - user not found', { email: sanitizedEmail })

            return res.status(401).json({
                success: false,
                code: 'INVALID_CREDENTIALS',
                message: 'Email hoặc mật khẩu không đúng.'
            })
        }

        // Check if user has password (for OAuth users)
        if (!user.password) {
            logger.warn('Login failed - no password set', {
                userId: user._id,
                email: sanitizedEmail,
                authProviders: user.authProviders
            })

            return res.status(401).json({
                success: false,
                code: 'NO_PASSWORD_SET',
                message: 'Tài khoản này đăng nhập bằng mạng xã hội. Vui lòng sử dụng phương thức đăng nhập tương ứng.'
            })
        }

        // Verify password
        const isMatch = await bcrypt.compare(trimmedPassword, user.password)

        if (!isMatch) {
            logger.warn('Login failed - incorrect password', {
                userId: user._id,
                email: sanitizedEmail
            })

            return res.status(401).json({
                success: false,
                code: 'INVALID_CREDENTIALS',
                message: 'Email hoặc mật khẩu không đúng.'
            })
        }

        // Check email verification
        if (!user.isEmailVerified) {
            logger.info('Login failed - email not verified, sending verification email', {
                userId: user._id,
                email: sanitizedEmail
            })

            // Generate verification token
            const verificationToken = signToken({
                userId: user._id.toString(),
                email: sanitizedEmail
            }, '30m')
            const verifyLink = `${process.env.API_URL}/auth/verify-email?token=${verificationToken}`

            // Try to send verification email
            try {
                await sendVerifyEmail(sanitizedEmail, verifyLink)

                logger.info('Verification email resent', {
                    userId: user._id,
                    email: sanitizedEmail
                })

                return res.status(403).json({
                    success: false,
                    code: 'EMAIL_NOT_VERIFIED',
                    message: 'Tài khoản chưa xác thực. Chúng tôi đã gửi lại email xác nhận cho bạn.'
                })
            } catch (mailError: any) {
                logger.error('Failed to send verification email on login', {
                    userId: user._id,
                    email: sanitizedEmail,
                    error: mailError.message
                })

                return res.status(403).json({
                    success: false,
                    code: 'EMAIL_NOT_VERIFIED',
                    message: 'Tài khoản chưa xác thực. Không thể gửi email xác nhận, vui lòng liên hệ quản trị viên.'
                })
            }
        }

        // Generate login token
        const token = signToken({
            userId: user._id.toString(),
            email: user.email
        })

        logger.info('Login successful', {
            userId: user._id,
            email: sanitizedEmail
        })

        // Return success with safe user data (no password)
        return res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id.toString(),
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                authProviders: user.authProviders
            }
        })

    } catch (error: any) {
        logger.error('Login error', {
            email: req.body?.email,
            error: error.message,
            stack: error.stack
        })

        return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Có lỗi xảy ra trong quá trình đăng nhập.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}


export async function googleLogin(req: Request, res: Response) {
    try {
        const { googleId, email, name, picture } = req.body

        logger.info('Google login attempt', {
            email,
            hasGoogleId: !!googleId,
            ip: req.ip,
            userAgent: req.get('user-agent')
        })

        const sanitizedEmail = validator.normalizeEmail(email) || ''

        // Validation: Missing required fields
        if (!googleId || !sanitizedEmail) {
            logger.warn('Google login failed - missing fields', {
                email,
                hasGoogleId: !!googleId
            })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.MISSING_FIELDS,
                message: 'Google ID và email là bắt buộc.'
            })
        }

        // Validation: Email format
        if (!validateEmail(sanitizedEmail)) {
            logger.warn('Google login failed - invalid email format', {
                email: sanitizedEmail
            })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.INVALID_EMAIL,
                message: 'Định dạng email không hợp lệ.'
            })
        }

        // Find existing user
        let user = await User.findOne({ email: sanitizedEmail })

        if (!user) {
            // Create new user with Google
            user = await User.create({
                email: sanitizedEmail,
                name: name || undefined,
                picture: picture || undefined,
                googleId,
                isEmailVerified: true,
                authProviders: ['google']
            })

            logger.info('New user created via Google', {
                userId: user._id,
                email: sanitizedEmail,
                name
            })
        } else {
            // User exists - link Google account if not already linked
            let updated = false

            if (!user.googleId) {
                user.googleId = googleId
                updated = true

                logger.info('Google ID linked to existing account', {
                    userId: user._id,
                    email: sanitizedEmail
                })
            }

            if (!user.authProviders.includes('google')) {
                user.authProviders.push('google')
                updated = true

                logger.info('Google provider added to existing account', {
                    userId: user._id,
                    email: sanitizedEmail
                })
            }

            // Auto-verify email when linking Google
            if (!user.isEmailVerified) {
                user.isEmailVerified = true
                updated = true

                logger.info('Email auto-verified via Google', {
                    userId: user._id,
                    email: sanitizedEmail
                })
            }

            // Update profile info if not set
            if (!user.name && name) {
                user.name = name
                updated = true
            }

            if (!user.picture && picture) {
                user.picture = picture
                updated = true
            }

            if (updated) {
                await user.save()
            }

            logger.info('Existing user logged in via Google', {
                userId: user._id,
                email: sanitizedEmail
            })
        }

        // Generate login token
        const token = signToken({
            userId: user._id.toString(),
            email: user.email
        })

        logger.info('Google login successful', {
            userId: user._id,
            email: sanitizedEmail
        })

        // Return success with safe user data
        return res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                picture: user.picture,
                isEmailVerified: user.isEmailVerified,
                authProviders: user.authProviders
            }
        })

    } catch (error: any) {
        logger.error('Google login error', {
            email: req.body?.email,
            error: error.message,
            stack: error.stack
        })

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                code: 'DUPLICATE_ACCOUNT',
                message: 'Tài khoản đã tồn tại với email này.'
            })
        }

        return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Có lỗi xảy ra trong quá trình đăng nhập Google.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        const { email } = req.body

        logger.info('Password reset request', {
            email,
            ip: req.ip,
            userAgent: req.get('user-agent')
        })

        const sanitizedEmail = validator.normalizeEmail(email) || ''

        // Validation: Missing email
        if (!sanitizedEmail) {
            logger.warn('Password reset failed - missing email')

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.MISSING_FIELDS,
                message: 'Email là bắt buộc.'
            })
        }

        // Validation: Email format
        if (!validateEmail(sanitizedEmail)) {
            logger.warn('Password reset failed - invalid email format', {
                email: sanitizedEmail
            })

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.INVALID_EMAIL,
                message: 'Định dạng email không hợp lệ.'
            })
        }

        // Find user
        const user = await User.findOne({ email: sanitizedEmail })

        // Security: Luôn trả về message giống nhau
        // để không tiết lộ email có tồn tại hay không
        const successMessage = 'Nếu email này tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu.'

        if (!user) {
            logger.info('Password reset requested for non-existent email', {
                email: sanitizedEmail
            })

            // Trả về success để không lộ thông tin
            return res.status(200).json({
                success: true,
                message: successMessage
            })
        }

        // Check if user has password (OAuth users might not)
        if (!user.password) {
            logger.warn('Password reset requested for OAuth-only account', {
                userId: user._id,
                email: sanitizedEmail,
                authProviders: user.authProviders
            })

            // Vẫn trả về success message để không lộ thông tin
            return res.status(200).json({
                success: true,
                message: successMessage
            })
        }

        // Generate reset token (15 minutes expiry)
        const resetToken = signToken(
            {
                userId: user._id.toString(),
                email: sanitizedEmail,
                type: 'password-reset'
            },
            '15m'
        )

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

        // Send reset email
        try {
            await sendResetPasswordEmail(sanitizedEmail, resetLink)

            logger.info('Password reset email sent', {
                userId: user._id,
                email: sanitizedEmail
            })

            return res.status(200).json({
                success: true,
                message: successMessage
            })
        } catch (mailError: any) {
            logger.error('Failed to send password reset email', {
                userId: user._id,
                email: sanitizedEmail,
                error: mailError.message,
                stack: mailError.stack
            })

            // Không nên trả về lỗi cụ thể để không lộ thông tin
            // Nhưng vẫn trả về success để UX tốt hơn
            return res.status(200).json({
                success: true,
                message: successMessage
            })
        }

    } catch (error: any) {
        logger.error('Password reset error', {
            email: req.body?.email,
            error: error.message,
            stack: error.stack
        })

        return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export async function verifyResetPassword(req: Request, res: Response) {
    const { token } = req.query

    try {
        logger.info('Reset password token verification attempt', {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            hasToken: !!token
        })

        // Validation: Missing token
        if (!token) {
            logger.warn('Reset password verification failed - missing token')

            return res.redirect(
                `${process.env.CLIENT_URL}/reset-password?status=invalid&message=${encodeURIComponent('Token không hợp lệ')}`
            )
        }

        // Verify JWT token
        let decoded
        try {
            decoded = verifyToken(token.toString())
        } catch (jwtError: any) {
            logger.warn('Reset password verification failed - invalid token', {
                error: jwtError.message
            })

            // Phân biệt token expired vs invalid
            if (jwtError.name === 'TokenExpiredError') {
                return res.redirect(
                    `${process.env.CLIENT_URL}/reset-password?status=expired&message=${encodeURIComponent('Link đặt lại mật khẩu đã hết hạn')}`
                )
            }

            return res.redirect(
                `${process.env.CLIENT_URL}/reset-password?status=invalid&message=${encodeURIComponent('Token không hợp lệ')}`
            )
        }

        // Validation: Check token type
        if (decoded.type !== 'password-reset') {
            logger.warn('Reset password verification failed - wrong token type', {
                tokenType: decoded.type,
                userId: decoded.userId
            })

            return res.redirect(
                `${process.env.CLIENT_URL}/reset-password?status=invalid&message=${encodeURIComponent('Token không hợp lệ cho việc đặt lại mật khẩu')}`
            )
        }

        // Validation: Check userId exists in token
        if (!decoded.userId) {
            logger.warn('Reset password verification failed - missing userId in token')

            return res.redirect(
                `${process.env.CLIENT_URL}/reset-password?status=invalid&message=${encodeURIComponent('Token không hợp lệ')}`
            )
        }

        logger.info('Reset password token verified successfully', {
            userId: decoded.userId,
            email: decoded.email
        })

        // Redirect to frontend with valid token
        return res.redirect(
            `${process.env.CLIENT_URL}/reset-password?status=success&token=${token}&message=${encodeURIComponent('Vui lòng nhập mật khẩu mới')}`
        )

    } catch (error: any) {
        logger.error('Reset password verification error', {
            error: error.message,
            stack: error.stack,
            token: req.query.token ? 'present' : 'missing'
        })

        return res.redirect(
            `${process.env.CLIENT_URL}/reset-password?status=error&message=${encodeURIComponent('Có lỗi xảy ra, vui lòng thử lại')}`
        )
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { token, password } = req.body

        logger.info('Password reset attempt', {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            hasToken: !!token
        })

        const trimmedPassword = password?.trim()

        // Validation: Missing fields
        if (!token || !trimmedPassword) {
            logger.warn('Password reset failed - missing fields')

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.MISSING_FIELDS,
                message: 'Token và mật khẩu là bắt buộc.'
            })
        }

        // Validation: Password strength
        const { valid, message } = validatePassword(trimmedPassword)
        if (!valid) {
            logger.warn('Password reset failed - weak password')

            return res.status(400).json({
                success: false,
                code: ERROR_CODES.WEAK_PASSWORD,
                message
            })
        }

        // Verify JWT token
        let decoded
        try {
            decoded = verifyToken(token)
        } catch (jwtError: any) {
            logger.warn('Password reset failed - invalid token', {
                error: jwtError.message
            })

            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    code: 'TOKEN_EXPIRED',
                    message: 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.'
                })
            }

            return res.status(401).json({
                success: false,
                code: 'INVALID_TOKEN',
                message: 'Token không hợp lệ.'
            })
        }

        // Validation: Check token type
        if (decoded.type !== 'password-reset') {
            logger.warn('Password reset failed - wrong token type', {
                tokenType: decoded.type
            })

            return res.status(401).json({
                success: false,
                code: 'INVALID_TOKEN',
                message: 'Token không hợp lệ cho việc đặt lại mật khẩu.'
            })
        }

        // Validation: Check userId exists in token
        if (!decoded.userId) {
            logger.warn('Password reset failed - missing userId in token')

            return res.status(401).json({
                success: false,
                code: 'INVALID_TOKEN',
                message: 'Token không hợp lệ.'
            })
        }

        // Find user
        const user = await User.findById(decoded.userId)

        if (!user) {
            logger.warn('Password reset failed - user not found', {
                userId: decoded.userId
            })

            return res.status(404).json({
                success: false,
                code: 'USER_NOT_FOUND',
                message: 'Người dùng không tồn tại.'
            })
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(trimmedPassword, 10)

        // Update user
        user.password = passwordHash

        if (!user.authProviders.includes('local')) {
            user.authProviders.push('local')
        }

        if (!user.isEmailVerified) {
            user.isEmailVerified = true
        }

        await user.save()

        logger.info('Password reset successful', {
            userId: user._id,
            email: user.email
        })

        return res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.'
        })

    } catch (error: any) {
        logger.error('Password reset error', {
            error: error.message,
            stack: error.stack
        })

        return res.status(500).json({
            success: false,
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}