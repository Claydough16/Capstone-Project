const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./models/users.model');
require('dotenv').config();

const sendPasswordResetMail = async (email) => {
    try {
        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object using SendGrid
        let transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: 'apikey', // this is fixed value
                pass: process.env.SENDGRID_API_KEY // your SendGrid API key
            }
        });

        const resetToken = crypto.randomBytes(32).toString('hex');

        // Update user with reset token
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { passwordReset: resetToken },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('User not found');
        }

        // Message object
        let message = {
            from: `Sender Name <${process.env.EMAIL}>`,
            to: `Recipient <${email}>`,
            subject: 'Use the link below to reset your password',
            text: 'Hello to myself!',
            html: `<a href="http://localhost:3000/password-reset?email=${email}&token=${resetToken}">Reset password</a>`
        };

        // Send email
        let info = await transporter.sendMail(message);

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        return nodemailer.getTestMessageUrl(info);
    } catch (err) {
        console.error('Error sending email:', err.message);
        throw err;
    }
}

module.exports = sendPasswordResetMail;
