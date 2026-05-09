import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

export const sendEmailFromFrontend = async (toEmail, subject, message) => {
  try {
    const templateParams = {
      to_email: toEmail,
      subject: subject,
      message: message,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Frontend email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Frontend EmailJS Error:', error);
    throw error;
  }
};
