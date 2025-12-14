const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

const {
  createAppointment,
  getAppointmentsByConductor,
  getAppointmentsByMecanico,
  updateAppointmentStatus,
  cancelarCita,
  finalizarCita // 🛑 CORREGIDO: Usar el nombre de la función robusta
} = require("../controllers/appointmentController");

// ==========================
// Crear cita
// ==========================
router.post(
  "/",
  [
    auth,
    check("mecanico").notEmpty().withMessage("El mecánico es obligatorio"),
    check("fecha").notEmpty().withMessage("La fecha es obligatoria"),
  ],
  createAppointment
);

// ==========================
// Listar citas del conductor
// ==========================
router.get("/conductor/:id", auth, getAppointmentsByConductor);

// ==========================
// Listar citas del mecánico
// ==========================
router.get("/mecanico/:id", auth, getAppointmentsByMecanico);

// ==========================
// Actualizar estado de cita (Usado para Aceptar/Rechazar)
// ==========================
router.put(
  "/:id/estado",
  [
    auth,
    check("estado")
      .isIn(["pendiente", "aceptada", "rechazada", "finalizada", "cancelada"])
      .withMessage("Estado inválido"),
  ],
  updateAppointmentStatus
);

// ==========================
//  Cancelar cita (Conductor)
// ==========================
router.put("/:id/cancelar", auth, cancelarCita);

// ==========================
//  Finalizar cita (Mecánico) 🛑 CORREGIDO: Ahora usa finalizarCita
// ==========================
router.put("/:id/finalizar", auth, finalizarCita); 


module.exports = router;