import { useState } from "react";
// 🛑 AGREGAR useLocation para obtener el ID del mecánico
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import API from "../../api/api";

export default function ValorarMecanico() {
  const { citaId } = useParams();
  const navigate = useNavigate();
  // 🛑 OBTENER EL ID DEL MECÁNICO DEL ESTADO DE NAVEGACIÓN
  const { state } = useLocation();
  const mecanicoId = state?.mecanicoId; 

  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Manejo de redirección si falta el ID del mecánico
  if (!mecanicoId) {
    setTimeout(() => {
        alert("Error: ID del mecánico no encontrado. Vuelve a intentar desde Mis Citas.");
        navigate("/conductor/mis-citas");
    }, 100);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (estrellas < 1) {
      return setError("Selecciona al menos 1 estrella");
    }

    // Dentro de la función handleSubmit en ValorarMecanico.jsx
// ...
    try {
      setLoading(true);

      // 🛑 CAMBIAR /reviews por /ratings
      await API.post("/ratings", { //
        citaId,
        estrellas,
        comentario,
      });
// ...

      alert("Valoración enviada correctamente. ¡Reputación del mecánico actualizada!");
      navigate("/conductor/mis-citas");
    } catch (err) {
      setError(
        err.response?.data?.msg || "No se pudo enviar la valoración"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">
          Valorar mecánico (Cita: {citaId.substring(0, 8)}...)
        </h1>

        {/* ⭐ ESTRELLAS */}
        <div className="flex justify-center gap-2 text-4xl mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setEstrellas(n)}
              className={`${
                n <= estrellas
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* COMENTARIO */}
        <textarea
          placeholder="Comentario (opcional)"
          className="border w-full px-4 py-2 rounded-xl mb-4"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        {error && (
          <p className="text-red-600 mb-3 text-center">
            {error}
          </p>
        )}

        <button
          disabled={loading || estrellas === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold"
        >
          {loading ? "Enviando..." : "Enviar valoración"}
        </button>
      </form>
    </div>
  );
}