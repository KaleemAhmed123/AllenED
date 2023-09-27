import { createTransport } from "nodemailer";

// takes email, title and body;
const mailSender = (email, title, body) => {
  try {
    let transporter = createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
      },
    });

    let info = transporter.sendMail({
      from: "myDemy || Kaleem Ahmed",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;
