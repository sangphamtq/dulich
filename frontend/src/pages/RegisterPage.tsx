import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { HomeIcon, LockIcon, User } from "lucide-react"
import Button from "../components/Button"
import { useState } from "react"
import api from "../libs/axios"
import GoogleLoginButton from "../components/GoogleLoginButton"
import Input from "../components/Input/Input"

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

    const onEmailChange = (value: string) => {
        setEmail(value)
    }

    const onPasswordChange = (value: string) => {
        setPassword(value)
    }

    const onConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value)
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
        <div className="min-h-screen flex flex-col bg-surface">
            <div className="grow flex items-center justify-center">

                {/* Main */}
                <div className="w-[800px] flex rounded-xl overflow-hidden bg-white shadow-lg">
                    {/* Left */}

                    <div className="w-1/2 bg-primary-300 px-6">
                        <img src="./banner_dulich.png"></img>
                    </div>

                    {/* Right */}
                    <div className="w-1/2 rounded-r-xl p-6 px-10 pt-12 pb-20 relative">
                        <Link to="/" className="absolute top-4 left-10 flex items-center gap-1 hover:text-primary transition">
                            <HomeIcon className="size-3" />
                            <span className="text-xs">Trang chủ</span>
                        </Link>
                        <h2 className="text-center font-semibold text-xl mb-10">ĐĂNG KÝ</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <Input
                                type="email"
                                label="Email"
                                id="email"
                                placeholder="Nhập email của bạn"
                                icon={User}
                                value={email}
                                onChange={onEmailChange}
                                invalid={!!errors.email}
                                helperText={errors.email}
                                className="mb-4"
                                required
                            />

                            {/* Password */}
                            <Input
                                type="password"
                                label="Mật khẩu"
                                id="password"
                                placeholder="Nhập mật khẩu của bạn"
                                icon={LockIcon}
                                value={password}
                                onChange={onPasswordChange}
                                invalid={!!errors.password}
                                helperText={errors.password}
                                className="mb-4"
                                required
                            />

                            {/* Confirm password */}
                            <Input
                                type="password"
                                label="Mật khẩu"
                                id="confirmPassword"
                                placeholder="Xác nhận mật khẩu"
                                icon={LockIcon}
                                value={confirmPassword}
                                onChange={onConfirmPasswordChange}
                                invalid={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                className="mb-4"
                                required
                            />

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
                            <Link to="/login" className="text-sm text-link underline hover:text-link-hover transition">Đăng nhập ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterPage