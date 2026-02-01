import { HomeIcon, Lock, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Button from "../components/Button"
import { useState } from "react"
import api from "../libs/axios"
import { useAuth } from "../auth/AuthContext"
import GoogleLoginButton from "../components/GoogleLoginButton"
import Input from "../components/Input/Input"


export const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({})
    const [serverError, setServerError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const auth = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        setServerError('')

        const fieldsError: { email?: string, password?: string } = {}
        if (!email) {
            fieldsError.email = 'Vui lòng nhập email'
        }

        if (!password) {
            fieldsError.password = 'Vui lòng nhập mật khẩu'
        }

        if (password.length < 6) {
            fieldsError.password = 'Mật khẩu không hợp lệ'
        }

        if (Object.keys(fieldsError).length > 0) {
            setErrors(fieldsError)
            return
        }

        setLoading(true)

        const request = await api.post('/auth/login', {
            email,
            password
        })

        if (request.data.success) {
            auth.login(request.data.token)
        } else {
            setServerError(request.data.message)
            if (request.data.code === 'EMAIL_NOT_VERIFIED') {
                navigate('/verify-email-notice', {
                    state: {
                        email
                    }
                })
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <div className="grow flex items-center justify-center my-4">
                <div className="w-[800px] flex rounded-xl shadow-lg overflow-hidden">
                    <div className="w-1/2 bg-primary-300 px-5">
                        <img src="./banner_dulich.png" className="h-full object-contain"></img>
                    </div>
                    <form onSubmit={handleSubmit} className="bg-white w-1/2 rounded-r-xl px-10 pt-12 pb-20 relative">
                        <Link to="/" className="absolute top-4 left-10 flex items-center gap-1 hover:text-primary transition">
                            <HomeIcon className="size-3" />
                            <span className="text-xs">Trang chủ</span>
                        </Link>
                        <h2 className="text-center font-semibold text-xl mb-10">ĐĂNG NHẬP</h2>
                        <Input
                            type="email"
                            label="Email"
                            id="email"
                            placeholder="Nhập email của bạn"
                            icon={User}
                            value={email}
                            onChange={(value) => {
                                setEmail(value)
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: '' }))
                                }
                            }}
                            invalid={!!errors.email}
                            helperText={errors.email}
                            className="mb-4"
                        />
                        <Input
                            type="password"
                            label="Mật khẩu"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            icon={Lock}
                            link={{
                                url: '/forgot-password',
                                text: 'Quên mật khẩu?',
                                target: '_self'
                            }}
                            value={password}
                            onChange={(value) => {
                                setPassword(value)
                                if (errors.password) {
                                    setErrors(prev => ({ ...prev, password: '' }))
                                }
                            }}
                            invalid={!!errors.password}
                            helperText={errors.password}
                            className="mb-4"
                        />
                        <Button className="w-full mb-3 py-3" type="submit" loading={loading}>Đăng nhập</Button>
                        <p className="text-sm text-red-600 min-h-5">{serverError}</p>
                        <p className="text-center text-sm text-gray-600 mb-3 mt-4">Hoặc đăng nhập bằng</p>
                        <div className="flex justify-center gap-3 mb-4 font-medium">
                            <GoogleLoginButton />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">Chưa có tài khoản? </p>
                            <Link to="/register" className="text-sm text-link hover:text-link-hover hover:underline transition">Đăng ký ngay</Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}
