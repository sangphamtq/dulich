import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../libs/axios.ts";
import Input from "../components/Input/Input.tsx";
import { LogIn } from "lucide-react";
import Button from "../components/Button.tsx";
import Footer from "../components/Footer.tsx";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get("status");
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageStatus, setMessageStatus] = useState<"idle" | "success" | "error">("idle");

  if (status !== "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Invalid</h2>
          <p className="text-gray-600 mb-6">Reset link expired or invalid. Please request a new password reset.</p>
          <a
            href="/forgot-password"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      setMessageStatus("error");
      return;
    }

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters");
      setMessageStatus("error");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      setMsg("Password reset successful. Redirecting...");
      setMessageStatus("success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      setMsg(error.response?.data?.message || "Reset failed. Please try again.");
      setMessageStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    //   <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
    //     <div className="text-center mb-8">
    //       <h2 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
    //       <p className="mt-2 text-sm text-gray-600">
    //         Nhập mật khẩu mới của bạn bên dưới
    //       </p>
    //     </div>

    //     <form onSubmit={submit} className="space-y-6">
    //       <Input
    //         type='password'
    //         label="Mật khẩu mới"
    //         id="password"
    //         placeholder="Nhập mật khẩu"
    //         helperText="Tối thiểu 6 kí tự"
    //         value={password}
    //         onChange={(value) => setPassword(value)}
    //       />

    //       <Input
    //         type='password'
    //         label="Xác nhận mật khẩu"
    //         id="confirmPassword"
    //         placeholder="Xác nhận mật khẩu mới"
    //         value={confirmPassword}
    //         onChange={(value) => setConfirmPassword(value)}
    //       />

    //       <button
    //         type="submit"
    //         disabled={loading || !password || !confirmPassword}
    //         className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
    //       >
    //         {loading ? (
    //           <span className="flex items-center justify-center">
    //             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    //               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //             </svg>
    //             Resetting...
    //           </span>
    //         ) : (
    //           "Đặt lại mật khẩu"
    //         )}
    //       </button>

    //       {msg && (
    //         <div className={`p-4 rounded-lg ${messageStatus === "success"
    //           ? "bg-green-50 border border-green-200"
    //           : "bg-red-50 border border-red-200"
    //           }`}>
    //           <div className="flex items-start">
    //             {messageStatus === "success" ? (
    //               <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    //               </svg>
    //             ) : (
    //               <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    //               </svg>
    //             )}
    //             <p className={`text-sm ${messageStatus === "success" ? "text-green-800" : "text-red-800"
    //               }`}>
    //               {msg}
    //             </p>
    //           </div>
    //         </div>
    //       )}
    //     </form>

    //     <div className="mt-6 text-center">
    //       <a href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
    //         ← Quay lại trang chủ
    //       </a>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen flex flex-col bg-surface">
      <div className="grow flex items-center justify-center my-4">
        <div className="w-[800px] flex rounded-xl shadow-lg overflow-hidden">
          <div className="w-1/2 bg-primary-300 px-5">
            <img src="./banner_dulich.png" className="h-full object-contain"></img>
          </div>
          <form onSubmit={submit} className="bg-white w-1/2 rounded-r-xl px-10 pt-12 pb-20 relative flex flex-col justify-center">
            <Link to="/login" className="absolute top-4 left-10 flex items-center gap-1 hover:text-primary transition">
              <LogIn className="size-3" />
              <span className="text-xs">Đăng nhập</span>
            </Link>
            <h2 className="text-center font-semibold text-xl mb-10">ĐẶT LẠI MẬT KHẨU</h2>
            <Input
              type='password'
              label="Mật khẩu mới"
              id="password"
              placeholder="Nhập mật khẩu"
              helperText="Tối thiểu 6 kí tự"
              value={password}
              onChange={(value) => setPassword(value)}
              className="mb-4"
            />

            <Input
              type='password'
              label="Xác nhận mật khẩu"
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(value) => setConfirmPassword(value)}
              className="mb-4"
            />
            <Button className="w-full mb-3 py-3" type="submit">Đặt lại mật khẩu</Button>
            {msg && (
              <div className={`p-4 rounded-lg ${messageStatus === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
                }`}>
                <div className="flex items-start">
                  {messageStatus === "success" ? (
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className={`text-sm ${messageStatus === "success" ? "text-green-800" : "text-red-800"
                    }`}>
                    {msg}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}