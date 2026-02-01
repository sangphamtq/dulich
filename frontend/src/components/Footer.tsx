import { Link } from "react-router-dom"


function Footer() {
    return (
        <div className="w-full border-t border-[#f0f2f4]">
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center text-sm text-gray-500">
                    © 2026 {" "} <Link to='/' className="text-link hover:text-link-hover transition hover:underline ml-1"> dulichvietnam.com</Link>. Trang thông tin về các dịch vụ du lịch.
                </div>
            </div>
        </div>
    )
}

export default Footer