const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require("./models/users.model");

const sendPasswordResetMail = async (email) => {
    try {
        // Generate SMTP service account from ethereal.email
        let account = await nodemailer.createTestAccount();

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
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
            from: 'Sender Name <sender@example.com>',
            to: `Recipient <${ email }>`,
            subject: 'Use the link below to reset your password',
            text: 'Hello to myself!',
            html: `<a href=http://localhost:3000/password-reset?email=${email}&token=${resetToken}>Reset password</a>`
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

module.exports = sendPasswordResetMail
