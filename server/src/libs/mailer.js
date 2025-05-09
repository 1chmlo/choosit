import nodemailer from "nodemailer";
import {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM} from "../config.js";

// Create a transporter for SMTP
export const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });


  //ALTERNATIVA 1: RECIBE TO, SUBJECT Y HTML
export async function sendMail(to, subject, html) {
    try {
      const mailOptions = {
        from: SMTP_FROM, // Make sure to add SMTP_FROM to your config
        to,
        subject,
        html,
      };
      
      const info = await transport.sendMail(mailOptions);
      return info;
      // Returns an object with format:
      /* {
          messageId: "<b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>",
          envelope: {
              from: "sender@example.com",
              to: ["receiver@example.com"]
          },
          accepted: ["receiver@example.com"],
          rejected: [],
          pending: [],
          response: "250 2.0.0 OK 1234567890 abcdef"
      }*/
      
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }

  //ALTERNATIVA 2: RECIBE TO, USERNAME, TOKEN Y RUTA
  export async function sendVerificationEmail(to, username, verificationToken, verificationUrl) {
    const fullVerificationUrl = `${verificationUrl}?token=${verificationToken}`;
    
    const subject = "Por favor, confirma tu dirección de correo electrónico";
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Verificación de correo electrónico</h2>
        <p>Hola ${username},</p>
        <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${fullVerificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirmar mi correo electrónico
          </a>
        </div>
        <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
          ${fullVerificationUrl}
        </p>
        <p>Este enlace expirará en 24 horas.</p>
        <p>Si no solicitaste esta verificación, puedes ignorar este correo electrónico.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e4; color: #777; font-size: 12px;">
          <p>Este es un correo electrónico automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    `;
    
    return await sendMail(to, subject, html);
  }


