"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
const { format } = require("date-fns");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAILER,
        pass: process.env.MAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = async function (to, subject, username) {
    try {
        await transporter.sendMail({
            from: process.env.MAILER,
            to: to,
            subject: subject,
            html: `
                <p>Dear  ${String(username).toLocaleLowerCase()}, we’re thrilled and glad to have you on board with us.
                    Your account has been successfully created, and you can now log in to explore all the features we offer.
                </p>
                <strong>Username: ${username}</strong>
                <strong>Email: ${to}</strong>
                <strong>Date: ${format(new Date(), "yyyy-MM-dd")}</strong>
                <strong>Service Provider: <a href="https://web-auth-services.netlify.app" target="_blank">Web Authentication Services</a></strong>
                <br />
                <p>If you have any questions, feel free to reply to this email or contact our support developer at robertsims7076@gmail.com.</p>
                <span>Welcome aboard,</p>
                <a href="https://web-auth-services.netlify.app/" target="_blank">👉 Authentication Web Services</a>
                <p>Enjoy your stay!</p>
                <br />
                <p>Best Regards From <a href="https://robertsims.netlify.app/" target="_blank">robert sims</a> </p>
            `,
            text: subject
        });

        console.log(`sent email to ${to}`);
    } catch (error) {
        console.log(error);
    }
}