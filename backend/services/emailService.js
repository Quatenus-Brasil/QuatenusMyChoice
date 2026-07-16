import axios from "axios";

const sendEmail = async (to, name, subject, content) => {
  const URL = "https://api.brevo.com/v3/smtp/email";

  const emailData = {
    sender: {
      name: process.env.BREVO_NAME,
      email: process.env.BREVO_EMAIL,
    },
    to: [{ email: to, name: name }],
    subject: subject,
    htmlContent: content,
  };

  try {
    await axios.post(URL, emailData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    });
  } catch (error) {
    // console.error("Erro ao enviar email:", error.response?.data || error.message);
    throw error;
  }
};

const sendWelcomeEmail = async (userEmail, userName, temporaryPassword) => {
  const subject = "Bem-vindo! Sua conta foi criada";
  const htmlContent = `
    <h1>Olá, ${userName}!</h1>
    <p>Sua conta foi criada com sucesso no MyChoice.</p>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>Senha temporária:</strong> ${temporaryPassword}</p>
    <p>Por favor, faça login e altere sua senha na primeira oportunidade.</p>
    <br>
    <p>MyChoice</p>
    <p>Este email foi enviado automaticamente. Por favor não responda.</p>
  `;

  return await sendEmail(userEmail, userName, subject, htmlContent);
};

export { sendEmail, sendWelcomeEmail };
