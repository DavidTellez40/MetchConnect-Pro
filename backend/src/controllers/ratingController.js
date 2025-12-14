const Rating = require("../models/Rating");
const Appointment = require("../models/Appointment");
// 🛑 CORRECCIÓN 1: Asegurarse que User y mongoose estén importados AL INICIO
const User = require("../models/User"); 
const mongoose = require("mongoose"); // Necesario para mongoose.Types.ObjectId

// Crear valoración (solo conductor)
exports.createRating = async (req, res) => {
  try {
    const { citaId, estrellas, comentario } = req.body;
    const conductorId = req.user.id;

    const cita = await Appointment.findById(citaId);
    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    // Validaciones clave
    if (cita.conductor.toString() !== conductorId) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    if (cita.estado !== "finalizada") {
      return res
        .status(400)
        .json({ msg: "Solo puedes valorar citas finalizadas" });
    }

    // Verificar si ya fue valorada
    const existente = await Rating.findOne({ cita: citaId });
    if (existente) {
      return res.status(400).json({ msg: "Esta cita ya fue valorada" });
    }

    const rating = await Rating.create({
      cita: citaId,
      conductor: conductorId,
      mecanico: cita.mecanico,
      estrellas,
      comentario,
    });

    // Vincular la valoración con la cita
    cita.valoracion = rating._id;
    cita.valorada = true; // ✅ MARCAR COMO VALORADA
    await cita.save();

    res.status(201).json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear valoración" });
  }
};

// Obtener valoraciones de un mecánico (Lista completa)
exports.getRatingsByMecanico = async (req, res) => {
  try {
    let mecanicoId = req.params.mecanicoId;

    // Si el ID es inválido o 'undefined', usa el ID del usuario autenticado
    if (!mecanicoId || mecanicoId === 'undefined') {
        mecanicoId = req.user.id;
    }

    if (!mecanicoId) {
        return res.status(400).json({ msg: "ID de mecánico no proporcionado." });
    }

    const ratings = await Rating.find({ mecanico: mecanicoId })
      .populate("conductor", "nombre")
      .populate("cita", "servicio fecha")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener valoraciones" });
  }
};

// 📊 Estadísticas de valoraciones por mecánico (Promedio y Total)
exports.getStatsByMecanico = async (req, res) => {
    let mecanicoId = req.params.id;

    if (!mecanicoId || mecanicoId === 'undefined') {
        mecanicoId = req.user.id;
    }

    if (!mecanicoId) {
        return res.status(400).json({ msg: "ID de mecánico no proporcionado." });
    }

    try {
        // 🛑 CORRECCIÓN 2: Eliminar las importaciones internas
        // const mongoose = require('mongoose'); // ELIMINAR
        // const User = mongoose.model('User'); // ELIMINAR

        // La agregación es robusta y debe funcionar
        const statsPipeline = await Rating.aggregate([
            {
                // 1. Filtrar solo las valoraciones de este mecánico, asegurando el casting a ObjectId
                $match: {
                    mecanico: new mongoose.Types.ObjectId(mecanicoId)
                }
            },
            {
                // 2. Agrupar para calcular el promedio y el total
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    promedio: { $avg: "$estrellas" },
                    ratingsData: {
                        $push: {
                            estrellas: "$estrellas",
                            comentario: "$comentario",
                            conductorId: "$conductor", 
                            createdAt: "$createdAt"
                        }
                    }
                }
            },
            {
                // 3. Proyectar y reformatear la salida final
                $project: {
                    _id: 0,
                    total: "$total",
                    promedio: { $round: ["$promedio", 1] },
                    ratingsData: "$ratingsData"
                }
            }
        ]);

        if (statsPipeline.length === 0) {
            return res.json({
                promedio: '0.0',
                total: 0,
                comentarios: [],
            });
        }

        const data = statsPipeline[0];

        // 4. Poblar los nombres de los conductores usando los IDs obtenidos (post-aggregation)
        const comentarios = await Promise.all(data.ratingsData.map(async (r) => {
            // Usamos el modelo User importado al inicio
            const conductor = await User.findById(r.conductorId, 'nombre');
            return {
                estrellas: r.estrellas,
                comentario: r.comentario,
                conductor: conductor ? conductor.nombre : "Conductor Desconocido",
                fecha: r.createdAt,
            };
        }));


        res.json({
            promedio: data.promedio.toFixed(1), // Asegurar el formato "0.0"
            total: data.total,
            comentarios: comentarios.reverse(), // Mostrar el más reciente primero
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor al calcular estadísticas." });
    }
};