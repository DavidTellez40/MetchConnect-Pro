const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const { sendReminderEmail } = require("../utils/email");

cron.schedule("*/10 * * * *", async () => {
  console.log("⏰ Revisando citas para recordatorio...");

  const ahora = new Date();
  const limite = new Date(ahora.getTime() + 1000 * 60 * 60 * 24); // 24h

  const citas = await Appointment.find({
    fecha: { $gte: ahora, $lte: limite },
    estado: "aceptada",
    recordatorioEnviado: false
  }).populate("conductor", "correo nombre");

  for (const cita of citas) {
    await sendReminderEmail(
      cita.conductor.correo,
      cita.conductor.nombre,
      cita.fecha,
      cita.servicio
    );

    cita.recordatorioEnviado = true;
    await cita.save();
  }
});