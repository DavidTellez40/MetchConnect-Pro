import { Link } from "react-router-dom";

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Panel del Administrador
        </h1>

        <p className="text-gray-600 mb-8">
          Administra usuarios, roles y el funcionamiento general de la plataforma.
        </p>

        {/* Botón para gestionar usuarios */}
        <Link
          to="/admin/usuarios"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center font-semibold mb-4 transition"
        >
          Gestionar Usuarios
        </Link>

        <Link to="/perfil" className="...">Mi Perfil</Link>

      </div>
    </div>
  );
}