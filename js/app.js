const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware para segurança
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Nodemailer para Outlook
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER, // Email do remetente
    pass: process.env.EMAIL_PASS, // Senha ou chave do app
  },
});

// Rota para receber dados do formulário
app.post("/send-email", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      branding,
      siteType,
      budget,
      comments,
    } = req.body;

    const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to: "support@caza-tech.com", // Email da empresa
      subject: "Novo Formulário Recebido - CazaTech",
      text: `
                Nome: ${name}
                Email: ${email}
                Telefone: ${phone}
                Empresa: ${company}
                Identidade Visual: ${branding}
                Tipo de Site: ${siteType}
                Orçamento: R$ ${budget || "Não informado"}
                Comentários: ${comments || "Nenhum"}
            `,
    };

    // Enviar o email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Formulário enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({
      message: "Erro ao enviar o formulário. Tente novamente mais tarde.",
    });
  }
});

// Servir os arquivos estáticos
app.use(express.static("public"));

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
