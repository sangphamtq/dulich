import { Link, useLocation } from "react-router-dom"


const VerifyEmailNoticePage = () => {
    const location = useLocation();
    const email = location.state?.email;

    return (
        <div className="min-h-screen bg-gray-50 px-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-3xl">📧</span>
                </div>

                {/* Title */}
                <h1 className="mt-6 text-2xl font-semibold text-gray-800">
                    Xác thực email của bạn
                </h1>

                {/* Description */}
                <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                    Chúng tôi đã gửi một email xác thực đến địa chỉ:
                </p>

                <p className="mt-2 font-medium text-gray-800 break-all">
                    {email || "email@cuaban.com"}
                </p>

                <p className="mt-4 text-gray-600 text-sm">
                    Vui lòng kiểm tra hộp thư (bao gồm cả Spam) và bấm vào link trong email để hoàn tất đăng ký.
                </p>

                {/* Open Gmail */}
                <Link to="https://mail.google.com" target="_blank" className="inline-block mt-6 text-primary font-medium hover:underline">Mở Gmail</Link>

                <p className="mt-6 text-xs text-gray-500">
                    Sai email?{" "}
                    <a href="/dang-ky" className="text-primary hover:underline">
                        Đăng ký lại
                    </a>
                </p>
            </div>
        </div>
    )
}

export default VerifyEmailNoticePage