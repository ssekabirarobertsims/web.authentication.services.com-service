"use strict";
debugger;
const nodemailer = require("nodemailer");
require("dotenv").config();
const { format } = require("date-fns");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAILER,
        pass: process.env.MAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = async function (to, subject, service, owner_username) {
    try {
        await transporter.sendMail({
            from: process.env.MAILER,
            to: to,
            subject: subject,
            html: `
                <h1>Welcome to Authentication Web Services</h1>
                <p>
                    Dear ${String(owner_username).toLocaleLowerCase()}, welcome to the platform! We’re thrilled to have you on board.
                    Your service has been successfully created, and you can now log in to explore all the features we offer.
                </p>
                <strong>Service Name: ${service}</strong>
                 <strong>Service Owner: ${owner_username}</strong>
                <strong>Date: ${format(new Date(), "yyyy-MM-dd")}</strong>
                <br />
                <a href="https://web-auth-services.netlify.app/service/login" target="_blank">👉 Login Now</a>
                <br />
                <p>If you have any questions, feel free to reply to this email or contact our support developer at robertsims7076@gmail.com.</p>
                <span>Welcome aboard,</p>
                <a href="https://web-auth-services.netlify.app/" target="_blank">👉 Authentication Web Services</a>
                <p>Enjoy your stay!</p>
                <br />
                <p>Best Regards From <a href="https://robertsims.netlify.app/" target="_blank">robert sims</a> </p>
            `,
      text: subject,
    });

    console.log(`sent email to ${to}`);
  } catch (error) {
    console.log(error);
  }
};
