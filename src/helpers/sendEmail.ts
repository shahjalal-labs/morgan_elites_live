import nodemailer from "nodemailer";
import config from "../config";
const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string,
) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // TLS
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass, // Use App Password here
    },
  });

  // Email options
  const mailOptions = {
    from: `"Elites-Live Stream" <${config.emailSender.email}>`,
    to,
    subject,
    html,
    text,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
