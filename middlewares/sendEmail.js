const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.ukr.net",
  port: 2525,
  secure: true,
  auth: {
    user: "contactsappservice@ukr.net",
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendMail = (userEmail, verificationToken) => {
  const emailOptions = {
    from: "contactsappservice@ukr.net",
    to: userEmail,
    subject: "Email verification",
    // text: `http://localhost:3000/users/verify/${verificationToken}`,
    html: `<p>Please follow link below to complete your email verification</p>
    <p>if you received this message mistakenly and you didn't register in contactsApp recently, just ignore this message</p>
    <a href="http://localhost:3000/users/verify/${verificationToken}">http://localhost:3000/users/verify/${verificationToken}</a>
    `,
  };
 
  return transporter.sendMail(emailOptions);
};

module.exports = sendMail;
