const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

/* =========================
   REGISTRO
========================= */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      nombre,
      correo,
      contrasena,
      rol,
      telefono,
      documento,
      vehiculo,
      especialidad,
      taller,
    } = req.body;

    let user = await User.findOne({ correo });
    if (user) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    user = new User({
      nombre,
      correo,
      contrasena: hash,
      rol,
      telefono,
      documento,
      especialidad: rol === "mecanico" ? especialidad : null,
      taller: rol === "mecanico" ? taller : null,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { correo, contrasena } = req.body;

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  const { correo } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ msg: "Correo no registrado" });
    }

    // Token plano
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token hasheado
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 10; // 10 min

    await user.save();

    const { sendResetEmail } = require("../utils/email");
    await sendResetEmail(correo, resetToken);

    res.json({ msg: "Se envió un enlace de recuperación a tu correo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { contrasena } = req.body;

  if (!contrasena || contrasena.length < 6) {
    return res.status(400).json({ msg: "Contraseña inválida" });
  }

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(contrasena, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Contraseña actualizada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};