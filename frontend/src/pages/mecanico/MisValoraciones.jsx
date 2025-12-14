// frontend/src/pages/mecanico/MisValoraciones.jsx

import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function MisValoraciones() {
  // 🛑 CORRECCIÓN 1: Extraer el estado 'loading' del contexto como 'authLoading'
  const { user, loading: authLoading } = useContext(AuthContext); 
  
  const [stats, setStats] = useState({ promedio: '0.0', total: 0, comentarios: [] });
  const [loading, setLoading] = useState(true); // Estado de carga de la página actual

  const loadValoraciones = async () => {
    
    // 🛑 CORRECCIÓN 2: Mover el setLoading(false) para garantizar que se ejecute si no hay ID
    if (!user?._id) {
      setLoading(false);
      return;
    }
    
    // Si hay ID, iniciamos el loading (aunque el useEffect ya lo hace, es un buen chequeo)
    setLoading(true);

    try {
      // Llama a la API solo cuando el ID del usuario está disponible
      const { data } = await API.get(`/ratings/mecanico/${user._id}/stats`);
      
      setStats({
          promedio: data.promedio || '0.0', 
          total: data.total || 0,
          comentarios: data.comentarios || [],
      });
    } catch (err) {
      console.error("Error al cargar valoraciones:", err);
      setStats({ promedio: '0.0', total: 0, comentarios: [] });
    } finally {
      // Esta línea se ejecuta al finalizar la llamada API
      setLoading(false); 
    }
  };

  useEffect(() => {
    // 🛑 CORRECCIÓN 3: Esperar a que la autenticación (authLoading) termine
    // El useEffect se ejecutará cuando authLoading pase de true a false,
    // garantizando que user?._id ya haya sido cargado.
    if (!authLoading) {
      loadValoraciones();
    }
    // Dependencias en authLoading y user?._id
  }, [user?._id, authLoading]);

  // 🛑 CORRECCIÓN 4: Mostrar el mensaje de carga si la autenticación sigue pendiente O si los datos están cargando.
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando valoraciones...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Mis Valoraciones
      </h1>

      {/* Tarjetas de Estadísticas (Refleja el Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Calificación promedio</h2>
          <p className="text-5xl font-bold text-yellow-500">
            {stats.promedio} <span className="text-2xl">★</span> 
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total de valoraciones</h2>
          <p className="text-5xl font-bold text-gray-800">{stats.total}</p>
        </div>
      </div>


      <h2 className="text-2xl font-bold text-gray-700 mb-4">Comentarios de Clientes</h2>
      
      {stats.comentarios.length === 0 ? (
          <p className="text-center text-gray-600">Aún no tienes comentarios de clientes.</p>
      ) : (
        <div className="space-y-4">
          {stats.comentarios.map((rating, index) => (
            <div key={rating.fecha || index} className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
              <p className="text-lg font-semibold flex items-center">
                {/* Estrellas de la calificación */}
                {Array(rating.estrellas).fill(0).map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                ))}
                {Array(5 - rating.estrellas).fill(0).map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                ))}
                <span className="ml-3 text-sm font-normal text-gray-500">
                    por {rating.conductor || "Conductor anónimo"}
                </span>
              </p>
              
              <p className="mt-2 text-gray-700 italic">
                "{rating.comentario || "Sin comentario."}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}