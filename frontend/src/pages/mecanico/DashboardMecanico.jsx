import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Incluye useNavigate
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardMecanico() {
    
    // Extraer variables del contexto
    const { user, loading: authLoading, logout } = useContext(AuthContext); 
    const navigate = useNavigate(); // Inicializar useNavigate

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para manejar el cierre de sesión y la redirección
    const handleLogout = () => {
        logout(); 
        navigate("/"); 
    };

    useEffect(() => {
        
        // 1. Control de Autenticación
        if (authLoading) {
            setLoading(true);
            return;
        }
        
        // 2. Control de Existencia del Usuario (Usando _id)
        if (!user || !user._id) { 
            setLoading(false); 
            return;
        }

        const loadStats = async () => {
            setLoading(true); 
            try {
                // Usamos user._id en la llamada a la API
                const { data } = await API.get(
                    `/ratings/stats/${user._id}` // ⬅️ RUTA CORREGIDA
                );
                // Aseguramos que stats sea un objeto seguro
                setStats(data || { promedio: 0, total: 0, comentarios: [] });

            } catch (err) {
                console.error("Error al cargar estadísticas:", err);
                // Aseguramos que stats sea un objeto seguro en caso de error 500
                setStats({ promedio: 0, total: 0, comentarios: [] });
            }
            setLoading(false);
        };

        loadStats();
        
    }, [user, authLoading]); 

    
    // --- COMPONENTE DE CARGA ---
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl text-gray-600">Cargando dashboard del mecánico...</p>
            </div>
        );
    }

    // --- RENDERIZADO FINAL (Todo está cargado y funcional) ---
    return (
        <div className="min-h-screen bg-gray-100">

            {/* NAVBAR */}
            <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
                <h2 className="text-xl font-semibold">MetchConnect • Mecánico</h2>

                <div className="flex items-center gap-4">
                    <span className="font-medium">{user?.nombre}</span> 
                    <button
                        onClick={handleLogout} // Llama a la función de logout y redirección
                        className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto p-6">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Panel del Mecánico
                </h1>

                {/* ACCIONES DEL MECÁNICO (FUNCIONALIDAD RESTAURADA) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Link
                        to="/mecanico/mis-citas"
                        className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            Solicitudes de citas
                        </h3>
                        <p className="text-gray-600">
                            Acepta o rechaza citas de conductores.
                        </p>
                    </Link>

                    <Link
                        to="/perfil"
                        className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            Mi perfil
                        </h3>
                        <p className="text-gray-600">
                            Actualiza la información de tu taller y especialidad.
                        </p>
                    </Link>

                    <Link
                        to="/mecanico/valoraciones"
                        className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            Mis valoraciones
                        </h3>
                        <p className="text-gray-600">
                            Revisa lo que opinan tus clientes.
                        </p>
                    </Link>
                </div>

                {/* RESUMEN DE REPUTACIÓN (Usando stats && ...) */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow p-6 text-center">
                            <p className="text-gray-500">Calificación promedio</p>
                            <p className="text-5xl font-bold text-yellow-500">
                                ⭐ {stats.promedio}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow p-6 text-center">
                            <p className="text-gray-500">Total de valoraciones</p>
                            <p className="text-5xl font-bold">
                                {stats.total}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}