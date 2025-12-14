const Vehicle = require("../models/Vehicle");

/* =========================
   CREAR VEHÍCULO
========================= */
exports.createVehicle = async (req, res) => {
  try {
    const { placa, modelo, anio } = req.body;

    const vehicle = new Vehicle({
      conductor: req.user.id,
      placa,
      modelo,
      anio
    });

    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear vehículo" });
  }
};

/* =========================
   LISTAR VEHÍCULOS DEL CONDUCTOR
========================= */
exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ conductor: req.user.id });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener vehículos" });
  }
};

/* Actualizar vehículo */
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, conductor: req.user.id },
      req.body,
      { new: true }
    );

    if (!vehicle)
      return res.status(404).json({ msg: "Vehículo no encontrado" });

    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar vehículo" });
  }
};

/* Eliminar vehículo */
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      conductor: req.user.id,
    });

    if (!vehicle)
      return res.status(404).json({ msg: "Vehículo no encontrado" });

    res.json({ msg: "Vehículo eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al eliminar vehículo" });
  }
};