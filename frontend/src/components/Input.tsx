import { type LucideIcon } from 'lucide-react';

interface InputFieldProps {
    id: string;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    value: string;
    error?: string;
    icon?: LucideIcon;
    onChange: (value: string) => void;
}

const InputField = ({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    error,
    icon: Icon,
    onChange,
}: InputFieldProps) => {
    return (
        <div className="flex flex-col gap-1 mb-3">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>

            <div>
                <div className="relative mb-1">
                    {Icon && (
                        <Icon className="size-4 absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500 -mt-0.5" />
                    )}

                    <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full border-b pl-8 pr-3 py-1 focus:outline-none
              ${error ? 'border-red-400' : 'border-gray-400'}
            `}
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default InputField;
