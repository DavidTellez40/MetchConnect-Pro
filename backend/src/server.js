// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// ============================
//  IMPORTAR RUTAS (SOLO las CONSOLIDADAS)
// ============================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes"); 
const maintenanceRoutes = require("./routes/maintenanceRoutes");
// Ya no se importan reviewRoutes ni citaRoutes
const ratingRoutes = require("./routes/ratingRoutes"); 
const vehicleRoutes = require("./routes/vehicleRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");

// ============================
//  CONECTAR BASE DE DATOS
// ============================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/metchconnect";
connectDB(MONGO_URI);

// ============================
// ACTIVAR JOBS (CRON)
// ============================
require("./jobs/reminderJob");

// ============================
//  REGISTRAR RUTAS (SOLO las CONSOLIDADAS)
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
// Ya no se usan /api/reviews ni /api/citas
app.use("/api/ratings", ratingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/mechanics", mechanicRoutes);

// ============================
//  INICIAR SERVIDOR
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
);