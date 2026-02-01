import { Navigate, Outlet, useRoutes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import MainLayout from "../layouts/MainLayout"
import { LoginPage } from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import VerifyEmailNoticePage from "../pages/VerifyEmailNotice"
import VerifyEmailPage from "../pages/VerifyEmailPage"
import { useAuth } from "../auth/AuthContext"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import ResetPasswordPage from "../pages/ResetPasswordPage"
import NotFoundPage from "../pages/NotFoundPage"

export function AppRoutes() {
    const { user } = useAuth()

    return useRoutes([
        {
            element: <MainLayout />,
            children: [
                { path: '/', element: <HomePage /> }
            ]
        },
        {
            element: user ? <Navigate to="/" replace /> : <Outlet />,
            children: [
                { path: 'login', element: <LoginPage /> },
                { path: 'register', element: <RegisterPage /> },
            ]
        },
        { path: 'verify-email-notice', element: <VerifyEmailNoticePage /> },
        { path: 'verify-email', element: <VerifyEmailPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'reset-password', element: <ResetPasswordPage /> },
        { path: '*', element: <NotFoundPage /> }
    ])
}