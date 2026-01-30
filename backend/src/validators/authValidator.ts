export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < 6) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }
    return { valid: true };
}