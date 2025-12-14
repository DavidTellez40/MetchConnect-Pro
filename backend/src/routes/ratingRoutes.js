// backend/src/routes/ratingRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

// 🛑 CORRECCIÓN: Eliminar esta línea, ya que no se necesita aquí.
// const Rating = require("../models/Rating"); 

const {
  createRating,
  getRatingsByMecanico,
  getStatsByMecanico,
} = require("../controllers/ratingController");

// ⭐ Crear valoración (solo conductor autenticado)
router.post("/", auth, createRating);

// 📋 Ver valoraciones de un mecánico (lista completa)
// Nota: Esta ruta solo devuelve el listado completo de valoraciones.
router.get("/mecanico/:mecanicoId", getRatingsByMecanico);

// backend/src/routes/ratingRoutes.js

// ... (código anterior) ...

// 📊 Estadísticas del mecánico (promedio, total, comentarios)
// 🛑 CORRECCIÓN CLAVE: Asegurarse de que el patrón de ruta coincida exactamente con el frontend
router.get("/mecanico/:id/stats", auth, getStatsByMecanico); // ⬅️ RUTA CORREGIDA

// ... (código siguiente) ...

// 🛑 ELIMINADA: La ruta duplicada y confusa para estadísticas
/*
router.get("/mecanico/:id", auth, async (req, res) => {
  try {
    // ... código eliminado que duplica la lógica de getStatsByMecanico ...
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener valoraciones" });
  }
});
*/

module.exports = router;