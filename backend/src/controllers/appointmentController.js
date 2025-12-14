// src/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/*
  CREAR CITA
*/
exports.createAppointment = async (req, res) => {
  // Validaciones
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { mecanico, fecha, servicio, observaciones } = req.body;

    const appointment = new Appointment({
      conductor: req.user.id,
      mecanico,
      fecha,
      servicio,
      observaciones
    });

    await appointment.save();

    return res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


/*
  LISTAR CITAS POR USUARIO (conductor o mecánico)
*/
exports.listByUser = async (req, res) => {
  try {
    let citas;

    if (req.user.rol === 'mecanico') {
      citas = await Appointment.find({ mecanico: req.user.id })
        .populate('conductor mecanico', '-contrasena');
    } else {
      citas = await Appointment.find({ conductor: req.user.id })
        .populate('conductor mecanico', '-contrasena');
    }

    return res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


/*
  OBTENER CITAS DEL CONDUCTOR POR ID
*/
exports.getAppointmentsByConductor = async (req, res) => {
  try {
    const citas = await Appointment.find({ conductor: req.params.id })
      .populate("mecanico", "nombre especialidad")
      .sort({ fecha: 1 });

    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener citas del conductor" });
  }
};


/*
  OBTENER CITAS DEL MECÁNICO POR ID
*/
exports.getAppointmentsByMecanico = async (req, res) => {
  try {
    const citas = await Appointment.find({ mecanico: req.params.id })
      .populate("conductor", "nombre telefono vehiculo")
      .sort({ fecha: 1 });

    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener citas del mecánico" });
  }
};


/*
  ACTUALIZAR ESTADO (la ruta usa "/estado")
*/
exports.updateAppointmentStatus = async (req, res) => {
  // Validaciones
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { estado } = req.body;
    
    // Si la actualización es a 'finalizada', usar la función más robusta
    if (estado === 'finalizada') {
        return exports.finalizarCita(req, res);
    }

    // Usar findByIdAndUpdate para los otros estados (aceptada, rechazada, etc.)
    const cita = await Appointment.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    res.json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar estado" });
  }
};

// Cancelar cita (conductor)
exports.cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Appointment.findById(id);

    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    // Solo el conductor dueño puede cancelar
    if (cita.conductor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    // No se puede cancelar si ya está finalizada
    if (cita.estado === "finalizada") {
      return res.status(400).json({ msg: "La cita ya fue finalizada" });
    }

    cita.estado = "cancelada";
    await cita.save();

    res.json({ msg: "Cita cancelada correctamente", cita });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};


/*
  ✅ FINALIZAR CITA (Mecánico) - Lógica robusta
  Se asegura de que el estado sea 'aceptada' y registra la fecha de finalización.
*/
exports.finalizarCita = async (req, res) => { // 🛑 Se usa 'finalizarCita'
  try {
    const cita = await Appointment.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }
    
    // 🛑 VALIDACIÓN CLAVE: Solo se puede finalizar si está 'aceptada'
    if (cita.estado !== 'aceptada') {
        return res.status(400).json({ msg: "La cita debe estar aceptada para finalizar." });
    }

    // 🛑 ACTUALIZACIÓN CLAVE: Actualizar estado y la fecha de finalización
    cita.estado = 'finalizada';
    cita.finalizadaAt = new Date(); 
    await cita.save();

    res.json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al finalizar cita" });
  }
};