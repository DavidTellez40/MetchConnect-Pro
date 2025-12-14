import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function DashboardConductor() {
  const { user, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Cargar vehículos del conductor
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const { data } = await API.get("/vehicles/my");
        setVehicles(data);
      } catch (error) {
        console.error("Error cargando vehículos", error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-semibold">MetchConnect • Conductor</h2>

        <div className="flex items-center gap-4">
          <span className="font-medium">{user?.nombre}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ¡Hola, {user?.nombre}! 👋
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Bienvenido a tu panel como <strong>conductor</strong>. Desde aquí puedes crear citas,
          revisar su estado y gestionar tus solicitudes mecánicas.
        </p>

        {/* TARJETAS DE ACCIONES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <Link
            to="/conductor/crear-cita"
            className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Crear nueva cita
            </h3>
            <p className="text-gray-600">
              Agenda una nueva solicitud mecánica indicando fecha y tipo de servicio.
            </p>
          </Link>

          <Link
            to="/conductor/mis-citas"
            className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Mis citas
            </h3>
            <p className="text-gray-600">
              Revisa el estado de tus citas: aceptadas, pendientes o completadas.
            </p>
          </Link>

          <Link
            to="/conductor/vehiculos"
            className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Mis vehículos
            </h3>
            <p className="text-gray-600">
              Registra y gestiona tus vehículos.
            </p>
          </Link>

          <Link
            to="/perfil"
            className="bg-blue-600 text-white py-3 rounded-xl text-center hover:bg-blue-700 transition"
          >
            Mi Perfil
          </Link>
        </div>

        {/* INFORMACIÓN DEL VEHÍCULO */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            Información del vehículo
          </h3>

          {loadingVehicles ? (
            <p className="text-gray-600">Cargando vehículos...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-gray-700">
              Sin vehículo registrado
            </p>
          ) : (
            <div className="space-y-4">
              {vehicles.map((v) => (
                <div key={v._id} className="border-b pb-3">
                  <p><strong>Placa:</strong> {v.placa}</p>
                  <p><strong>Modelo:</strong> {v.modelo}</p>
                  <p><strong>Año:</strong> {v.anio}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}