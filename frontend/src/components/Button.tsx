import { Loader2 } from "lucide-react"
import type { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode,
    className?: string,
    type?: "button" | "submit" | "reset" | undefined,
    loading?: boolean,
    onClick?: () => void
}

const Button = ({ children, className, type="button", loading = false, onClick }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`
                px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition cursor-pointer flex items-center justify-center gap-2
                ${className}
                ${loading ? ' pointer-events-none bg-primary-300! transition-none!' : ''}
            `}
            disabled={loading}
        >
            {loading && <Loader2 className="size-4 animate-spin" />}{children}
        </button>
    )
}

export default Button