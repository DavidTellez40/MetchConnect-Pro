// src/models/Maintenance.js
const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  cita: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  mecanico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, required: true },
  descripcion: { type: String, required: true },
  costo: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);