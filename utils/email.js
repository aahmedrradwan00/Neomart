const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: 'localhost',
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    await transport.sendMail({
        from: `"Neomart E-commerce"<${process.env.EMAIL_USERNAME}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};

module.exports = sendEmail;
