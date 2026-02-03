import { Worker } from "bullmq";
import sendEmail from "../helpers/sendEmail";
import redisClient from "../helpers/redis";
import { verificationHtml } from "../helpers/verificationHtml";
import { forgotPasswordHtml } from "../helpers/forgetPasswordHtml";

new Worker(
  "emails",
  async (job) => {
    const { email, firstName, otp } = job.data;

    let subject = "";
    let html = "";

    if (job.name === "sendOtp") {
      subject = "Account verification OTP";
      html = verificationHtml(firstName, otp);
    } else if (job.name === "forgotPasswordOtp") {
      subject = "Your Password Reset OTP";
      html = forgotPasswordHtml(firstName, otp);
    } else {
      console.warn(`Unknown job name: ${job.name}`);
      return;
    }
    try {
      await sendEmail(email, subject, html);
      console.log(`✅ Email sent to ${email} for job: ${job.name}`);
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  },
  { connection: redisClient },
);
