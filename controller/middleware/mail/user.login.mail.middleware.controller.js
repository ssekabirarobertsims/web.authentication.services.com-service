"use strict";
debugger;
const nodemailer = require("nodemailer");
const { format } = require("date-fns");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.MAILER,
    pass: process.env.MAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = async function (to, subject, username) {
  try {
    await transporter.sendMail({
      from: process.env.MAILER,
      to: to,
      subject: subject,
      html: `
                <h1>Account Login!</h1>
                <p>Hi ${username}, you have been able to log into your account successfully on ${format(
        new Date(),
        "yyyy-MM-dd"
      )}</p>
                <strong>Username: ${username}</strong>
                <strong>Email: ${to}</strong>
                <strong>Date: ${format(new Date(), "yyyy-MM-dd")}</strong>
                <strong>Service Provider: <a href="https://web-auth-services.netlify.app" target="_blank">Web Authentication Services</a></strong>
                <br />
                <p>Thank you for using our platform!</p>
                <br />
                <a href="https://web-auth-services.netlify.app/" target="_blank">👉 Authentication Web Services</a>
                <p>Enjoy your stay!</p>
                <br />
                <p>Best Regards From <a href="https://ssekabirarobertsims.netlify.app/" target="_blank">robert sims</a> </p>
                `,
      text: subject,
    });

    console.log(`sent email to ${to}`);
  } catch (error) {
    console.log(error);
  }
};
