const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    cita: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true, // una sola valoración por cita
    },

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

    estrellas: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comentario: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", ratingSchema);