const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },

    telefono: { type: String },
    documento: { type: String },

    rol: {
      type: String,
      enum: ["conductor", "mecanico", "admin"],
      default: "conductor",
    },

    // Mecánico
    taller: { type: String },
    especialidad: { type: String },


    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },

    // 🔐 RECUPERACIÓN DE CONTRASEÑA
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);