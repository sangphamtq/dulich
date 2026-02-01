import { useState, useEffect } from "react"
import { useAuth } from "../auth/AuthContext"
import { User, Mail, Lock, Camera, CheckCircle2, XCircle, Shield, Edit2, Save, X, Menu, X as XIcon, Book, Settings, CreditCard, History } from "lucide-react"
import Button from "../components/Button"
import Input from "../components/Input/Input"

const Profile = () => {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [activeSection, setActiveSection] = useState<string>("profile")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Profile form state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string
        newPassword?: string
        confirmPassword?: string
    }>({})

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setEmail(user.email || "")
        }
    }, [user])

    const handleUpdateProfile = async () => {
        if (!user) return

        setLoading(true)
        setMessage(null)

        try {
            // TODO: Implement update profile endpoint in backend
            // const response = await api.put("/auth/profile", { name, email })
            // await login(localStorage.getItem("token") || "")

            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' })
            setIsEditing(false)
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (!user) return

        setPasswordErrors({})
        setMessage(null)

        const errors: typeof passwordErrors = {}

        if (!currentPassword) {
            errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc'
        }

        if (!newPassword) {
            errors.newPassword = 'Mật khẩu mới là bắt buộc'
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors)
            return
        }

        setLoading(true)

        try {
            // TODO: Implement change password endpoint in backend
            // await api.post("/auth/change-password", {
            //     currentPassword,
            //     newPassword
            // })

            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' })
            setIsChangingPassword(false)
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
            })
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Vui lòng đăng nhập để xem trang cá nhân</p>
                </div>
            </div>
        )
    }

    const displayName = user.name || user.email || "Người dùng"
    const avatarUrl = (user as any)?.picture || (user as any)?.avatar || (user as any)?.avatarUrl
    const initial = (displayName?.trim()?.[0] || "U").toUpperCase()
    const isEmailVerified = (user as any)?.isEmailVerified || false
    const authProviders = (user as any)?.authProviders || []

    const menuItems = [
        { id: "profile", label: "Thông tin cá nhân", icon: User },
        { id: "password", label: "Đổi mật khẩu", icon: Lock },
        { id: "settings", label: "Cài đặt tài khoản", icon: Settings },
        { id: "bookings", label: "Đặt chỗ của tôi", icon: Book },
        { id: "history", label: "Lịch sử", icon: History },
        { id: "payment", label: "Thanh toán", icon: CreditCard },
    ]

    const renderContent = () => {
        switch (activeSection) {
            case "profile":
                return renderProfileSection()
            case "password":
                return renderPasswordSection()
            case "settings":
                return renderSettingsSection()
            case "bookings":
                return renderBookingsSection()
            case "history":
                return renderHistorySection()
            case "payment":
                return renderPaymentSection()
            default:
                return renderProfileSection()
        }
    }

    const renderProfileSection = () => (
        <>
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="size-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="size-32 rounded-full bg-white text-purple-600 flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg">
                                    {initial}
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 size-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition">
                                <Camera className="size-5 text-gray-700" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {displayName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Mail className="size-4" />
                                    <span>{user.email}</span>
                                </div>
                                {isEmailVerified ? (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <CheckCircle2 className="size-4 text-white" />
                                        <span className="text-sm text-white">Đã xác thực</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <XCircle className="size-4 text-white" />
                                        <span className="text-sm text-white">Chưa xác thực</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Thông tin cá nhân
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            >
                                <Edit2 className="size-4" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setName(user?.name || "")
                                        setEmail(user?.email || "")
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="size-4" />
                                    Lưu thay đổi
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={setName}
                            disabled={!isEditing}
                            icon={User}
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={setEmail}
                            disabled={!isEditing}
                            icon={Mail}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="size-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="size-32 rounded-full bg-white text-purple-600 flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg">
                                    {initial}
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 size-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition">
                                <Camera className="size-5 text-gray-700" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {displayName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Mail className="size-4" />
                                    <span>{user.email}</span>
                                </div>
                                {isEmailVerified ? (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <CheckCircle2 className="size-4 text-white" />
                                        <span className="text-sm text-white">Đã xác thực</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <XCircle className="size-4 text-white" />
                                        <span className="text-sm text-white">Chưa xác thực</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Thông tin cá nhân
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            >
                                <Edit2 className="size-4" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setName(user?.name || "")
                                        setEmail(user?.email || "")
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="size-4" />
                                    Lưu thay đổi
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={setName}
                            disabled={!isEditing}
                            icon={User}
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={setEmail}
                            disabled={!isEditing}
                            icon={Mail}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="size-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="size-32 rounded-full bg-white text-purple-600 flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg">
                                    {initial}
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 size-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition">
                                <Camera className="size-5 text-gray-700" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {displayName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Mail className="size-4" />
                                    <span>{user.email}</span>
                                </div>
                                {isEmailVerified ? (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <CheckCircle2 className="size-4 text-white" />
                                        <span className="text-sm text-white">Đã xác thực</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <XCircle className="size-4 text-white" />
                                        <span className="text-sm text-white">Chưa xác thực</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Thông tin cá nhân
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            >
                                <Edit2 className="size-4" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setName(user?.name || "")
                                        setEmail(user?.email || "")
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="size-4" />
                                    Lưu thay đổi
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={setName}
                            disabled={!isEditing}
                            icon={User}
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={setEmail}
                            disabled={!isEditing}
                            icon={Mail}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="size-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="size-32 rounded-full bg-white text-purple-600 flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg">
                                    {initial}
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 size-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition">
                                <Camera className="size-5 text-gray-700" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {displayName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Mail className="size-4" />
                                    <span>{user.email}</span>
                                </div>
                                {isEmailVerified ? (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <CheckCircle2 className="size-4 text-white" />
                                        <span className="text-sm text-white">Đã xác thực</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <XCircle className="size-4 text-white" />
                                        <span className="text-sm text-white">Chưa xác thực</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Thông tin cá nhân
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            >
                                <Edit2 className="size-4" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setName(user?.name || "")
                                        setEmail(user?.email || "")
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="size-4" />
                                    Lưu thay đổi
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={setName}
                            disabled={!isEditing}
                            icon={User}
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={setEmail}
                            disabled={!isEditing}
                            icon={Mail}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="size-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="size-32 rounded-full bg-white text-purple-600 flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg">
                                    {initial}
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 size-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition">
                                <Camera className="size-5 text-gray-700" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {displayName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Mail className="size-4" />
                                    <span>{user.email}</span>
                                </div>
                                {isEmailVerified ? (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <CheckCircle2 className="size-4 text-white" />
                                        <span className="text-sm text-white">Đã xác thực</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <XCircle className="size-4 text-white" />
                                        <span className="text-sm text-white">Chưa xác thực</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Thông tin cá nhân
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
                            >
                                <Edit2 className="size-4" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setName(user?.name || "")
                                        setEmail(user?.email || "")
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="size-4" />
                                    Lưu thay đổi
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="name"
                            label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={setName}
                            disabled={!isEditing}
                            icon={User}
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={setEmail}
                            disabled={!isEditing}
                            icon={Mail}
                        />
                    </div>
                </div>
            </div>
        </>
    )

    const renderPasswordSection = () => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Lock className="size-5 text-primary" />
                        Đổi mật khẩu
                    </h3>
                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition"
                        >
                            <Edit2 className="size-4" />
                            Đổi mật khẩu
                        </button>
                    )}
                </div>

                {isChangingPassword && (
                    <div className="space-y-4">
                        <Input
                            id="currentPassword"
                            label="Mật khẩu hiện tại"
                            type="password"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            icon={Lock}
                            invalid={!!passwordErrors.currentPassword}
                            helperText={passwordErrors.currentPassword}
                        />
                        <Input
                            id="newPassword"
                            label="Mật khẩu mới"
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={setNewPassword}
                            icon={Lock}
                            invalid={!!passwordErrors.newPassword}
                            helperText={passwordErrors.newPassword}
                        />
                        <Input
                            id="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            icon={Lock}
                            invalid={!!passwordErrors.confirmPassword}
                            helperText={passwordErrors.confirmPassword}
                        />
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => {
                                    setIsChangingPassword(false)
                                    setCurrentPassword("")
                                    setNewPassword("")
                                    setConfirmPassword("")
                                    setPasswordErrors({})
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Hủy
                            </button>
                            <Button
                                onClick={handleChangePassword}
                                loading={loading}
                            >
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </div>
                )}

                {!isChangingPassword && (
                    <p className="text-gray-500 text-sm">
                        Đảm bảo mật khẩu của bạn có ít nhất 6 ký tự và khó đoán.
                    </p>
                )}
            </div>
        </div>
    )

    const renderSettingsSection = () => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Shield className="size-5 text-primary" />
                    Cài đặt tài khoản
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-900">Xác thực email</p>
                            <p className="text-sm text-gray-600">
                                {isEmailVerified
                                    ? "Email của bạn đã được xác thực"
                                    : "Vui lòng xác thực email để bảo mật tài khoản"}
                            </p>
                        </div>
                        {isEmailVerified ? (
                            <CheckCircle2 className="size-6 text-green-500" />
                        ) : (
                            <XCircle className="size-6 text-yellow-500" />
                        )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-900">Phương thức đăng nhập</p>
                            <p className="text-sm text-gray-600">
                                {authProviders.includes('google') && authProviders.includes('local')
                                    ? "Google & Email/Password"
                                    : authProviders.includes('google')
                                        ? "Google"
                                        : "Email/Password"}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {authProviders.includes('google') && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    Google
                                </span>
                            )}
                            {authProviders.includes('local') && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    Local
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderBookingsSection = () => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Book className="size-5 text-primary" />
                    Đặt chỗ của tôi
                </h3>
                <div className="text-center py-12">
                    <Book className="size-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có đặt chỗ nào</p>
                </div>
            </div>
        </div>
    )

    const renderHistorySection = () => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <History className="size-5 text-primary" />
                    Lịch sử
                </h3>
                <div className="text-center py-12">
                    <History className="size-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có lịch sử nào</p>
                </div>
            </div>
        </div>
    )

    const renderPaymentSection = () => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <CreditCard className="size-5 text-primary" />
                    Thanh toán
                </h3>
                <div className="text-center py-12">
                    <CreditCard className="size-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có phương thức thanh toán nào</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex gap-6 relative">
                    {/* Sidebar */}
                    <aside className={`
                        fixed md:sticky inset-y-0 left-0 z-50 md:z-auto
                        w-64 bg-white shadow-xl rounded-2xl
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                        md:translate-x-0
                        h-fit md:top-27 md:self-start
                    `}>
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-gray-200 rounded-t-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <XIcon className="size-5 text-gray-600" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className="size-10 rounded-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="size-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                                        {initial}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Menu */}
                        <nav className="p-4 pb-6">
                            <ul className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => {
                                                    setActiveSection(item.id)
                                                    setSidebarOpen(false)
                                                }}
                                                className={`
                                                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                                                ${activeSection === item.id
                                                        ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                    }
                                            `}
                                            >
                                                <Icon className="size-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </aside>

                    {/* Overlay for mobile */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="p-6">
                            {/* Mobile Header */}
                            <div className="md:hidden mb-6 flex items-center justify-between bg-white rounded-lg p-4 shadow-md">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <Menu className="size-6 text-gray-700" />
                                </button>
                                <h1 className="text-xl font-bold text-gray-900">Trang Cá Nhân</h1>
                                <div className="w-10" /> {/* Spacer */}
                            </div>

                            {/* Desktop Header */}
                            <div className="hidden md:block text-center mb-8">
                                <h1 className="text-4xl font-black text-gray-900 mb-2">
                                    {menuItems.find(item => item.id === activeSection)?.label || "Trang Cá Nhân"}
                                </h1>
                                <p className="text-gray-600">Quản lý thông tin và cài đặt tài khoản của bạn</p>
                            </div>

                            {/* Message Alert */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    {message.type === 'success' ? (
                                        <CheckCircle2 className="size-5 shrink-0" />
                                    ) : (
                                        <XCircle className="size-5 shrink-0" />
                                    )}
                                    <span>{message.text}</span>
                                    <button
                                        onClick={() => setMessage(null)}
                                        className="ml-auto"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            <div>
                                {renderContent()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Profile