const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // e.g., your-email@gmail.com
      pass: process.env.EMAIL_PASSWORD, // Your 16-character Gmail App Password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: '"Sentry Family Tracker" <noreply@sentry.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
