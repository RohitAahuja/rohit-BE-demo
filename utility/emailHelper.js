const nodemailer = require("nodemailer");

const { EMAILCONFIG } = require("../constants/constant");

const transporter = nodemailer.createTransport({
  service: EMAILCONFIG.DEFAULTSERVICE,
  auth: {
    user: EMAILCONFIG.DEFAULTSENDEREMAILID,
    pass: EMAILCONFIG.DEFAULTSENDERPWD,
  },
});

const mailConfig = (to, text, subject, html) => {
  return {
    from: EMAILCONFIG.DEFAULTSENDEREMAILID,
    to,
    subject: subject || EMAILCONFIG.DEFAULTSUBJECT,
    text: text || EMAILCONFIG.DEFAULTTEXT,
    html: html || EMAILCONFIG.DEFAULTHTML,
  };
};

exports.sendEmail = (req, text) => {
  const mailOptions = mailConfig(req.body.email, text);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
