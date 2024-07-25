import nodemailer from "nodemailer";

const sendEmail = async (opt: MailOptions) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
      user: process.env.MAIL_USER,

      pass: process.env.MAIL_PASS,
    },
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  });

  const mailOpts = {
    from: process.env.MAIL_SENDER,
    to: opt.email,
    subject: opt.subject,
    text: opt.message,
  };

  await transport.sendMail(mailOpts);
};

export default sendEmail;
