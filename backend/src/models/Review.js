// src/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    cita: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true // una sola valoración por cita
    },

    mecanico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    comentario: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
