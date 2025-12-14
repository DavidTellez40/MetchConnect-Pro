import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function MisCitas() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCitas = async () => {
    try {
      const { data } = await API.get(`/appointments/conductor/${user.id}`);
      setCitas(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      loadCitas();
    }
  }, [user?.id]);

  const cancelarCita = async (id) => {
    if (!confirm("¿Deseas cancelar esta cita?")) return;

    try {
      await API.put(`/appointments/${id}/cancelar`);
      loadCitas();
    } catch (err) {
      alert("No se pudo cancelar la cita");
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
      <h1 className="text-3xl font-bold mb-6 text-center">
        Mis Citas
      </h1>

      {citas.length === 0 ? (
        <p className="text-center text-gray-600">
          Aún no tienes citas registradas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {citas.map((cita) => (
            <div
              key={cita._id}
              className="bg-white rounded-2xl shadow-md p-6 border"
            >
              <p className="text-xl font-semibold">
                {cita.servicio}
              </p>

              <p className="text-gray-600 mt-1">
                <strong>Fecha:</strong>{" "}
                {new Date(cita.fecha).toLocaleString()}
              </p>

              <p className="text-gray-600">
                <strong>Mecánico:</strong>{" "}
                {cita.mecanico?.nombre || "No asignado"}
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 rounded-lg text-white font-semibold
                  ${
                    cita.estado === "pendiente"
                      ? "bg-yellow-500"
                      : cita.estado === "aceptada"
                      ? "bg-green-600"
                      : cita.estado === "rechazada"
                      ? "bg-red-600"
                      : cita.estado === "cancelada"
                      ? "bg-gray-500"
                      : cita.estado === "finalizada"
                      ? "bg-blue-600"
                      : "bg-indigo-600"
                  }
                `}
              >
                {cita.estado}
              </span>

              {(cita.estado === "pendiente" ||
                cita.estado === "aceptada") && (
                <button
                  onClick={() => cancelarCita(cita._id)}
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold"
                >
                  Cancelar cita
                </button>
              )}

              {/* 🛑 CORRECCIÓN: Pasar el ID del mecánico en el estado */}
              {cita.estado === "finalizada" && (
                <button
                  onClick={() =>
                    navigate(`/conductor/valorar/${cita._id}`, { 
                        state: { mecanicoId: cita.mecanico?._id } 
                    })
                  }
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold"
                >
                  Valorar mecánico
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}