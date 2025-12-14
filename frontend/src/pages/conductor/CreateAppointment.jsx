// ================================
// IMPORTS
// ================================
import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ⭐ Componente para mostrar estrellas visuales
import StarRating from "../../components/common/StarRating";

// ================================
// COMPONENTE PRINCIPAL
// ================================
export default function CreateAppointment() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================================
  // ESTADOS
  // ================================
  const [mecanicos, setMecanicos] = useState([]);

  const [form, setForm] = useState({
    mecanico: "",
    fecha: "",
    servicio: "",
    observaciones: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // CARGAR MECÁNICOS DESDE BACKEND
  // ================================
  useEffect(() => {
    const loadMecanicos = async () => {
      try {
        const { data } = await API.get("/users/mecanicos");

        // ⭐ ORDENAR MECÁNICOS POR MEJOR CALIFICACIÓN
        const ordenados = [...data].sort(
          (a, b) => b.promedio - a.promedio
        );

        setMecanicos(ordenados);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los mecánicos.");
      }
    };

    loadMecanicos();
  }, []);

  // ================================
  // MANEJO DE INPUTS
  // ================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // ENVIAR FORMULARIO
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validaciones básicas
    if (!form.mecanico) {
      setError("Debes seleccionar un mecánico.");
      setLoading(false);
      return;
    }

    if (!form.fecha) {
      setError("Debes seleccionar una fecha.");
      setLoading(false);
      return;
    }

    if (!form.servicio.trim()) {
      setError("El servicio es obligatorio.");
      setLoading(false);
      return;
    }

    try {
      // Enviar cita al backend
      await API.post("/appointments", {
        conductor: user.id,
        mecanico: form.mecanico,
        fecha: form.fecha,
        servicio: form.servicio,
        observaciones: form.observaciones,
      });

      setSuccess("✓ Cita creada exitosamente.");

      // Limpiar formulario
      setForm({
        mecanico: "",
        fecha: "",
        servicio: "",
        observaciones: "",
      });

      // Redireccionar
      setTimeout(() => navigate("/conductor/mis-citas"), 1500);

    } catch (err) {
      console.error(err);
      setError("No se pudo crear la cita.");
    }

    setLoading(false);
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border">

        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Crear Nueva Cita
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* ============================
              SELECCIONAR MECÁNICO
          ============================ */}
          <div>
            <label className="font-medium mb-1 block">Mecánico</label>

            <select
              name="mecanico"
              value={form.mecanico}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl"
            >
              <option value="">Selecciona un mecánico</option>

              {mecanicos.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nombre} — {m.especialidad}
                </option>
              ))}
            </select>

            {/* ⭐ INFORMACIÓN VISUAL DEL MECÁNICO SELECCIONADO */}
            {form.mecanico && (
              <div className="mt-2 bg-gray-50 p-3 rounded-xl border">
                {mecanicos
                  .filter((m) => m._id === form.mecanico)
                  .map((m) => (
                    <div key={m._id}>
                      <p className="font-semibold text-gray-800">
                        {m.nombre} — {m.especialidad}
                      </p>

                      {/* ⭐ Estrellas visuales */}
                      <StarRating value={m.promedio} />

                      <p className="text-sm text-gray-500">
                        {m.totalRatings} valoraciones
                      </p>

                      {m.taller && (
                        <p className="text-sm text-gray-500">
                          Taller: {m.taller}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ============================
              FECHA
          ============================ */}
          <div>
            <label className="font-medium mb-1 block">Fecha</label>
            <input
              type="datetime-local"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl"
            />
          </div>

          {/* ============================
              SERVICIO
          ============================ */}
          <div>
            <label className="font-medium mb-1 block">Servicio solicitado</label>
            <input
              type="text"
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl"
              placeholder="Cambio de aceite, revisión general..."
            />
          </div>

          {/* ============================
              OBSERVACIONES
          ============================ */}
          <div>
            <label className="font-medium mb-1 block">
              Observaciones (Opcional)
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows="3"
              className="w-full border px-4 py-2 rounded-xl"
              placeholder="Comportamiento extraño del motor..."
            ></textarea>
          </div>

          {/* ============================
              MENSAJES
          ============================ */}
          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-center font-medium">
              {success}
            </p>
          )}

          {/* ============================
              BOTÓN
          ============================ */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
          >
            {loading ? "Guardando..." : "Crear Cita"}
          </button>
        </form>
      </div>
    </div>
  );
}