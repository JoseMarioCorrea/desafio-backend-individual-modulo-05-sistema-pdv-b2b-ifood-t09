const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const enviarEmail = ( nome, email, assunto, texto) => {
    transport.sendMail({
      from: `Isadora Caz <isadora.caz@gmail.com>`,
      to: `${nome} <${email}>`,
      subject: assunto,
      text: texto
    });
  };

module.exports = enviarEmail;