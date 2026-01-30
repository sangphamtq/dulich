import { Link, NavLink } from "react-router-dom"
import logo from '../assets/logo.svg'
import { useAuth } from "../auth/AuthContext"
import { useEffect, useRef, useState } from "react"
import { Book, Folder, LogOutIcon, User } from "lucide-react"

const Header = () => {
    const { user, logout } = useAuth()
    console.log(user)
    const email = (user as any)?.email as string | undefined
    const displayName = user?.name || user?.email || "Người dùng"
    const avatarUrl =
        (user as any)?.picture || (user as any)?.avatar || (user as any)?.avatarUrl
    const initial = (displayName?.trim()?.[0] || "U").toUpperCase()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const menus = [
        { to: '/', label: 'Trang chủ', end: true },
        { to: '/timdo', label: 'Homestay' },
        { to: '/nhatduoc', label: 'Dịch vụ' },
        { to: '/blog', label: 'Tin tức' }
    ]

    const navClass = ({ isActive }: { isActive: boolean }) => `
        h-full flex items-center px-4 text-md font-medium hover:text-primary transition-colors 
        ${isActive ? 'text-primary hover:text-primary-hover' : ''}
    `

    useEffect(() => {
        if (!open) return

        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as Node | null
            if (!target) return
            if (menuRef.current && !menuRef.current.contains(target)) {
                setOpen(false)
            }
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", onMouseDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    return (
        <header className="w-full border-b border-solid border-[#f0f2f4]">
            <div className="max-w-7xl mx-auto flex justify-between px-4 py-3">
                <Link to="/" className="font-bold tracking-tight flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <img src={logo} />
                    </div>
                    <span className="text-lg">Du lịch việt nam</span>
                </Link>

                <div className="flex items-center">
                    {menus.map(({ to, label, end }) => (
                        <NavLink key={to} to={to} end={end} className={navClass}>{label}</NavLink>
                    ))}
                </div>
                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setOpen(v => !v)}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#f0f2f4] transition cursor-pointer"
                            aria-haspopup="menu"
                            aria-expanded={open}
                            title={displayName}
                        >
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="User avatar"
                                    className="size-9 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div
                                    className="size-9 rounded-full bg-purple-100 text-gray-800 flex items-center justify-center font-semibold select-none"
                                    aria-label="User avatar"
                                >
                                    {initial}
                                </div>
                            )}
                            <div className="max-w-[180px] truncate text-sm font-semibold text-gray-800">
                                {displayName}
                            </div>
                            <svg className="size-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {open && (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-48 rounded-lg border border-[#f0f2f4] bg-white shadow-lg overflow-hidden p-1"
                            >
                                <div className="px-2 py-1.5 text-muted-foreground text-xs leading-none">{email}</div>
                                <div className="bg-gray-100 -mx-1 my-1 h-px"></div>
                                <Link
                                    to="/"
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md font-nornal hover:bg-[#f0f2f4] transition cursor-pointer flex items-center gap-2"
                                >
                                    <User className="size-4 text-primary" /> Trang cá nhân
                                </Link>
                                <Link
                                    to="/"
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md font-nornal hover:bg-[#f0f2f4] transition cursor-pointer flex items-center gap-2"
                                >
                                    <Folder className="size-4 text-primary" /> Bài đăng
                                </Link>
                                <Link
                                    to="/"
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md font-nornal hover:bg-[#f0f2f4] transition cursor-pointer flex items-center gap-2"
                                >
                                    <Book className="size-4 text-primary" /> Blog
                                </Link>
                                <div className="bg-gray-100 -mx-1 my-1 h-px"></div>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setOpen(false)
                                        logout()
                                    }}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md font-medium hover:bg-[#f0f2f4] transition cursor-pointer flex items-center gap-2"
                                >
                                    <LogOutIcon className="size-4 text-primary" /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="px-5 py-2 bg-[#f0f2f4] rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Đăng nhập</Link>
                        <Link to="/register" className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition">Đăng ký</Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header