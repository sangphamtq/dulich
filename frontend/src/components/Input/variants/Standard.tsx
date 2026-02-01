import { Link } from "react-router-dom"
import type { InputProps } from "../types"


const StandardInput = ({
    type = 'text',
    id,
    label,
    required,
    placeholder,
    helperText,
    disabled,
    invalid,
    icon,
    link,
    className,
    value,
    onChange
}: InputProps) => {
    const Icon = icon
    return (
        <div className={`w-full flex flex-col items-start justify-start gap-1 ${className}`}>
            <div className="w-full flex flex-col items-start justify-start">
                <label htmlFor={id} className={`w-full pb-1 flex items-center justify-between ${disabled ? 'cursor-auto' : 'cursor-pointer'}`}>
                    <div className="peer flex gap-1 text-sm font-medium">
                        {label}
                        {required && <span className="text-brand-tertiary block text-primary">*</span>}
                    </div>
                    {link?.url && <Link to={link.url} className="text-sm text-link hover:text-link-hover hover:underline transition" target={link?.target || '_blank'}>{link.text || link.url}</Link>}
                </label>
                <div className="group w-full relative shadow-xs rounded-lg place-items-center group">
                    {Icon && (
                        <Icon className="absolute left-3 size-4 top-1/2 -translate-y-1/2 text-[#a4a7ae] -mt-px" />
                    )}
                    <input
                        type={type}
                        id={id}
                        placeholder={placeholder}
                        disabled={disabled}
                        value={value}
                        className={`w-full text-md rounded-lg outline-hidden px-3 py-2 pr-9 ring-1 ring-default ring-inset focus:ring-primary focus:ring-2 group-hover:ring-hover peer-hover:ring-hover transition
                            ${disabled ? 'bg-[#fafafa] group-hover:ring-default!' : ''}
                            ${invalid ? 'ring-error focus:ring-error! group-hover:ring-error!' : ''}
                            ${icon ? 'pl-10' : ''}
                        `}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </div>
            <span className={`text-sm ${invalid ? 'text-error' : 'text-helper'}`}>{helperText}</span>
        </div>
    )
}

export default StandardInput