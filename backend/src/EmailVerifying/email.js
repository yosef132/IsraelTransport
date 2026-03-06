require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(email, subject, htmlContent) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: htmlContent
        });
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}

async function sendVerificationEmail(email, code) {
    const subject = 'Your Verification Code';
    const htmlContent = `<p>Your verification code is:</p><h1>${code}</h1>`;
    await sendEmail(email, subject, htmlContent);
}

module.exports = { sendVerificationEmail, sendEmail };
