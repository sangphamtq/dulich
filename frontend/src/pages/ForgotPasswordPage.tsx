import { useState } from "react";
import axios from "../libs/axios";
import Input from "../components/Input/Input";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { HomeIcon, LogIn, MoveLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await axios.post("/auth/forgot-password", { email });
            setMsg(res.data.message);
            setStatus("success");
            setEmail("");
        } catch (error: any) {
            setMsg(error.response?.data?.message || "Something went wrong. Please try again.");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="min-h-screen flex flex-col bg-surface">
        //     <div className="flex grow items-center justify-center px-4">
        //         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        //             <div className="text-center mb-8">
        //                 <h2 className="text-3xl font-bold ">Quên Mật Khẩu</h2>
        //                 <p className="mt-2 text-sm text-gray-600">
        //                     Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
        //                 </p>
        //             </div>

        //             <form onSubmit={submit} className="space-y-6">

        //                 <Input
        //                     type="email"
        //                     label="Email"
        //                     id="email"
        //                     placeholder="Nhập email"
        //                     required
        //                     value={email}
        //                     onChange={(value) => setEmail(value)}
        //                 />

        //                 <Button className="w-full mb-3 py-3" type="submit">Gửi link</Button>

        //                 {msg && (
        //                     <div className={`p-4 rounded-lg ${status === "success"
        //                         ? "bg-green-50 border border-green-200"
        //                         : "bg-red-50 border border-red-200"
        //                         }`}>
        //                         <div className="flex items-start">
        //                             {status === "success" ? (
        //                                 <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        //                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        //                                 </svg>
        //                             ) : (
        //                                 <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        //                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        //                                 </svg>
        //                             )}
        //                             <p className={`text-sm ${status === "success" ? "text-green-800" : "text-red-800"
        //                                 }`}>
        //                                 {msg}
        //                             </p>
        //                         </div>
        //                     </div>
        //                 )}
        //             </form>

        //             <div className="mt-6 text-center">
        //                 <Link to="/login" className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-2 justify-center">
        //                     <MoveLeft /> Quay lại trang Đăng nhập
        //                 </Link>
        //             </div>
        //         </div>
        //     </div>
        //     <Footer />
        // </div>
        <div className="min-h-screen flex flex-col bg-surface">
            <div className="grow flex items-center justify-center my-4">
                <div className="w-[800px] flex rounded-xl shadow-lg overflow-hidden">
                    <div className="w-1/2 bg-primary-300 px-5">
                        <img src="./banner_dulich.png" className="h-full object-contain"></img>
                    </div>
                    <form onSubmit={submit} className="bg-white w-1/2 rounded-r-xl px-10 pt-12 pb-20 relative flex items-center flex-col justify-center">
                        <Link to="/login" className="absolute top-4 left-10 flex items-center gap-1 hover:text-primary transition">
                            <LogIn className="size-3" />
                            <span className="text-xs">Đăng nhập</span>
                        </Link>
                        <h2 className="text-center font-semibold text-xl mb-2">QUÊN MẬT KHẨU</h2>
                        <p className="mt-2 text-sm text-gray-600 mb-6">
                            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
                        </p>
                        <Input
                            type="email"
                            label="Email"
                            id="email"
                            placeholder="Nhập email"
                            required
                            value={email}
                            onChange={(value) => setEmail(value)}
                            className="mb-4"
                        />

                        <Button className="w-full mb-3 py-3" type="submit">Gửi link</Button>
                        {msg && (
                            <div className={`p-4 rounded-lg ${status === "success"
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                                }`}>
                                <div className="flex items-start">
                                    {status === "success" ? (
                                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <p className={`text-sm ${status === "success" ? "text-green-800" : "text-red-800"
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