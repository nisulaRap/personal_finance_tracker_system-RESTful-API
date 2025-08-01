const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});


async function sendEmailNotification(to, subject, message) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            html: message
        });
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}

module.exports = { sendEmailNotification };