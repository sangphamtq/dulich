import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { HomeIcon, Lock, UserIcon } from "lucide-react"
import Button from "../components/Button"
import { useState } from "react"
import api from "../libs/axios"
import GoogleLoginButton from "../components/GoogleLoginButton"

type FieldErrorsType = {
    email?: string,
    password?: string,
    confirmPassword?: string
}

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("sangpv8@gmail.com");
    const [password, setPassword] = useState<string>("111111");
    const [confirmPassword, setConfirmPassword] = useState<string>("111111");
    const [errors, setErrors] = useState<FieldErrorsType>({ email: '', password: '', confirmPassword: '', });
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate()

    const onEmailChange = (e: any) => {
        setEmail(e.target.value)
    }

    const onPasswordChange = (e: any) => {
        setPassword(e.target.value)
    }

    const onConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        setErrors({ email: '', password: '', confirmPassword: '' });
        setMessage('');

        const fieldErrors: FieldErrorsType = {}

        if (!email) {
            fieldErrors.email = 'Email không được để trống';
        }

        if (!password) {
            fieldErrors.password = 'Mật khẩu không được để trống';
        } else if (password.length < 6) {
            fieldErrors.password = 'Mật khẩu phải ít nhất 6 ký tự';
        }

        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        setLoading(true)

        try {
            const createUser = await api.post('/auth/register', { email, password })
            const { success, message } = createUser.data
            if (success) {
                navigate('/verify-email-notice', {
                    state: {
                        email
                    }
                })
            }
            setMessage(message)
        } catch (error: any) {
            if (error?.response?.status === 409) {
                setMessage(error.response.data.message)
                return;
            }
            setMessage('Lỗi server khi đăng kí')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="grow flex items-center justify-center">

                {/* Main */}
                <div className="w-[800px] flex rounded-xl overflow-hidden">
                    {/* Left */}

                    <div className="w-1/2 bg-amber-200 px-6">
                        <img src="./banner_dulich.png"></img>
                    </div>

                    {/* Right */}
                    <div className="border-t border-r border-b border-amber-200 w-1/2 rounded-r-xl p-6 px-10 pt-12 pb-20 relative">
                        <Link to="/" className="absolute top-4 left-10 flex items-center gap-1 hover:text-primary transition">
                            <HomeIcon className="size-3" />
                            <span className="text-xs">Trang chủ</span>
                        </Link>
                        <h2 className="text-center font-semibold text-xl mb-10">ĐĂNG KÝ</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="flex flex-col gap-1 mb-3">
                                <label htmlFor="email" className="text-sm font-normal">Email</label>
                                <div className="relative">
                                    <UserIcon className={`size-4 absolute left-1.5 top-1/2 -translate-y-1/2 -mt-0.5  ${errors.email ? 'text-red-500' : 'text-gray-500'}`} />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Nhập email của bạn"
                                        className={`w-full border-b pl-8 pr-3 py-1 flex items-center focus:outline-none
                                            ${errors.email ? 'border-red-400' : 'border-gray-400'}
                                        `}
                                        value={email}
                                        onChange={onEmailChange}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1 mb-3">
                                <label htmlFor="password" className="text-sm font-normal">Mật khẩu</label>
                                <div className="relative">
                                    <Lock className={`size-4 absolute left-1.5 top-1/2 -translate-y-1/2 -mt-0.5 ${errors.password ? 'text-red-500' : 'text-gray-500'}`} />
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        className={`w-full border-b pl-8 pr-3 py-1 flex items-center focus:outline-none
                                             ${errors.password ? 'border-red-400' : 'border-gray-400'}
                                        `}
                                        value={password}
                                        onChange={onPasswordChange}
                                    />
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Confirm password */}
                            <div className="flex flex-col gap-1 mb-3">
                                <label htmlFor="confirmPassword" className="text-sm font-normal">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <Lock className={`size-4 absolute left-1.5 top-1/2 -translate-y-1/2 -mt-0.5 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-500'}`} />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Nhập lại mật khẩu của bạn"
                                        className={`w-full border-b pl-8 pr-3 py-1 flex items-center focus:outline-none
                                             ${errors.confirmPassword ? 'border-red-400' : 'border-gray-400'}
                                        `}
                                        value={confirmPassword}
                                        onChange={onConfirmPasswordChange}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            {/* Submit button */}
                            <Button className="w-full mb-3 py-3" type="submit" loading={loading}>Đăng ký</Button>
                        </form>
                        <p className="text-sm text-red-600 min-h-5">{message}</p>
                        <p className="text-center text-sm text-gray-600 mb-3 mt-4">Hoặc đăng nhập bằng</p>
                        <div className="flex justify-center gap-3 mb-4">
                            <GoogleLoginButton />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">Đã có tài khoản? </p>
                            <Link to="/login" className="text-sm text-secondary underline hover:text-secondary-hover">Đăng nhập ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterPage