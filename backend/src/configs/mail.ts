import nodemailer from 'nodemailer'

const getTransporter = () => {
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    if (!mailUser || !mailPass) {
        throw new Error('Missing email credentials: MAIL_USER and MAIL_PASS must be set in environment variables');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailUser,
            pass: mailPass
        }
    });
};

export const sendVerifyEmail = async (email: string, link: string) => {
    console.log('📩 Verify email', link)
}

export const sendResetPasswordEmail = async (email: string, link: string) => {
    console.log('📩 Reset password email', link)
}

