import type { InputProps } from './types';
import StandardInput from './variants/Standard';

const Input = ({
    variant = 'standard',
    ...props
}: InputProps) => {
    switch (variant) {
        case 'standard':
            return <StandardInput {...props} />
    }
}

export default Input