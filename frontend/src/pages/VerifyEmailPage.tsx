import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const [msg, setMsg] = useState("Verifying email...");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const statusParam = params.get("status");
        const token = params.get("token");
        console.log('status', statusParam);
        console.log('token', token);

        if (statusParam === "success" && token) {
            auth?.login(token);
            setMsg("Xác nhận email thành công! Đang đăng nhập...");
            setStatus("success");
            setTimeout(() => navigate("/"), 1500);
        } else if (statusParam === "expired") {
            setMsg("Link xác thực hết hạn");
            setStatus("error");
        } else if (statusParam === 'already-verified') {
            setMsg("Tài khoản đã xác thực");
            setStatus("error");
        } else {
            setMsg("Link xác thực không hợp lệ");
            setStatus("error");
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === "loading" && (
                    <div className="mb-4">
                        <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {status === "success" && (
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}

                {status === "error" && (
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}

                <h2 className={`text-2xl font-semibold ${status === "success" ? "text-green-700" :
                    status === "error" ? "text-red-700" :
                        "text-gray-700"
                    }`}>
                    {msg}
                </h2>

                {status === "error" && (
                    <p className="mt-4 text-gray-600">
                        Hãy thử lại hoặc liên hệ support
                    </p>
                )}
            </div>
        </div>
    );
}