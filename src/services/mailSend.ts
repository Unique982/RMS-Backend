import nodemailer from "nodemailer";
import { emailConfigure } from "../controller/admin/emailConfig/emailConfig.Controller";

interface MailInfo {
  to: string;
  subject: string;
  text: string;
}
// mail dnamic
// static mailer
const mailSend = async (mailInformation: MailInfo) => {
  // config
  const config = await emailConfigure();

  // transport create garnu paro // servic and auth ko kura dinu paro
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpEncryption === "ssl",

    // service: "gmail",
    auth: {
      user: config.smtpUsername,
      // process.env.NODEMAILER_USERNAME,
      pass: config.smtpPassword,
      //  process.env.NODEMAILER_PASSWORD,
    },
  });

  // formate
  const mailFormated = {
    from: `"${config.emailSenderName}" ${config.smtpUsername}`,
    to: mailInformation.to,
    subject: mailInformation.subject,
    html: mailInformation.text,
  };
  try {
    await transporter.sendMail(mailFormated);
  } catch (err) {
    console.log(err);
  }
};

export default mailSend;
