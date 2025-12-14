const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

/* =========================
   REGISTER
========================= */
router.post(
  "/register",
  [
    check("nombre").notEmpty(),
    check("correo").isEmail(),
    check("contrasena").isLength({ min: 6 }),
    check("rol").isIn(["conductor", "mecanico", "admin"]),
  ],
  register
);

/* =========================
   LOGIN
========================= */
router.post(
  "/login",
  [
    check("correo").isEmail(),
    check("contrasena").notEmpty(),
  ],
  login
);

/* =========================
   PASSWORD RESET
========================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;