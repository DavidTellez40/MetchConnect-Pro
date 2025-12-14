// frontend/src/pages/mecanico/MisCitasMecanico.jsx

import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function MisCitasMecanico() {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las citas del mecánico
  const loadCitas = async () => {
    // 🛑 Asegurar que el ID del usuario esté disponible
    if (!user?._id) {
        setLoading(false);
        return;
    }

    try {
      // 🛑 Usar user._id como ID del mecánico
      const { data } = await API.get(`/appointments/mecanico/${user._id}`);
      setCitas(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) { 
        loadCitas();
    }
  }, [user]);

  // Cambiar estado de cita (Aceptar/Rechazar)
  const actualizarEstado = async (id, estado) => {
    try {
      await API.put(`/appointments/${id}/estado`, { estado });
      loadCitas(); // Recargar citas
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado");
    }
  };

  // 🛑 Función para Finalizar Cita
  const finalizarCita = async (id) => {
    try {
      await API.put(`/appointments/${id}/finalizar`);
      loadCitas(); // Recargar citas
    } catch (err) {
      console.error(err);
      alert("Error al finalizar cita");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Citas Asignadas
      </h1>

      {citas.length === 0 ? (
        <p className="text-center text-gray-600">No tienes citas asignadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {citas.map((cita) => (
            <div
              key={cita._id}
              className="bg-white rounded-2xl shadow-md p-6 border"
            >
              <p className="text-xl font-semibold text-gray-800">
                {cita.servicio}
              </p>

              <p className="text-gray-600 mt-1">
                <strong>Fecha:</strong> {new Date(cita.fecha).toLocaleString()}
              </p>

              <p className="text-gray-600">
                <strong>Conductor:</strong> {cita.conductor?.nombre}
              </p>

              <p
                className={`mt-3 inline-block px-3 py-1 rounded-lg text-white font-semibold
                  ${
                    cita.estado === "pendiente"
                      ? "bg-yellow-500"
                      : cita.estado === "aceptada"
                      ? "bg-green-600"
                      : cita.estado === "rechazada"
                      ? "bg-red-600"
                      : "bg-blue-600" // Asumimos finalizada o cancelada es azul
                  }
                `}
              >
                {cita.estado.toUpperCase()}
              </p>

              {/* Botones para citas PENDIENTES */}
              {cita.estado === "pendiente" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => actualizarEstado(cita._id, "aceptada")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
                  >
                    Aceptar
                  </button>

                  <button
                    onClick={() => actualizarEstado(cita._id, "rechazada")}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl"
                  >
                    Rechazar
                  </button>
                </div>
              )}
                
              {/* Botón para citas ACEPTADAS */}
              {cita.estado === "aceptada" && (
                <div className="mt-4">
                  <button
                    onClick={() => finalizarCita(cita._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
                  >
                    Finalizar Cita
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}