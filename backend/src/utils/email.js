const nodemailer = require("nodemailer");

// ============================
// CONFIGURACIÓN DEL TRANSPORTER
// ============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // correo remitente
    pass: process.env.EMAIL_PASS, // clave de aplicación de Gmail
  },
});

// =================================================
// EMAIL: RECUPERACIÓN DE CONTRASEÑA 
// =================================================
exports.sendResetEmail = async (to, token) => {
  const link = `http://localhost:5173/reset-password/${token}`;

  await transporter.sendMail({
    from: `"MetchConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Solicitud de recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>

      <a href="${link}" style="
        display:inline-block;
        padding:10px 20px;
        background:#2563eb;
        color:#fff;
        border-radius:8px;
        text-decoration:none;
      ">Restablecer contraseña</a>

      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `,
  });
};

// =================================================
// EMAIL: RECORDATORIO DE CITA 
// =================================================
exports.sendReminderEmail = async (correo, nombre, fecha, servicio) => {
  await transporter.sendMail({
    from: `"MetchConnect Pro" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: "⏰ Recordatorio de cita - MetchConnect Pro",
    html: `
      <h2>Hola ${nombre}</h2>
      <p>Este es un recordatorio de tu cita programada:</p>

      <ul>
        <li><strong>Servicio:</strong> ${servicio}</li>
        <li><strong>Fecha:</strong> ${new Date(fecha).toLocaleString()}</li>
      </ul>

      <p>Gracias por usar <strong>MetchConnect Pro</strong></p>
    `,
  });
};
