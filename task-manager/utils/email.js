const emailjs = require("@emailjs/nodejs");

const sendEmail = async (options) => {
  try {
    // These parameters must match the {{variable_names}} in your EmailJS template
    const templateParams = {
      to_email: options.email,
      subject: options.subject,
      message: options.message,
      html_content: options.html, // Optional: if your template supports HTML
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("Email sent successfully via EmailJS:", response.status, response.text);
  } catch (error) {
    console.error("EmailJS Error:", error);
  }
};

module.exports = sendEmail;


