const Maintenance = require('../models/Maintenance');
const Appointment = require('../models/Appointment');

exports.createMaintenance = async (req, res) => {
  try {
    const { cita, descripcion, costo } = req.body;

    if (!cita || !descripcion) {
      return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    const appointment = await Appointment.findById(cita);
    if (!appointment) return res.status(404).json({ msg: 'La cita no existe' });

    // Solo el mecánico asignado puede crear mantenimiento
    if (appointment.mecanico.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    const maintenance = new Maintenance({
      cita,
      descripcion,
      costo,
      mecanico: req.user.id,
      conductor: appointment.conductor,
      fecha: new Date()
    });

    await maintenance.save();

    return res.status(201).json(maintenance);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

exports.listMaintenance = async (req, res) => {
  try {
    const maints = await Maintenance.find()
      .populate('mecanico conductor cita');
    res.json(maints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};