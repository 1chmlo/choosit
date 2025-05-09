import nodemailer from "nodemailer";
import {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, BACKEND_URL} from "../config.js";

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
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e4e4e4; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.imgur.com/EXI0FXm.png" alt="Logo" style="max-width: 150px; height: auto;">
        </div>
        <h2 style="color: #4a4a4a; text-align: center; font-size: 24px; margin-bottom: 25px;">Verificación de correo electrónico</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Hola <strong>${username}</strong>,</p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${fullVerificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; transition: background-color 0.3s ease;">
            Confirmar mi correo electrónico
          </a>
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all; background-color: #f8f8f8; padding: 12px; border-radius: 6px; border-left: 4px solid #4CAF50; font-size: 14px; margin: 15px 0; color: #333;">
          ${fullVerificationUrl}
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Este enlace expirará en 24 horas.</p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Si no solicitaste esta verificación, puedes ignorar este correo electrónico.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e4; color: #888; font-size: 13px; text-align: center;">
          <p>Este es un correo electrónico automático, por favor no respondas a este mensaje.</p>
          <p style="margin-top: 5px;">© 2025 Choosit. Todos los derechos reservados.</p>
        </div>
      </div>
    `;
    
    return await sendMail(to, subject, html);
  }


