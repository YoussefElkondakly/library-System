import nodemailer from "nodemailer"

 const sendEmail = async (opt:MailOptions) => {
  // console.log("You are In Function with the ", opt);

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587, // or 465
    auth: {
      user: process.env.MAIL_USER,

      pass: process.env.MAIL_PASS,
    },
    secure: false, // use TLS
    tls: {
      rejectUnauthorized: false, // disable certificate verification
    },
    debug: true, // show debug output
    logger: true, // log information in console
  });

  const mailOpts = {
    from: process.env.MAIL_SENDER,
    to: opt.email,
    subject: opt.subject,
    text: opt.message,
  };

  await transport.sendMail(mailOpts);
};

export default sendEmail