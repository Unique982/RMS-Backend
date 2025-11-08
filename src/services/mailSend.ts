import nodemailer from "nodemailer";

interface MailInfo {
  to: string;
  subject: string;
  text: string;
}
// mail dnamic
// static mailer
const mailSend = async (mailInformation: MailInfo) => {
  // transport create garnu paro // servic and auth ko kura dinu paro
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  // formate
  const mailFormated = {
    from: `The 90's Restaurant & Bar ${process.env.NODEMAILER_USERNAME}`,
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
