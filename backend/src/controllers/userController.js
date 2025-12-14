// src/controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-contrasena');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.contrasena) delete updates.contrasena; // cambiar contraseña por endpoint separado
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-contrasena');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Endpoint para admin: listar usuarios 
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-contrasena');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Actualizar usuario por ID (solo admin)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // evitar que cambien la contraseña desde este endpoint
    if (updates.contrasena) delete updates.contrasena;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select('-contrasena');

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Eliminar usuario por ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { actual, nueva } = req.body;

    // Validar datos
    if (!actual || !nueva) {
      return res.status(400).json({ msg: "Los campos son obligatorios" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Validar contraseña actual
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(actual, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(nueva, salt);

    await user.save();

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};