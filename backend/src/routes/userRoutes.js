// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const { 
  getProfile, 
  updateProfile, 
  listUsers, 
  updateUser, 
  deleteUser, 
  changePassword 
} = require('../controllers/userController');

const User = require('../models/User');

// ======================
// Rutas de Usuario común
// ======================
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

// Cambiar contraseña
router.put('/me/password', auth, changePassword);

// ======================
// Rutas de consultas públicas
// ======================

// Listar mecánicos con calificación (Usando campos pre-calculados del modelo User)
router.get('/mecanicos', async (req, res) => {
  try {
    const mecanicos = await User.find({ rol: "mecanico" })
      .select("nombre especialidad taller promedio totalValoraciones"); // 🛑 USAMOS LOS CAMPOS ACTUALIZADOS

    res.json(mecanicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener mecánicos" });
  }
});

// ======================
// Rutas de ADMIN
// ======================
router.get('/', auth, listUsers);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;