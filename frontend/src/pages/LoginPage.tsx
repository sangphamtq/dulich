import { HomeIcon, UserIcon, EyeOff, Eye, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Button from "../components/Button"
import { useState } from "react"
import api from "../libs/axios"
import { useAuth } from "../auth/AuthContext"
import GoogleLoginButton from "../components/GoogleLoginButton"


export const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({})
    const [serverError, setServerError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const auth = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
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
        <div className="min-h-screen flex flex-col">
            <div className="grow flex items-center justify-center my-4">
                <div className="w-[800px] flex rounded-xl overflow-hidden">
                    <div className="w-1/2 bg-amber-200">
                        <img src="./banner_dulich.png" className="h-full object-contain"></img>
                    </div>
                    <form onSubmit={handleSubmit} className="border-t border-r border-b border-amber-200 w-1/2 rounded-r-xl px-10 pt-12 pb-20 relative">
                        <Link to="/" className="absolute top-4 left-10 flex items-center gap-1 hover:text-primary transition">
                            <HomeIcon className="size-3" />
                            <span className="text-xs">Trang chủ</span>
                        </Link>
                        <h2 className="text-center font-semibold text-xl mb-10">ĐĂNG NHẬP</h2>
                        <div className="flex flex-col gap-1 mb-3">
                            <label htmlFor="email" className="text-sm font-normal">Email</label>
                            <div>
                                <div className="relative mb-2">
                                    <UserIcon className="size-4 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500 -mt-0.5" />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Nhập email của bạn"
                                        className={`w-full border-b pl-8 pr-3 py-1 flex items-center focus:outline-none
                                            ${errors.email ? 'border-red-400' : 'border-gray-400'}
                                        `}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (errors.email) {
                                                setErrors(prev => ({ ...prev, email: '' }))
                                            }
                                        }}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mb-3">
                            <div className="flex justify-between">
                                <label htmlFor="password" className="text-sm font-normal">Mật khẩu</label>
                                <Link to='/forgot-password' className="text-sm font-normal text-secondary hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <div>
                                <div className="relative mb-2">
                                    <Lock className="size-4 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500 -mt-0.5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        className={`w-full border-b pl-8 pr-3 py-1 flex items-center focus:outline-none
                                            ${errors.password ? 'border-red-400' : 'border-gray-400'}
                                        `}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: '' }))
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>
                        </div>
                        <Button className="w-full mb-3 py-3" type="submit" loading={loading}>Đăng nhập</Button>
                        <p className="text-sm text-red-600 min-h-5">{serverError}</p>
                        <p className="text-center text-sm text-gray-600 mb-3 mt-4">Hoặc đăng nhập bằng</p>
                        <div className="flex justify-center gap-3 mb-4">
                            <GoogleLoginButton />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">Chưa có tài khoản? </p>
                            <Link to="/register" className="text-sm text-secondary underline hover:text-primary-hover">Đăng ký ngay</Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}
