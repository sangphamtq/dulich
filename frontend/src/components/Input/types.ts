import type { LucideIcon } from "lucide-react";

export type InputVariant = 'standard' | 'outlined' | 'filled' | 'underlined'
export type InputSize = 'small' | 'medium' | 'large'

export interface InputProps {
    variant?: InputVariant;
    type?: React.HTMLInputTypeAttribute;
    id?: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
    helperText?: string;
    disabled?: boolean;
    invalid?: boolean;
    icon?: LucideIcon;
    link?: { url: string, text?: string, target?: '_blank' | '_self' };
    className?: string;

    value?: string;
    onChange: (value: string) => void;
}