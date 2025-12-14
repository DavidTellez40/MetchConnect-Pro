// src/models/Cita.js
const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mecanico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  motivo: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "aceptada", "rechazada", "completada"],
    default: "pendiente",
  },
}, { timestamps: true });

module.exports = mongoose.model("Cita", citaSchema);