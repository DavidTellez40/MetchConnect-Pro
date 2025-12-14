const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    placa: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    modelo: {
      type: String,
      required: true,
    },
    anio: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);