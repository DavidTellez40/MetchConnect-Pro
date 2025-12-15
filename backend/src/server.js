require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ============================
// 🚨 CONFIGURACIÓN DE CORS PARA PRODUCCIÓN EN RENDER 🚨
// ============================
const allowedOrigins = [
    // La URL de tu Frontend desplegado en Render (¡Revisa que el nombre sea correcto!)
    'https://metchconnect-pro-1.onrender.com', 
    // Desarrollo local (si sigues trabajando en local)
    'http://localhost:5173',
];

const corsOptions = {
    // Función para verificar si el origen (dominio) de la petición está permitido
    origin: function (origin, callback) {
        // Permite peticiones sin origen (como Postman o del mismo servidor) o si el origen está en la lista permitida
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Error de CORS si viene de un dominio no autorizado
            callback(new Error('No permitido por CORS. Origen: ' + origin)); 
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Crucial para manejar tokens/cookies
};

// Aplicar el middleware de CORS con las opciones configuradas
app.use(cors(corsOptions));
// ============================

app.use(express.json());

// ============================
// 🚨 RUTA DE PRUEBA (HEALTH CHECK) 🚨
// ============================
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "MetchConnect-Pro API está funcionando y lista.",
        environment: process.env.NODE_ENV || "development"
    });
});
// ============================


// ============================
//  IMPORTAR RUTAS
// ============================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes"); 
const maintenanceRoutes = require("./routes/maintenanceRoutes");
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
//  REGISTRAR RUTAS
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
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