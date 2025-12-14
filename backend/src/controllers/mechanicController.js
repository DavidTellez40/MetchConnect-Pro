const User = require("../models/User");

/* =========================
   BUSCAR MECÁNICOS
========================= */
exports.searchMechanics = async (req, res) => {
  try {
    const { especialidad } = req.query;

    let filter = { rol: "mecanico", estado: "activo" };

    if (especialidad) {
      filter.especialidad = { $regex: especialidad, $options: "i" };
    }

    const mechanics = await User.find(filter).select(
      "nombre correo especialidad taller"
    );

    res.json(mechanics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al buscar mecánicos" });
  }
};