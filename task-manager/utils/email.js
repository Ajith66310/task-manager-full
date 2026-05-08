const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.EMAIL_PORT, 10) || 2525,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection configuration (Non-blocking)
  transporter.verify().then(() => {
    console.log("SMTP server connection verified");
  }).catch((err) => {
    console.warn("SMTP verification failed (Emails may not send):", err.message);
  });

  // 2) Define the email options
  const mailOptions = {
    from: `TaskFlow <${process.env.EMAIL_FROM || "no-reply@taskflow.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3) Actually send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error("Email send error:", error.message);
  }
};

module.exports = sendEmail;
