const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
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
      type: Date,
      required: true,
    },

    servicio: {
      type: String,
      required: true,
    },

    observaciones: {
      type: String,
    },

    estado: {
      type: String,
      enum: [
        "pendiente",     // creada por conductor
        "aceptada",      // aceptada por mecánico
        "rechazada",     // rechazada por mecánico
        "finalizada",    // trabajo terminado
        "cancelada"      // cancelada por conductor
      ],
      default: "pendiente",
    },

    // Relación con valoración
    valoracion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
      default: null,
    },

    // Confirmación de que la cita ya fue valorada
    valorada: {
      type: Boolean,
      default: false,
    },

    //  indica si ya se envió el recordatorio de la cita
    recordatorioEnviado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);