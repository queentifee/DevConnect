const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendEmailOtp = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
          subject: 'Your DevConnect Verification Code',
    text: `Hi there!\n\nWelcome to DevConnect — we’re glad to have you.\n\nYour email verification code is: ${otp}\n\nThis code will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.\n\nThanks,  \nThe Peenly Team`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><h2>Hey SuperDev! Welcome to DevConnect</h2><p>We're glad to have you!</p><p>Your email verification code is:</p><h1 style="background: #f2f2f2; padding: 10px 20px; border-radius: 6px; display: inline-block; color: #111;">${otp}</h1><p>This code will expire in <strong>10 minutes</strong>.</p><p>If you didn’t request this, you can safely ignore this email.</p><br/><p style="font-size: 14px;">— DevConnect Team</p></div>`,

    };
    try {
        await transporter.sendMail(mailOptions);
        console.log ("Email sent!")
    } catch (error) {
        console.error("Nodemailer error:", error.message)
    }
};

const sendForgotPasswordOtp = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
          subject: 'DevConnect Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account
    .\n\nYour password reset otp is: ${otp}\n\nThis code will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.\n\nThanks,  \nDevConnect Team`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><h2>DevConnect Password Reset</h2><p>You are receiving this because you (or someone else) have requested the reset of the password for your account</p><p>Your password reset otp is:</p><h1 style="background: #f2f2f2; padding: 10px 20px; border-radius: 6px; display: inline-block; color: #111;">${otp}</h1><p>This code will expire in <strong>10 minutes</strong>.</p><p>If you didn’t request this, you can safely ignore this email.</p><br/><p style="font-size: 14px;">— DevConnect Team</p></div>`,

    };
    try {
        await transporter.sendMail(mailOptions);
        console.log ("Email sent!")
    } catch (error) {
        console.error("Nodemailer error:", error.message)
    }
};

module.exports = {
    sendEmailOtp, sendForgotPasswordOtp
}