// src/utils/jwtUtils.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Esta función genera un código de verificación simple, puedes ajustarla según tus necesidades.
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Esta función envía un correo electrónico con el código de verificación.
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", 
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Contenido del correo electrónico
    const mailOptions = {
      from: "franciscoo@dominio.com",
      to: email,
      subject: "Código de Verificación",
      text: `Tu código de verificación es: ${verificationCode}`,
    };

    // Envía el correo electrónico
    //****IMPORTANTE******/
    //Se comento la linea de abajo por que mandara error y 
    //tira el servidor si no se tiene configurado el correo
    //await transporter.sendMail(mailOptions);

    console.log(`Correo electrónico de verificación enviado a: ${email}`);
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de verificación:",
      error.message
    );
    throw new Error("Error al enviar el correo electrónico de verificación");
  }
};

// Agrega otras funciones relacionadas con JWT según sea necesario...
