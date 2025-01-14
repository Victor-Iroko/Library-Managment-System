import nodemailer from 'nodemailer'
import { getEnvVar } from './getEnv'
import logger from './logger'


//transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: 465, // SSL/TLS port
    // secure: true, // Use SSL
    auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASSWORD')
    },
    // debug: true,
    // logger: true
})


export const sendEmailNotification = async (to: string, subject: string, text: string) => {
    // Email options
    const mailOptions = {
        from: `"Library Management system" <${getEnvVar('SMTP_USER')}>`, // sender address
        to: to, // Recipient(s)
        subject: subject, // Subject line
        text: text // Plain text body
    }

    // send email
    try {
        const info = await transporter.sendMail(mailOptions)
        logger('email-notification').info(`'Email sent', ${info.response}`)
        return 'Sent'
    } catch (error) {
        logger('email-notification').error(`Error sending mail: ${error}`)
        return 'Error'
    }   
}